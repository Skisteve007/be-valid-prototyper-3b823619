import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@2.0.0";

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

    // Send wallet funding confirmation email
    try {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey && user.email) {
        const resend = new Resend(resendApiKey);
        
        await resend.emails.send({
          from: "VALID™ <noreply@bevalid.app>",
          to: [user.email],
          subject: "Wallet Funded Successfully - VALID™",
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #e0e0ff; padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #00f0ff; font-size: 28px; margin: 0;">VALID™</h1>
                <p style="color: #888; font-size: 14px;">Ghost Wallet</p>
              </div>
              
              <h2 style="color: #00ff88; font-size: 22px;">✓ Funds Added Successfully</h2>
              
              <div style="background: #1a1f2e; border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center;">
                <p style="color: #888; font-size: 14px; margin: 0 0 8px 0;">Amount Added</p>
                <p style="color: #00ff88; font-size: 36px; font-weight: bold; margin: 0;">$${Number(amount).toFixed(2)}</p>
              </div>
              
              <div style="background: #1a1f2e; border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center;">
                <p style="color: #888; font-size: 14px; margin: 0 0 8px 0;">New Balance</p>
                <p style="color: #00f0ff; font-size: 28px; font-weight: bold; margin: 0;">$${newBalance.toFixed(2)}</p>
              </div>
              
              <p style="font-size: 16px; line-height: 1.6;">
                Your Ghost Wallet has been funded. You're ready to activate Ghost Passes and enjoy seamless access at VALID™ partner venues.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://bevalid.app/dashboard" style="background: linear-gradient(135deg, #00ff88, #00cc66); color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                  View Wallet
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #666; text-align: center;">
                © ${new Date().getFullYear()} VALID™. All rights reserved.<br>
                Funds are held in FDIC-insured FBO accounts.
              </p>
            </div>
          `,
        });
        logStep("Wallet funding email sent", { email: user.email });
      }
    } catch (emailError) {
      logStep("Email send failed (non-critical)", { error: String(emailError) });
    }

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
