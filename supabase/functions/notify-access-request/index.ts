import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AccessRequestPayload {
  userEmail: string;
  userName: string;
  accessType: "investor" | "partner";
  requestedAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, accessType, requestedAt }: AccessRequestPayload = await req.json();

    console.log(`Access request notification: ${accessType} access for ${userEmail}`);

    // Get user_id from profile
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", userEmail)
      .single();

    const userId = profile?.user_id;
    const accessTypeLabel = accessType === "investor" ? "Investor Deck" : "Partner Solutions";
    
    // Generate approval token
    const approvalToken = btoa(`${userId}-${accessType}-valid-approval`).substring(0, 20);
    const approvalUrl = `${SUPABASE_URL}/functions/v1/approve-access-request?user_id=${userId}&type=${accessType}&token=${approvalToken}`;
    
    console.log("Sending admin notification email for access request");
    console.log("Approval URL:", approvalUrl);
    
    // Send notification to admin with direct approval button
    // Using Resend sandbox email for reliability - update to verified domain when ready
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "VALID Access Control <noreply@bevalid.app>",
        to: ["Steve@BeValid.app"],
        subject: `🔐 New ${accessTypeLabel} Access Request - ${userName}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #00f0ff33;">
            <h1 style="color: #00f0ff; margin-bottom: 24px; font-size: 24px;">🔐 New Access Request</h1>
            
            <div style="background: #111; padding: 20px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #00f0ff;">
              <p style="margin: 0 0 12px 0;"><strong style="color: #00f0ff;">Access Type:</strong> ${accessTypeLabel}</p>
              <p style="margin: 0 0 12px 0;"><strong style="color: #00f0ff;">User Name:</strong> ${userName || "Not provided"}</p>
              <p style="margin: 0 0 12px 0;"><strong style="color: #00f0ff;">User Email:</strong> ${userEmail}</p>
              <p style="margin: 0;"><strong style="color: #00f0ff;">Requested At:</strong> ${new Date(requestedAt).toLocaleString()}</p>
            </div>
            
            <p style="color: #fff; font-size: 16px; margin-bottom: 20px;">
              Click below to instantly approve this request:
            </p>
            
            <a href="${approvalUrl}" style="display: inline-block; background: linear-gradient(135deg, #00ff88, #00cc66); color: #000; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              ✅ APPROVE ACCESS
            </a>
            
            <p style="color: #666; font-size: 12px; margin-top: 32px; border-top: 1px solid #333; padding-top: 16px;">
              This is an automated security notification from VALID™ Access Control.<br>
              The user will be automatically notified upon approval.
            </p>
          </div>
        `,
      }),
    });

    const emailResponse = await res.json();
    console.log("Resend API response:", JSON.stringify(emailResponse));
    
    if (!res.ok) {
      console.error("Resend API error:", emailResponse);
      throw new Error(emailResponse.message || "Failed to send email");
    }

    console.log("Access request notification sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending access request notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);