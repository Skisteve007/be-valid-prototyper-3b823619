import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-AGREEMENT-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const { tierId, tierName, priceId, organizationName, sector, signerName, signerEmail } = await req.json();
    logStep("Request body received", { tierId, tierName, priceId, organizationName });

    if (!priceId || !tierName) {
      throw new Error("Missing required fields: priceId and tierName");
    }

    // Try to get authenticated user
    let userEmail = signerEmail;
    let userId = null;
    
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user) {
        userEmail = data.user.email || userEmail;
        userId = data.user.id;
        logStep("User authenticated", { userId, email: userEmail });
      }
    }

    if (!userEmail) {
      throw new Error("Email is required for agreement checkout");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });
    logStep("Stripe initialized");

    // Check if customer exists
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    }

    const origin = req.headers.get("origin") || "https://bevalid.app";

    // Create checkout session with metadata for agreement tracking
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/agreement-success?tier=${tierId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/operation-sf?canceled=true`,
      metadata: {
        tier_id: tierId,
        tier_name: tierName,
        organization_name: organizationName || "Not specified",
        sector: sector || "Not specified",
        signer_name: signerName || "Not specified",
        signer_email: userEmail,
        user_id: userId || "guest",
        agreement_type: "valid_deployment",
        payment_number: "1",
      },
      payment_intent_data: {
        metadata: {
          tier_id: tierId,
          tier_name: tierName,
          organization_name: organizationName || "Not specified",
          payment_number: "1",
        },
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
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
