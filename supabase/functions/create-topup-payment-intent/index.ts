import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-TOPUP-INTENT] ${step}${detailsStr}`);
};

// Convenience fee tiers (same as existing wallet funding)
const FEE_TIERS = [
  { min: 0, max: 50, feePercent: 3 },
  { min: 50, max: 100, feePercent: 2.5 },
  { min: 100, max: 250, feePercent: 2 },
  { min: 250, max: 500, feePercent: 1.5 },
  { min: 500, max: Infinity, feePercent: 1 },
];

const getConvenienceFeeCents = (amountCents: number): number => {
  const amountDollars = amountCents / 100;
  const tier = FEE_TIERS.find(t => amountDollars >= t.min && amountDollars < t.max);
  const feePercent = tier?.feePercent || 3;
  return Math.round(amountCents * (feePercent / 100));
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("User not authenticated");
    }
    logStep("User authenticated", { userId: user.id });

    const { amountCents, currency = "usd" } = await req.json();

    // Validate amount
    if (!amountCents || amountCents < 500) {
      throw new Error("Minimum top-up amount is $5.00");
    }
    if (amountCents > 500000) {
      throw new Error("Maximum top-up amount is $5,000.00");
    }

    const amountDollars = amountCents / 100;
    logStep("Amount validated", { amountCents, amountDollars });

    // Get or create wallet to check limits
    const { data: wallet, error: walletError } = await supabaseAdmin
      .rpc('get_or_create_wallet', { p_user_id: user.id });
    
    if (walletError) {
      throw new Error(`Failed to get wallet: ${walletError.message}`);
    }
    logStep("Wallet retrieved", { walletId: wallet.id, currentBalance: wallet.balance });

    // Check daily limit ($5,000)
    const dailyLimit = 5000;
    if (wallet.daily_funded_amount + amountDollars > dailyLimit) {
      const remaining = dailyLimit - wallet.daily_funded_amount;
      throw new Error(`Daily funding limit exceeded. Remaining: $${remaining.toFixed(2)}`);
    }

    // Check monthly limit ($10,000)
    const monthlyLimit = 10000;
    if (wallet.monthly_funded_amount + amountDollars > monthlyLimit) {
      const remaining = monthlyLimit - wallet.monthly_funded_amount;
      throw new Error(`Monthly funding limit exceeded. Remaining: $${remaining.toFixed(2)}`);
    }
    logStep("Limits validated", { 
      dailyUsed: wallet.daily_funded_amount, 
      monthlyUsed: wallet.monthly_funded_amount 
    });

    // Calculate convenience fee
    const convenienceFeeCents = getConvenienceFeeCents(amountCents);
    const totalChargeCents = amountCents + convenienceFeeCents;
    logStep("Fees calculated", { 
      amountCents, 
      convenienceFeeCents, 
      totalChargeCents 
    });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    let customerId: string | undefined;
    if (user.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing Stripe customer found", { customerId });
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { supabase_user_id: user.id },
        });
        customerId = customer.id;
        logStep("New Stripe customer created", { customerId });
      }
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalChargeCents,
      currency: currency.toLowerCase(),
      customer: customerId,
      metadata: {
        type: "topup",
        user_id: user.id,
        wallet_id: wallet.id,
        amount_cents: amountCents.toString(),
        convenience_fee_cents: convenienceFeeCents.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    logStep("PaymentIntent created", { 
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret ? "present" : "missing"
    });

    // Create pending transaction record
    const { error: txError } = await supabaseAdmin
      .from("wallet_funding_transactions")
      .insert({
        user_id: user.id,
        amount: amountDollars,
        convenience_fee: convenienceFeeCents / 100,
        total_charged: totalChargeCents / 100,
        payment_method: "card",
        stripe_payment_intent: paymentIntent.id,
        status: "pending",
      });

    if (txError) {
      logStep("Warning: Failed to create pending transaction", { error: txError.message });
    } else {
      logStep("Pending transaction created");
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amountCents,
        convenienceFeeCents,
        totalChargeCents,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logStep("ERROR", { error: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
