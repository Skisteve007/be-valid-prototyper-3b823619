import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[GET-CONNECT-STATUS] ${step}${detailsStr}`);
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

    logStep("Checking connect status", { venueId });

    // Verify user is venue operator
    const { data: operatorCheck } = await supabaseClient
      .from("venue_operators")
      .select("id")
      .eq("venue_id", venueId)
      .eq("user_id", userData.user.id)
      .single();

    if (!operatorCheck) {
      throw new Error("User is not an operator for this venue");
    }

    // Get venue
    const { data: venue, error: venueError } = await supabaseClient
      .from("partner_venues")
      .select("stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled, stripe_onboarding_complete")
      .eq("id", venueId)
      .single();

    if (venueError || !venue) throw new Error("Venue not found");

    if (!venue.stripe_account_id) {
      return new Response(
        JSON.stringify({
          hasAccount: false,
          accountId: null,
          chargesEnabled: false,
          payoutsEnabled: false,
          onboardingComplete: false,
          requirements: [],
          message: "No Stripe account connected",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Fetch account status from Stripe
    const account = await stripe.accounts.retrieve(venue.stripe_account_id);

    const requirements = account.requirements?.currently_due || [];
    const pastDue = account.requirements?.past_due || [];

    logStep("Account status retrieved", {
      accountId: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requirements: requirements.length,
    });

    // Update venue with latest status
    await supabaseClient
      .from("partner_venues")
      .update({
        stripe_charges_enabled: account.charges_enabled,
        stripe_payouts_enabled: account.payouts_enabled,
        stripe_onboarding_complete: requirements.length === 0 && pastDue.length === 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", venueId);

    return new Response(
      JSON.stringify({
        hasAccount: true,
        accountId: venue.stripe_account_id,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        onboardingComplete: requirements.length === 0 && pastDue.length === 0,
        requirements: requirements,
        pastDue: pastDue,
        message: account.payouts_enabled 
          ? "Payouts enabled" 
          : requirements.length > 0 
            ? `Complete onboarding: ${requirements.length} items remaining`
            : "Processing verification",
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
