import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-VENUE-CONNECT] ${step}${detailsStr}`);
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

    logStep("Checking venue operator access", { venueId, userId: userData.user.id });

    // Verify user is venue operator
    const { data: operatorCheck, error: operatorError } = await supabaseClient
      .from("venue_operators")
      .select("id")
      .eq("venue_id", venueId)
      .eq("user_id", userData.user.id)
      .single();

    if (operatorError || !operatorCheck) {
      throw new Error("User is not an operator for this venue");
    }

    // Get venue details
    const { data: venue, error: venueError } = await supabaseClient
      .from("partner_venues")
      .select("*")
      .eq("id", venueId)
      .single();

    if (venueError || !venue) throw new Error("Venue not found");

    // Check if already has a Stripe account
    if (venue.stripe_account_id) {
      logStep("Venue already has Stripe account", { accountId: venue.stripe_account_id });
      return new Response(
        JSON.stringify({ 
          success: true, 
          accountId: venue.stripe_account_id,
          message: "Stripe account already exists" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create Express connected account
    const account = await stripe.accounts.create({
      type: "express",
      country: venue.country === "USA" ? "US" : venue.country || "US",
      email: venue.gm_email || undefined,
      business_type: "company",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name: venue.venue_name,
        mcc: "7929", // Entertainment/recreation
      },
      metadata: {
        venue_id: venueId,
        venue_name: venue.venue_name,
      },
    });

    logStep("Stripe account created", { accountId: account.id });

    // Save account ID to venue
    const { error: updateError } = await supabaseClient
      .from("partner_venues")
      .update({
        stripe_account_id: account.id,
        stripe_charges_enabled: account.charges_enabled,
        stripe_payouts_enabled: account.payouts_enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", venueId);

    if (updateError) {
      logStep("Failed to update venue", { error: updateError.message });
      throw new Error("Failed to save Stripe account to venue");
    }

    logStep("Venue updated with Stripe account", { venueId, accountId: account.id });

    return new Response(
      JSON.stringify({
        success: true,
        accountId: account.id,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
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
