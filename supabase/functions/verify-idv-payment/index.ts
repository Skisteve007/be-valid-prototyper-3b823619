import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-IDV-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { session_id } = await req.json();
    if (!session_id) throw new Error("No session ID provided");
    logStep("Verifying session", { sessionId: session_id });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const session = await stripe.checkout.sessions.retrieve(session_id);
    logStep("Session retrieved", { status: session.payment_status });

    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ 
        verified: false, 
        message: "Payment not completed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const metadata = session.metadata;
    if (!metadata || metadata.user_id !== user.id) {
      throw new Error("Session does not belong to this user");
    }

    // Update IDV verification record
    const { data: idvRecord, error: updateError } = await supabaseClient
      .from("idv_verifications")
      .update({
        payment_status: "paid",
        status: "processing",
        stripe_payment_intent: session.payment_intent as string
      })
      .eq("id", metadata.idv_id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      logStep("Error updating IDV record", { error: updateError });
      throw new Error("Failed to update IDV record");
    }
    logStep("IDV record updated to processing", { idvId: idvRecord.id });

    // Update user profile IDV status
    await supabaseClient
      .from("profiles")
      .update({
        idv_status: "pending",
        idv_tier: metadata.tier
      })
      .eq("user_id", user.id);

    // Simulate IDV verification (in production, this would call Jumio/Onfido API)
    // For now, we'll mark it as verified after a short delay
    // In real implementation, this would be handled by a webhook from the IDV provider
    
    // Generate a simulated verified hash
    const verifiedHash = crypto.randomUUID().replace(/-/g, '').toUpperCase();
    
    // Update to verified status (simulated - in production this comes from IDV provider callback)
    setTimeout(async () => {
      try {
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
          { auth: { persistSession: false } }
        );

        await supabaseAdmin
          .from("idv_verifications")
          .update({
            status: "verified",
            verified_hash: verifiedHash,
            verification_provider: "VALID_IDV",
            verification_reference: `VRF-${Date.now()}`,
            verified_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
          })
          .eq("id", metadata.idv_id);

        await supabaseAdmin
          .from("profiles")
          .update({
            idv_status: "verified",
            idv_verified_at: new Date().toISOString(),
            idv_verified_hash: verifiedHash
          })
          .eq("user_id", user.id);

        logStep("IDV verification completed (simulated)", { idvId: metadata.idv_id });
      } catch (err) {
        logStep("Error in simulated verification", { error: String(err) });
      }
    }, 5000); // 5 second delay to simulate processing

    return new Response(JSON.stringify({ 
      verified: true,
      status: "processing",
      message: "Payment verified. Identity verification in progress.",
      idv_id: idvRecord.id,
      tier: metadata.tier
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
