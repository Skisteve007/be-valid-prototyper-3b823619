import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[FOOTPRINT-LIVENESS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { phone_number } = await req.json();
    if (!phone_number) throw new Error("Phone number is required");
    logStep("Phone number received", { phone_number });

    const footprintSecretKey = Deno.env.get("FOOTPRINT_SECRET_KEY");
    const footprintPlaybookKey = Deno.env.get("FOOTPRINT_PLAYBOOK_KEY");
    
    if (!footprintSecretKey) throw new Error("FOOTPRINT_SECRET_KEY not configured");
    if (!footprintPlaybookKey) throw new Error("FOOTPRINT_PLAYBOOK_KEY not configured");

    // Create Footprint onboarding session
    const footprintResponse = await fetch("https://api.onefootprint.com/onboarding/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Footprint-Secret-Key": footprintSecretKey,
      },
      body: JSON.stringify({
        playbook_key: footprintPlaybookKey,
        bootstrap_data: {
          "id.phone_number": phone_number,
        },
        options: {
          redirect_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/footprint-webhook`,
        },
      }),
    });

    if (!footprintResponse.ok) {
      const errorText = await footprintResponse.text();
      logStep("Footprint API error", { status: footprintResponse.status, error: errorText });
      throw new Error(`Footprint API error: ${errorText}`);
    }

    const footprintData = await footprintResponse.json();
    logStep("Footprint session created", { sessionId: footprintData.token });

    // Upsert driver profile with session ID
    const { error: upsertError } = await supabaseClient
      .from("driver_profiles")
      .upsert({
        user_id: user.id,
        phone_number: phone_number,
        footprint_session_id: footprintData.token,
        verification_status: "pending",
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id",
      });

    if (upsertError) {
      logStep("Database upsert error", { error: upsertError.message });
      throw new Error(`Database error: ${upsertError.message}`);
    }

    logStep("Driver profile updated with session ID");

    return new Response(JSON.stringify({
      success: true,
      session_token: footprintData.token,
      verification_link: footprintData.link,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
