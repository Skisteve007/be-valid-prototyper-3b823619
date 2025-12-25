import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      name, 
      email, 
      amount, 
      tier,
      phone,
      linkedinUrl,
      // Investor profile data
      accreditedInvestor,
      investmentExperience,
      sourceOfFunds,
      investmentObjective,
      riskTolerance,
      referralSource,
      paymentMethod,
      paymentHandle,
      referralCode,
    } = await req.json();

    if (!name || !email || !amount) {
      throw new Error("Name, email, and amount are required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { source: "partner_investment", tier: tier || "custom" },
      });
      customerId = customer.id;
    }

    // Encode ALL investor data for success URL
    const investorData = encodeURIComponent(JSON.stringify({
      investorName: name,
      investorEmail: email,
      investmentAmount: amount.toString(),
      phone: phone || '',
      linkedinUrl: linkedinUrl || '',
      accreditedStatus: accreditedInvestor || '',
      investmentExperience: investmentExperience || '',
      sourceOfFunds: sourceOfFunds || '',
      investmentObjective: investmentObjective || '',
      riskTolerance: riskTolerance || '',
      referralSource: referralSource || '',
      paymentMethod: paymentMethod || 'credit_card',
      paymentHandle: paymentHandle || '',
      referralCode: referralCode || '',
    }));

    // Create checkout session with custom amount
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Strategic Partner Investment - ${tier?.toUpperCase() || "CUSTOM"}`,
              description: `Strategic Partner investment in Giant Ventures LLC`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/partner-application?payment_success=true&investor_data=${investorData}`,
      cancel_url: `${req.headers.get("origin")}/partner-application?payment_canceled=true`,
      metadata: {
        source: "partner_investment",
        investor_name: name,
        investor_email: email,
        tier: tier || "custom",
        accredited_status: accreditedInvestor || '',
        investment_experience: investmentExperience || '',
        referral_code: referralCode || '',
      },
    });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Partner investment payment error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
