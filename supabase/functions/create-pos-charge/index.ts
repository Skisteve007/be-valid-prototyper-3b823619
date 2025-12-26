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

    // 1) Look up profile by member_id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, member_id, full_name")
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

    // 2) Load or create venue_billing_config
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

    // 3) Compute platform fee
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

    // 4) Calculate venue net (never negative)
    if (amountCents < platformFeeCents) {
      return new Response(
        JSON.stringify({ ok: false, error: `Charge amount ($${(amountCents / 100).toFixed(2)}) is less than platform fee ($${(platformFeeCents / 100).toFixed(2)})` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const venueNetCents = amountCents - platformFeeCents;

    // 5) Insert pos_charges row
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
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to record charge" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log("[create-pos-charge] Charge created:", charge.id);

    // 6) Return success
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
