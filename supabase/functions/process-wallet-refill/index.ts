import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-WALLET-REFILL] ${step}${detailsStr}`);
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

    const { amount, payment_reference, payment_method } = await req.json();
    logStep("Processing refill", { amount, payment_reference, payment_method });

    // Get current wallet balance
    const { data: transactions } = await supabaseClient
      .from('wallet_transactions')
      .select('balance_after')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const currentBalance = transactions && transactions.length > 0 
      ? Number(transactions[0].balance_after) 
      : 0;
    
    const newBalance = currentBalance + Number(amount);
    logStep("Balance calculated", { currentBalance, amount, newBalance });

    // Insert wallet transaction
    const { data: txData, error: txError } = await supabaseClient
      .from('wallet_transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'refill',
        amount: Number(amount),
        balance_after: newBalance,
        payment_method: payment_method || 'stripe',
        payment_reference: payment_reference,
        description: `Wallet refill: +$${Number(amount).toLocaleString()}`,
        status: 'completed'
      })
      .select()
      .single();

    if (txError) {
      logStep("Transaction insert error", { error: txError.message });
      throw new Error(`Failed to record transaction: ${txError.message}`);
    }

    logStep("Transaction recorded", { transactionId: txData.id, newBalance });

    return new Response(JSON.stringify({ 
      success: true,
      new_balance: newBalance,
      transaction_id: txData.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
