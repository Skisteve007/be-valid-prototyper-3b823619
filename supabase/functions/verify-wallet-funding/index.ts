import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-WALLET-FUNDING] ${step}${detailsStr}`);
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

    const { sessionId, transactionId } = await req.json();
    logStep("Request data", { sessionId, transactionId });

    if (!sessionId || !transactionId) {
      throw new Error("Missing sessionId or transactionId");
    }

    // Get transaction record
    const { data: transaction, error: txError } = await supabaseClient
      .from('wallet_funding_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (txError || !transaction) {
      throw new Error("Transaction not found");
    }

    // Already completed
    if (transaction.status === 'completed') {
      return new Response(JSON.stringify({ 
        success: true, 
        alreadyProcessed: true,
        amount: transaction.amount 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Verify with Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Stripe session retrieved", { status: session.payment_status });

    if (session.payment_status !== 'paid') {
      throw new Error("Payment not completed");
    }

    // Credit the wallet
    const { data: credited, error: creditError } = await supabaseClient
      .rpc('credit_wallet', {
        p_user_id: transaction.user_id,
        p_amount: transaction.amount,
        p_fee: transaction.convenience_fee,
        p_transaction_id: transaction.id
      });

    if (creditError) {
      logStep("Credit error", { error: creditError });
      throw new Error("Failed to credit wallet");
    }

    // Update transaction with payment intent
    await supabaseClient
      .from('wallet_funding_transactions')
      .update({ 
        stripe_payment_intent: session.payment_intent as string,
        status: 'completed',
        credited_at: new Date().toISOString()
      })
      .eq('id', transactionId);

    logStep("Wallet credited successfully", { 
      userId: transaction.user_id, 
      amount: transaction.amount 
    });

    return new Response(JSON.stringify({ 
      success: true,
      amount: transaction.amount,
      convenienceFee: transaction.convenience_fee,
      totalCharged: transaction.total_charged
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
