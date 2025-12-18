import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Ghost Pass pricing
const GHOST_PASS_PRICES = {
  bronze: 10.00,
  silver: 20.00,
  gold: 50.00,
};

// Ghost Pass split: 30/30/10/30 (Venue/Promoter/Pool/VALID)
const GHOST_PASS_SPLIT = {
  venue: 0.30,
  promoter: 0.30,
  pool: 0.10,
  valid: 0.30,
};

// Transaction fee rate
const TRANSACTION_FEE_RATE = 0.015; // 1.5%

// Get gas fee tier based on monthly scan count
function getGasFeeTier(scanCount: number): number {
  if (scanCount >= 100000) return 0.075;  // $0.05-$0.10 midpoint
  if (scanCount >= 10000) return 0.125;   // $0.10-$0.15 midpoint
  if (scanCount >= 1000) return 0.20;     // $0.15-$0.25 midpoint
  return 0.375;                            // $0.25-$0.50 midpoint
}

interface PaymentRequest {
  venueId: string;
  userId: string;
  staffUserId?: string;
  paymentModel: 'ghost_pass' | 'direct_payment';
  // Ghost Pass specific
  ghostPassTier?: 'bronze' | 'silver' | 'gold';
  promoterCode?: string;
  // Direct Payment specific
  directPaymentType?: string;
  amount?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const payload: PaymentRequest = await req.json();
    console.log("Payment request received:", payload);

    const { venueId, userId, staffUserId, paymentModel, ghostPassTier, promoterCode, directPaymentType, amount } = payload;

    if (!venueId || !userId || !paymentModel) {
      throw new Error("Missing required fields: venueId, userId, paymentModel");
    }

    // Get venue info
    const { data: venue, error: venueError } = await supabaseAdmin
      .from("partner_venues")
      .select("*")
      .eq("id", venueId)
      .single();

    if (venueError || !venue) {
      throw new Error("Venue not found");
    }

    // Get current month scan count for gas fee tier
    const monthYear = new Date().toISOString().slice(0, 7);
    const { data: scanData } = await supabaseAdmin
      .from("venue_scan_counts")
      .select("scan_count, gas_fees_collected")
      .eq("venue_id", venueId)
      .eq("month_year", monthYear)
      .single();

    const currentScanCount = scanData?.scan_count || 0;

    // Check for manual gas fee config
    const { data: gasConfig } = await supabaseAdmin
      .from("venue_gas_fee_config")
      .select("*")
      .eq("venue_id", venueId)
      .single();

    let gasFeePerScan: number;
    if (gasConfig && !gasConfig.use_auto_tier && gasConfig.manual_gas_fee) {
      gasFeePerScan = parseFloat(gasConfig.manual_gas_fee);
    } else {
      gasFeePerScan = getGasFeeTier(currentScanCount);
    }

    console.log(`Gas fee for venue ${venueId}: $${gasFeePerScan} (scan count: ${currentScanCount})`);

    let transaction: {
      venue_id: string;
      user_id: string;
      staff_user_id: string | null;
      payment_model: string;
      ghost_pass_tier: string | null;
      direct_payment_type: string | null;
      gross_amount: number;
      gas_fee_applied: number;
      transaction_fee_applied: number;
      venue_share: number;
      promoter_share: number;
      community_pool_share: number;
      valid_share: number;
      venue_net: number;
      valid_net: number;
      promoter_id: string | null;
      promoter_code: string | null;
      status: string;
      processed_at: string;
    };

    if (paymentModel === 'ghost_pass') {
      // MODEL A: GHOST PASS
      if (!ghostPassTier || !GHOST_PASS_PRICES[ghostPassTier]) {
        throw new Error("Invalid ghost pass tier");
      }

      const grossAmount = GHOST_PASS_PRICES[ghostPassTier];
      
      // Calculate splits
      let venueShare = grossAmount * GHOST_PASS_SPLIT.venue;
      let promoterShare = grossAmount * GHOST_PASS_SPLIT.promoter;
      const poolShare = grossAmount * GHOST_PASS_SPLIT.pool;
      const validShare = grossAmount * GHOST_PASS_SPLIT.valid;

      // Look up promoter if code provided
      let promoterId: string | null = null;
      if (promoterCode) {
        const { data: promoter } = await supabaseAdmin
          .from("affiliates")
          .select("id")
          .eq("referral_code", promoterCode)
          .single();
        
        if (promoter) {
          promoterId = promoter.id;
        } else {
          // If promoter not found, promoter share goes to VALID
          promoterShare = 0;
        }
      } else {
        // No promoter, their share goes to VALID
        promoterShare = 0;
      }

      // Fees deducted from venue share
      const transactionFee = venueShare * TRANSACTION_FEE_RATE;
      const gasFee = gasFeePerScan;

      const venueNet = venueShare - transactionFee - gasFee;
      const validNet = validShare + (promoterCode ? 0 : grossAmount * GHOST_PASS_SPLIT.promoter) + transactionFee + gasFee;

      transaction = {
        venue_id: venueId,
        user_id: userId,
        staff_user_id: staffUserId || null,
        payment_model: 'ghost_pass',
        ghost_pass_tier: ghostPassTier,
        direct_payment_type: null,
        gross_amount: grossAmount,
        gas_fee_applied: gasFee,
        transaction_fee_applied: transactionFee,
        venue_share: venueShare,
        promoter_share: promoterId ? promoterShare : 0,
        community_pool_share: poolShare,
        valid_share: validShare,
        venue_net: venueNet,
        valid_net: validNet,
        promoter_id: promoterId,
        promoter_code: promoterCode || null,
        status: 'completed',
        processed_at: new Date().toISOString(),
      };

      // Update promoter earnings if applicable
      if (promoterId && promoterShare > 0) {
        await supabaseAdmin.rpc('update_affiliate_pending_earnings', {
          _affiliate_id: promoterId,
          _amount: promoterShare,
        });
      }

    } else {
      // MODEL B: DIRECT PAYMENT
      if (!amount || amount <= 0) {
        throw new Error("Invalid amount for direct payment");
      }

      const grossAmount = amount;
      const transactionFee = grossAmount * TRANSACTION_FEE_RATE;
      const gasFee = gasFeePerScan;
      
      const venueNet = grossAmount - transactionFee - gasFee;
      const validNet = transactionFee + gasFee;

      transaction = {
        venue_id: venueId,
        user_id: userId,
        staff_user_id: staffUserId || null,
        payment_model: 'direct_payment',
        ghost_pass_tier: null,
        direct_payment_type: directPaymentType || 'other',
        gross_amount: grossAmount,
        gas_fee_applied: gasFee,
        transaction_fee_applied: transactionFee,
        venue_share: grossAmount,
        promoter_share: 0,
        community_pool_share: 0,
        valid_share: 0,
        venue_net: venueNet,
        valid_net: validNet,
        promoter_id: null,
        promoter_code: null,
        status: 'completed',
        processed_at: new Date().toISOString(),
      };
    }

    // Insert transaction
    const { data: newTransaction, error: insertError } = await supabaseAdmin
      .from("valid_transactions")
      .insert(transaction)
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to create transaction");
    }

    // Update venue scan count
    const { error: scanError } = await supabaseAdmin
      .from("venue_scan_counts")
      .upsert({
        venue_id: venueId,
        month_year: monthYear,
        scan_count: currentScanCount + 1,
        gas_fees_collected: (scanData?.gas_fees_collected || 0) + gasFeePerScan,
      }, {
        onConflict: 'venue_id,month_year',
      });

    if (scanError) {
      console.error("Scan count update error:", scanError);
    }

    // Update venue earnings
    await supabaseAdmin.rpc('update_venue_earnings', {
      _venue_id: venueId,
      _amount: transaction.venue_net,
    });

    console.log("Transaction created successfully:", newTransaction.id);

    return new Response(
      JSON.stringify({
        success: true,
        transaction: newTransaction,
        breakdown: {
          grossAmount: transaction.gross_amount,
          gasFee: transaction.gas_fee_applied,
          transactionFee: transaction.transaction_fee_applied,
          venueNet: transaction.venue_net,
          validNet: transaction.valid_net,
          ...(paymentModel === 'ghost_pass' && {
            venueShare: transaction.venue_share,
            promoterShare: transaction.promoter_share,
            poolShare: transaction.community_pool_share,
            validShare: transaction.valid_share,
          }),
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Payment processing error:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
