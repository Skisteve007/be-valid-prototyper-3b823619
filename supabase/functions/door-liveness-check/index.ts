import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[DOOR-LIVENESS] ${step}${detailsStr}`);
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

    const { user_id, venue_id, scan_log_id, reason } = await req.json();
    
    if (!user_id) throw new Error("User ID is required");
    if (!venue_id) throw new Error("Venue ID is required");
    
    logStep("Request received", { user_id, venue_id, reason });

    const footprintSecretKey = Deno.env.get("FOOTPRINT_SECRET_KEY");
    const footprintPlaybookKey = Deno.env.get("FOOTPRINT_PLAYBOOK_KEY");
    
    if (!footprintSecretKey) throw new Error("FOOTPRINT_SECRET_KEY not configured");
    if (!footprintPlaybookKey) throw new Error("FOOTPRINT_PLAYBOOK_KEY not configured");

    // Get user's profile to get phone number
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('phone_number, full_name, user_id')
      .eq('user_id', user_id)
      .single();

    if (profileError || !profile) {
      logStep("Profile not found", { error: profileError?.message });
      throw new Error("User profile not found");
    }

    // Create Footprint liveness verification session
    const footprintResponse = await fetch("https://api.onefootprint.com/onboarding/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Footprint-Secret-Key": footprintSecretKey,
      },
      body: JSON.stringify({
        playbook_key: footprintPlaybookKey,
        bootstrap_data: {
          "id.phone_number": profile.phone_number || "",
        },
        options: {
          redirect_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/footprint-webhook`,
        },
        metadata: {
          verification_type: "door_liveness",
          venue_id: venue_id,
          scan_log_id: scan_log_id || null,
          reason: reason || "manual_request",
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

    // Log the liveness check request
    await supabaseClient.from('door_scan_log').insert({
      venue_id: venue_id,
      scanned_user_id: user_id,
      scan_result: 'liveness_pending',
      deny_reason: reason || 'Liveness verification requested',
    });

    return new Response(JSON.stringify({
      success: true,
      session_token: footprintData.token,
      verification_link: footprintData.link,
      message: "Liveness verification initiated",
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
