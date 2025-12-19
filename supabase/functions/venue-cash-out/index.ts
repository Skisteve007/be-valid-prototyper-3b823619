import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[VENUE-CASH-OUT] ${step}${detailsStr}`);
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

    // Verify user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Unauthorized");

    const { venueId } = await req.json();
    if (!venueId) throw new Error("venueId is required");

    logStep("Processing cash out", { venueId, userId: userData.user.id });

    // Verify user is venue operator
    const { data: operatorCheck } = await supabaseClient
      .from("venue_operators")
      .select("id, access_level")
      .eq("venue_id", venueId)
      .eq("user_id", userData.user.id)
      .single();

    if (!operatorCheck) {
      throw new Error("User is not an operator for this venue");
    }

    // Get venue with Stripe account
    const { data: venue, error: venueError } = await supabaseClient
      .from("partner_venues")
      .select("stripe_account_id, stripe_payouts_enabled, venue_name, pending_earnings")
      .eq("id", venueId)
      .single();

    if (venueError || !venue) throw new Error("Venue not found");
    if (!venue.stripe_account_id) throw new Error("Venue has no Stripe account");
    if (!venue.stripe_payouts_enabled) throw new Error("Payouts not enabled for this venue");

    // Calculate available balance from ledger
    const { data: ledgerEntries, error: ledgerError } = await supabaseClient
      .from("venue_ledger_entries")
      .select("entry_type, amount")
      .eq("venue_id", venueId)
      .is("paid_at", null);

    if (ledgerError) throw new Error("Failed to fetch ledger entries");

    let availableBalance = 0;
    for (const entry of ledgerEntries || []) {
      if (entry.entry_type === "sale") {
        availableBalance += Number(entry.amount);
      } else if (entry.entry_type === "fee" || entry.entry_type === "refund") {
        availableBalance -= Number(entry.amount);
      }
    }

    // Also check pending_earnings on venue as backup
    const pendingEarnings = Number(venue.pending_earnings || 0);
    const balanceToTransfer = Math.max(availableBalance, pendingEarnings);

    if (balanceToTransfer <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No available balance to cash out",
          availableBalance: 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Calculated balance", { availableBalance, pendingEarnings, balanceToTransfer });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Generate idempotency key based on venue + date + balance
    const today = new Date().toISOString().split("T")[0];
    const idempotencyKey = `cashout_${venueId}_${today}_${Math.round(balanceToTransfer * 100)}`;

    // Check if this idempotency key was already used
    const { data: existingCashout } = await supabaseClient
      .from("venue_ledger_entries")
      .select("id")
      .eq("idempotency_key", idempotencyKey)
      .single();

    if (existingCashout) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Cash out already processed for this amount today",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create transfer to connected account
    const amountInCents = Math.round(balanceToTransfer * 100);

    const transfer = await stripe.transfers.create(
      {
        amount: amountInCents,
        currency: "usd",
        destination: venue.stripe_account_id,
        description: `Payout for ${venue.venue_name}`,
        metadata: {
          venue_id: venueId,
          venue_name: venue.venue_name,
          cash_out_date: today,
        },
      },
      {
        idempotencyKey,
      }
    );

    logStep("Transfer created", { transferId: transfer.id, amount: amountInCents });

    // Record payout in ledger
    const { error: insertError } = await supabaseClient
      .from("venue_ledger_entries")
      .insert({
        venue_id: venueId,
        entry_type: "payout",
        amount: -balanceToTransfer, // Negative because it's outgoing
        description: `Cash out via Stripe Transfer ${transfer.id}`,
        stripe_transfer_id: transfer.id,
        paid_at: new Date().toISOString(),
        idempotency_key: idempotencyKey,
      });

    if (insertError) {
      logStep("Failed to record payout in ledger", { error: insertError.message });
    }

    // Mark previous ledger entries as paid
    const { error: updateError } = await supabaseClient
      .from("venue_ledger_entries")
      .update({ paid_at: new Date().toISOString() })
      .eq("venue_id", venueId)
      .is("paid_at", null)
      .neq("entry_type", "payout");

    if (updateError) {
      logStep("Failed to update ledger entries", { error: updateError.message });
    }

    // Update venue pending_earnings
    await supabaseClient
      .from("partner_venues")
      .update({
        pending_earnings: 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", venueId);

    // Also record in venue_payout_ledger for historical tracking
    await supabaseClient
      .from("venue_payout_ledger")
      .insert({
        venue_id: venueId,
        amount: balanceToTransfer,
        status: "completed",
        payout_reference: transfer.id,
        paid_at: new Date().toISOString(),
      });

    return new Response(
      JSON.stringify({
        success: true,
        transferId: transfer.id,
        amount: balanceToTransfer,
        amountFormatted: `$${balanceToTransfer.toFixed(2)}`,
        message: `Successfully transferred $${balanceToTransfer.toFixed(2)} to venue account`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
