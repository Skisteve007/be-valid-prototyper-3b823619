import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Convenience fee tiers
const FEE_TIERS = [
  { min: 10, max: 25, fee: 1.99 },
  { min: 26, max: 50, fee: 2.99 },
  { min: 51, max: 100, fee: 4.99 },
  { min: 101, max: 250, fee: 9.99 },
  { min: 251, max: 500, fee: 19.99 },
  { min: 501, max: 1000, fee: 39.99 },
  { min: 1001, max: 2500, fee: 74.99 },
  { min: 2501, max: 5000, fee: 149.99 },
];

const getConvenienceFee = (amount: number): number => {
  const tier = FEE_TIERS.find(t => amount >= t.min && amount <= t.max);
  return tier ? tier.fee : 0;
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-WALLET-CHECKOUT] ${step}${detailsStr}`);
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

    const { amount, paymentMethod } = await req.json();
    logStep("Request data", { amount, paymentMethod });

    // Validate amount
    if (!amount || amount < 10 || amount > 5000) {
      throw new Error("Amount must be between $10 and $5,000");
    }

    // Get or create wallet to check limits
    const { data: wallet, error: walletError } = await supabaseClient
      .rpc('get_or_create_wallet', { p_user_id: user.id });
    
    if (walletError) {
      logStep("Wallet error", { error: walletError });
      throw new Error("Failed to get wallet information");
    }
    logStep("Wallet retrieved", { balance: wallet?.balance });

    // Check daily limit
    const dailyFunded = wallet?.daily_funded_amount || 0;
    if (dailyFunded + amount > 5000) {
      throw new Error(`Daily limit exceeded. You can add up to $${(5000 - dailyFunded).toFixed(2)} today.`);
    }

    // Check monthly limit
    const monthlyFunded = wallet?.monthly_funded_amount || 0;
    if (monthlyFunded + amount > 10000) {
      throw new Error(`Monthly limit exceeded. You can add up to $${(10000 - monthlyFunded).toFixed(2)} this month.`);
    }

    // Calculate convenience fee
    const convenienceFee = getConvenienceFee(amount);
    const totalCharge = amount + convenienceFee;
    logStep("Fee calculated", { amount, convenienceFee, totalCharge });

    // Create pending transaction record
    const { data: transaction, error: txError } = await supabaseClient
      .from('wallet_funding_transactions')
      .insert({
        user_id: user.id,
        amount: amount,
        convenience_fee: convenienceFee,
        total_charged: totalCharge,
        payment_method: paymentMethod || 'card',
        status: 'pending'
      })
      .select()
      .single();

    if (txError) {
      logStep("Transaction insert error", { error: txError });
      throw new Error("Failed to create transaction record");
    }
    logStep("Transaction created", { transactionId: transaction.id });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }
    logStep("Customer lookup", { customerId: customerId || "new customer" });

    // Create checkout session
    const origin = req.headers.get("origin") || "https://validnetwork.app";
    
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `GHOST™ Wallet - $${amount.toFixed(2)} Credit`,
              description: `Add $${amount.toFixed(2)} to your GHOST™ Wallet`,
            },
            unit_amount: Math.round(amount * 100), // Amount in cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Convenience Fee',
              description: 'Processing fee for instant wallet funding',
            },
            unit_amount: Math.round(convenienceFee * 100), // Fee in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/wallet-funding-success?session_id={CHECKOUT_SESSION_ID}&transaction_id=${transaction.id}`,
      cancel_url: `${origin}/dashboard?tab=wallet&funding=cancelled`,
      metadata: {
        transaction_id: transaction.id,
        user_id: user.id,
        amount: amount.toString(),
        convenience_fee: convenienceFee.toString(),
        type: 'wallet_funding'
      },
      payment_method_types: ['card'],
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);
    logStep("Checkout session created", { sessionId: session.id });

    // Update transaction with session ID
    await supabaseClient
      .from('wallet_funding_transactions')
      .update({ stripe_session_id: session.id })
      .eq('id', transaction.id);

    return new Response(JSON.stringify({ 
      url: session.url,
      transactionId: transaction.id,
      amount,
      convenienceFee,
      totalCharge
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
