import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-ONBOARDING-LINK] ${step}${detailsStr}`);
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

    const { venueId, returnUrl, refreshUrl } = await req.json();
    if (!venueId) throw new Error("venueId is required");

    logStep("Creating onboarding link", { venueId });

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

    // Get venue with Stripe account
    const { data: venue, error: venueError } = await supabaseClient
      .from("partner_venues")
      .select("stripe_account_id, venue_name")
      .eq("id", venueId)
      .single();

    if (venueError || !venue) throw new Error("Venue not found");
    if (!venue.stripe_account_id) throw new Error("Venue has no Stripe account. Create one first.");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create account link for onboarding
    const origin = req.headers.get("origin") || "https://valid.app";
    const accountLink = await stripe.accountLinks.create({
      account: venue.stripe_account_id,
      refresh_url: refreshUrl || `${origin}/venue-portal`,
      return_url: returnUrl || `${origin}/venue-portal?onboarding=complete`,
      type: "account_onboarding",
    });

    logStep("Onboarding link created", { url: accountLink.url });

    return new Response(
      JSON.stringify({
        success: true,
        url: accountLink.url,
        expiresAt: accountLink.expires_at,
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
