import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PayoutRequest {
  affiliateId: string;
  amount: number;
  paypalEmail: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { affiliateId, amount, paypalEmail }: PayoutRequest = await req.json();

    // Verify user owns this affiliate account
    const { data: affiliate, error: affError } = await supabaseAdmin
      .from("affiliates")
      .select("*, profile:profiles!affiliates_user_id_fkey(full_name)")
      .eq("id", affiliateId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (affError || !affiliate) {
      return new Response(JSON.stringify({ error: "Affiliate not found or access denied" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const profileData = Array.isArray(affiliate.profile) ? affiliate.profile[0] : affiliate.profile;
    const affiliateName = profileData?.full_name || "Unknown Affiliate";

    console.log(`Payout request from ${affiliateName}: $${amount} to ${paypalEmail}`);

    // Send email to admin using Resend API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Clean Check <onboarding@resend.dev>",
        to: ["Steve@bigtexasroof.com"],
        subject: `💰 Affiliate Payout Request: $${amount.toFixed(2)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ec4899;">Affiliate Payout Request</h1>
            
            <div style="background: #1f2937; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Request Details</h2>
              <p><strong>Affiliate:</strong> ${affiliateName}</p>
              <p><strong>Referral Code:</strong> ${affiliate.referral_code}</p>
              <p><strong>Amount Requested:</strong> <span style="color: #22c55e; font-size: 24px;">$${amount.toFixed(2)}</span></p>
              <p><strong>PayPal Email:</strong> <a href="mailto:${paypalEmail}" style="color: #60a5fa;">${paypalEmail}</a></p>
            </div>
            
            <p style="color: #6b7280;">
              After sending payment via PayPal, go to Admin → Sales Team and click "Mark as Paid" 
              to clear their balance and update the records.
            </p>
            
            <p style="color: #9ca3af; font-size: 12px;">
              This is an automated message from Clean Check Affiliate System.
            </p>
          </div>
        `,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Payout request email sent:", emailResult);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in request-affiliate-payout:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
