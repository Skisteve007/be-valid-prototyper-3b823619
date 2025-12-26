import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChargeRequest {
  venueId: string;
  staffUserId: string;
  memberId: string;
  chargeType: string;
  amountCents: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body: ChargeRequest = await req.json();
    const { venueId, staffUserId, memberId, chargeType, amountCents } = body;

    console.log("[create-pos-charge] Request:", { venueId, staffUserId, memberId, chargeType, amountCents });

    // Validate inputs
    if (!venueId || !staffUserId || !memberId || !chargeType || amountCents === undefined) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required fields" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (amountCents <= 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "Amount must be greater than 0" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 1) Look up profile by member_id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, user_id, member_id, full_name")
      .eq("member_id", memberId)
      .maybeSingle();

    if (profileError) {
      console.error("[create-pos-charge] Profile lookup error:", profileError);
      return new Response(
        JSON.stringify({ ok: false, error: "Database error looking up member" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (!profile) {
      console.log("[create-pos-charge] Member not found:", memberId);
      return new Response(
        JSON.stringify({ ok: false, error: "Member not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // 2) Verify staff authorization
    const { data: venueOp } = await supabase
      .from("venue_operators")
      .select("id")
      .eq("user_id", staffUserId)
      .eq("venue_id", venueId)
      .maybeSingle();

    const { data: staffShift } = await supabase
      .from("staff_shifts")
      .select("id")
      .eq("staff_user_id", staffUserId)
      .eq("venue_id", venueId)
      .eq("is_active", true)
      .maybeSingle();

    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", staffUserId)
      .eq("role", "administrator")
      .maybeSingle();

    if (!venueOp && !staffShift && !adminRole) {
      console.log("[create-pos-charge] Access denied for staff:", staffUserId);
      return new Response(
        JSON.stringify({ ok: false, error: "Access denied — not authorized for this venue" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // 3) Get or create wallet for customer
    let { data: wallet, error: walletError } = await supabase
      .from("user_wallets")
      .select("*")
      .eq("user_id", profile.user_id)
      .maybeSingle();

    if (walletError && walletError.code !== "PGRST116") {
      console.error("[create-pos-charge] Wallet lookup error:", walletError);
      return new Response(
        JSON.stringify({ ok: false, error: "Database error looking up wallet" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Create wallet if doesn't exist
    if (!wallet) {
      const { data: newWallet, error: createError } = await supabase
        .from("user_wallets")
        .insert({ user_id: profile.user_id, balance: 0 })
        .select()
        .single();

      if (createError) {
        console.error("[create-pos-charge] Create wallet error:", createError);
        return new Response(
          JSON.stringify({ ok: false, error: "Failed to create wallet" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      wallet = newWallet;
    }

    // 4) Check wallet balance (balance is in dollars, amountCents is in cents)
    const amountDollars = amountCents / 100;
    const currentBalance = Number(wallet.balance) || 0;

    if (currentBalance < amountDollars) {
      console.log("[create-pos-charge] Insufficient funds:", { currentBalance, amountDollars });
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: `Insufficient wallet balance. Have $${currentBalance.toFixed(2)}, need $${amountDollars.toFixed(2)}` 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 5) Load or create venue_billing_config
    let { data: billingConfig, error: configError } = await supabase
      .from("venue_billing_config")
      .select("*")
      .eq("venue_id", venueId)
      .maybeSingle();

    if (configError && configError.code !== "PGRST116") {
      console.error("[create-pos-charge] Billing config error:", configError);
      return new Response(
        JSON.stringify({ ok: false, error: "Database error loading billing config" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Create default config if not exists
    if (!billingConfig) {
      const { data: newConfig, error: insertError } = await supabase
        .from("venue_billing_config")
        .insert({
          venue_id: venueId,
          per_scan_fee_cents: 50,
          free_scan_credits_remaining: 0,
          venue_share_bps: 10000,
        })
        .select()
        .single();

      if (insertError) {
        console.error("[create-pos-charge] Create config error:", insertError);
        return new Response(
          JSON.stringify({ ok: false, error: "Failed to create billing config" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      billingConfig = newConfig;
    }

    // 6) Compute platform fee
    let platformFeeCents = billingConfig.per_scan_fee_cents || 50;
    let usedFreeCredit = false;
    let freeCreditsRemaining = billingConfig.free_scan_credits_remaining || 0;

    if (freeCreditsRemaining > 0) {
      platformFeeCents = 0;
      usedFreeCredit = true;
      freeCreditsRemaining -= 1;

      // Update the credits count
      const { error: updateError } = await supabase
        .from("venue_billing_config")
        .update({ free_scan_credits_remaining: freeCreditsRemaining })
        .eq("venue_id", venueId);

      if (updateError) {
        console.error("[create-pos-charge] Update credits error:", updateError);
      }
    }

    // 7) Calculate venue net (never negative)
    if (amountCents < platformFeeCents) {
      return new Response(
        JSON.stringify({ ok: false, error: `Charge amount ($${(amountCents / 100).toFixed(2)}) is less than platform fee ($${(platformFeeCents / 100).toFixed(2)})` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const venueNetCents = amountCents - platformFeeCents;

    // 8) DEBIT WALLET (atomic operation)
    const newBalanceDollars = currentBalance - amountDollars;
    
    const { error: debitError } = await supabase
      .from("user_wallets")
      .update({ 
        balance: newBalanceDollars,
        updated_at: new Date().toISOString()
      })
      .eq("id", wallet.id)
      .eq("balance", currentBalance); // Optimistic lock

    if (debitError) {
      console.error("[create-pos-charge] Debit error:", debitError);
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to debit wallet — please retry" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // 9) Record wallet transaction
    const { error: txError } = await supabase
      .from("wallet_transactions")
      .insert({
        user_id: profile.user_id,
        transaction_type: "pos_charge",
        amount: -amountDollars, // Negative for debit
        balance_after: newBalanceDollars,
        description: `${chargeType} charge at venue`,
        status: "completed",
      });

    if (txError) {
      console.error("[create-pos-charge] Wallet tx log error:", txError);
      // Non-fatal, continue
    }

    // 10) Insert pos_charges row
    const { data: charge, error: chargeError } = await supabase
      .from("pos_charges")
      .insert({
        venue_id: venueId,
        staff_user_id: staffUserId,
        member_id: memberId,
        profile_id: profile.id,
        charge_type: chargeType,
        amount_cents: amountCents,
        platform_fee_cents: platformFeeCents,
        venue_net_cents: venueNetCents,
        used_free_credit: usedFreeCredit,
      })
      .select()
      .single();

    if (chargeError) {
      console.error("[create-pos-charge] Insert charge error:", chargeError);
      // Attempt to refund the wallet debit
      await supabase
        .from("user_wallets")
        .update({ balance: currentBalance })
        .eq("id", wallet.id);
      
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to record charge — wallet refunded" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log("[create-pos-charge] Charge created:", charge.id, "New balance:", newBalanceDollars);

    // 11) Return success
    return new Response(
      JSON.stringify({
        ok: true,
        charge: {
          id: charge.id,
          chargeType: charge.charge_type,
          amountCents: charge.amount_cents,
          createdAt: charge.created_at,
          memberName: profile.full_name || memberId,
        },
        split: {
          platform_fee_cents: platformFeeCents,
          venue_net_cents: venueNetCents,
          used_free_credit: usedFreeCredit,
          free_scan_credits_remaining: freeCreditsRemaining,
        },
        wallet: {
          previous_balance_cents: Math.round(currentBalance * 100),
          new_balance_cents: Math.round(newBalanceDollars * 100),
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: unknown) {
    console.error("[create-pos-charge] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ ok: false, error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
