import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");



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

    const accessTypeLabel = accessType === "investor" ? "Investor Deck" : "Partner Solutions";
    
    // Send notification to admin using Resend API directly
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "VALID Access Control <onboarding@resend.dev>",
        to: ["pitbossent@gmail.com"],
        subject: `🔐 New ${accessTypeLabel} Access Request - ${userName}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #00f0ff33;">
            <h1 style="color: #00f0ff; margin-bottom: 24px; font-size: 24px;">🔐 Access Request Received</h1>
            
            <div style="background: #111; padding: 20px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #00f0ff;">
              <p style="margin: 0 0 12px 0;"><strong style="color: #00f0ff;">Access Type:</strong> ${accessTypeLabel}</p>
              <p style="margin: 0 0 12px 0;"><strong style="color: #00f0ff;">User Name:</strong> ${userName || "Not provided"}</p>
              <p style="margin: 0 0 12px 0;"><strong style="color: #00f0ff;">User Email:</strong> ${userEmail}</p>
              <p style="margin: 0;"><strong style="color: #00f0ff;">Requested At:</strong> ${new Date(requestedAt).toLocaleString()}</p>
            </div>
            
            <p style="color: #888; font-size: 14px;">
              Log into your VALID Admin Panel to approve or deny this request.
            </p>
            
            <a href="https://bevalid.app/admin" style="display: inline-block; background: linear-gradient(135deg, #00f0ff, #0088ff); color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px;">
              Open Admin Panel
            </a>
            
            <p style="color: #666; font-size: 12px; margin-top: 32px; border-top: 1px solid #333; padding-top: 16px;">
              This is an automated security notification from VALID™ Access Control.
            </p>
          </div>
        `,
      }),
    });

    const emailResponse = await res.json();
    console.log("Access request notification sent:", emailResponse);

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