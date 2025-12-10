import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// IDV Tier pricing configuration
const IDV_TIERS = {
  standard: {
    price_id: "price_1ScrVoQVr0M2u4Msm8e2NFaN",
    product_id: "prod_Ta1YI7GDh37bzC",
    name: "Standard VIBE-ID",
    price: 48.00
  },
  vip: {
    price_id: "price_1ScrWoQVr0M2u4MscAczp6JF",
    product_id: "prod_Ta1ZFdDRwnhWry",
    name: "VIP Global Access",
    price: 112.00
  }
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-IDV-CHECKOUT] ${step}${detailsStr}`);
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
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body for tier
    const { tier } = await req.json();
    if (!tier || !IDV_TIERS[tier as keyof typeof IDV_TIERS]) {
      throw new Error("Invalid IDV tier. Must be 'standard' or 'vip'");
    }
    const selectedTier = IDV_TIERS[tier as keyof typeof IDV_TIERS];
    logStep("Selected tier", { tier, price: selectedTier.price });

    // Check if user already has an active IDV verification
    const { data: existingIdv } = await supabaseClient
      .from("idv_verifications")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["pending", "processing", "verified"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingIdv && existingIdv.status === "verified") {
      // Check if they're trying to upgrade from standard to VIP
      if (existingIdv.tier === "vip" || tier === "standard") {
        throw new Error("You already have an active IDV verification at this tier or higher");
      }
      logStep("User upgrading from standard to VIP");
    } else if (existingIdv && existingIdv.status === "pending") {
      throw new Error("You have a pending IDV verification. Please complete or cancel it first.");
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }
    logStep("Stripe customer check", { customerId: customerId || "new" });

    // Create IDV verification record
    const { data: idvRecord, error: idvError } = await supabaseClient
      .from("idv_verifications")
      .insert({
        user_id: user.id,
        tier: tier,
        status: "pending",
        payment_status: "unpaid"
      })
      .select()
      .single();

    if (idvError) {
      logStep("Error creating IDV record", { error: idvError });
      throw new Error("Failed to create IDV verification record");
    }
    logStep("IDV record created", { idvId: idvRecord.id });

    // Create Stripe checkout session
    const origin = req.headers.get("origin") || "https://bevalid.app";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: selectedTier.price_id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/idv-verification?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${origin}/idv-verification?status=canceled`,
      metadata: {
        user_id: user.id,
        idv_id: idvRecord.id,
        tier: tier
      }
    });
    logStep("Checkout session created", { sessionId: session.id });

    // Update IDV record with session ID
    await supabaseClient
      .from("idv_verifications")
      .update({ stripe_session_id: session.id })
      .eq("id", idvRecord.id);

    return new Response(JSON.stringify({ 
      url: session.url,
      idv_id: idvRecord.id 
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
