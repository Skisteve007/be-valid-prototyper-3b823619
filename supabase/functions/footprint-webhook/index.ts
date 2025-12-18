import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[FOOTPRINT-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const rawBody = await req.text();

    if (!rawBody) {
      logStep("Empty request body (likely webhook verification/test ping)");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      logStep("Invalid JSON body (ignoring)", { error: String(e) });
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Some providers send a verification challenge payload
    if (payload?.challenge) {
      logStep("Webhook challenge received");
      return new Response(JSON.stringify({ challenge: payload.challenge }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Payload received", { event: payload?.event, fp_id: payload?.data?.fp_id });

    // Handle different Footprint webhook events
    const eventType = payload?.event;
    const fpData = payload?.data;

    if (!fpData) {
      logStep("No data in payload");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Extract validation_id for the verifications table
    const validationId = fpData.fp_id || fpData.session_id;

    // Find driver profile by footprint session or user ID
    let driverProfile = null;
    
    if (fpData.session_id) {
      const { data } = await supabaseClient
        .from("driver_profiles")
        .select("*")
        .eq("footprint_session_id", fpData.session_id)
        .single();
      driverProfile = data;
    }

    if (!driverProfile && fpData.fp_id) {
      const { data } = await supabaseClient
        .from("driver_profiles")
        .select("*")
        .eq("footprint_user_id", fpData.fp_id)
        .single();
      driverProfile = data;
    }

    // Determine verification status based on event
    let verificationStatus = "pending";

    switch (eventType) {
      case "onboarding.completed":
      case "user.liveness_passed":
      case "user.verified":
        verificationStatus = "verified";
        logStep("Verification successful", { event: eventType });
        break;
      case "user.liveness_failed":
      case "onboarding.failed":
        verificationStatus = "failed";
        logStep("Verification failed", { event: eventType });
        break;
      case "onboarding.started":
        verificationStatus = "pending";
        logStep("Verification in progress", { event: eventType });
        break;
      default:
        logStep("Unhandled event type", { event: eventType });
    }

    // Insert/update into verifications table
    if (validationId) {
      const { error: verificationError } = await supabaseClient
        .from("verifications")
        .upsert(
          {
            validation_id: validationId,
            status: verificationStatus,
            user_id: driverProfile?.user_id || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "validation_id" }
        );

      if (verificationError) {
        logStep("Verifications table error", { error: verificationError.message });
      } else {
        logStep("Verification record saved", { validation_id: validationId, status: verificationStatus });
      }

      // Send real-time broadcast to notify the app
      const channel = supabaseClient.channel("verification-updates");
      await channel.send({
        type: "broadcast",
        event: "verification_status",
        payload: {
          validation_id: validationId,
          status: verificationStatus,
          user_id: driverProfile?.user_id || null,
          timestamp: new Date().toISOString(),
        },
      });
      logStep("Broadcast sent", { validation_id: validationId });
    }

    // Update driver profile if found
    if (driverProfile) {
      logStep("Driver profile found", { id: driverProfile.id, user_id: driverProfile.user_id });

      const verifiedAt = verificationStatus === "verified" ? new Date().toISOString() : driverProfile.verified_at;

      const { error: updateError } = await supabaseClient
        .from("driver_profiles")
        .update({
          verification_status: verificationStatus,
          verified_at: verifiedAt,
          footprint_user_id: fpData.fp_id || driverProfile.footprint_user_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", driverProfile.id);

      if (updateError) {
        logStep("Update error", { error: updateError.message });
        throw new Error(`Database update error: ${updateError.message}`);
      }

      logStep("Driver profile updated", { status: verificationStatus });
    } else {
      logStep("No matching driver profile found", { session_id: fpData.session_id, fp_id: fpData.fp_id });
    }

    return new Response(JSON.stringify({
      received: true,
      status: verificationStatus,
      validation_id: validationId,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({
      received: false,
      error: errorMessage,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
