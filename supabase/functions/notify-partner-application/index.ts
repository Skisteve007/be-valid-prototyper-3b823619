import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Admin emails to notify
const ADMIN_EMAILS = [
  "sgrillocce@gmail.com",
  "aeidigitalsolutions@gmail.com"
];

interface PartnerApplicationData {
  fullName: string;
  email: string;
  phone: string;
  payoutMethod: string;
  payoutHandle: string;
  referralCode: string;
  idFrontUrl: string;
  idBackUrl: string;
  submittedAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("notify-partner-application function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const applicationData: PartnerApplicationData = await req.json();
    console.log("Received partner application data:", {
      fullName: applicationData.fullName,
      email: applicationData.email,
      referralCode: applicationData.referralCode
    });

    // Send email to all admin emails
    const emailPromises = ADMIN_EMAILS.map(async (adminEmail) => {
      const emailResponse = await resend.emails.send({
        from: "Clean Check <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `🆕 New Partner Application: ${applicationData.fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🤝 New Partner Application</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px; border-radius: 0 0 10px 10px; color: #e2e8f0;">
              <p style="color: #fbbf24; font-weight: bold; margin-bottom: 20px;">A new strategic partner application has been submitted and requires your review.</p>
              
              <div style="background: #334155; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #fbbf24; font-size: 16px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Applicant Details</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8; width: 140px;">Full Name:</td>
                    <td style="padding: 8px 0; color: white; font-weight: bold;">${applicationData.fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8;">Email:</td>
                    <td style="padding: 8px 0; color: white;">${applicationData.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8;">Phone:</td>
                    <td style="padding: 8px 0; color: white;">${applicationData.phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8;">Referral Code:</td>
                    <td style="padding: 8px 0; color: #22c55e; font-weight: bold; font-family: monospace;">${applicationData.referralCode}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #334155; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #fbbf24; font-size: 16px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Payout Information</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8; width: 140px;">Method:</td>
                    <td style="padding: 8px 0; color: white; text-transform: capitalize;">${applicationData.payoutMethod}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8;">Handle/Email:</td>
                    <td style="padding: 8px 0; color: white;">${applicationData.payoutHandle}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #334155; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #fbbf24; font-size: 16px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Identity Documents (KYC)</h2>
                
                <p style="color: #94a3b8; margin-bottom: 15px;">Click below to review uploaded identification documents:</p>
                
                <div style="display: flex; gap: 15px;">
                  <a href="${applicationData.idFrontUrl}" target="_blank" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">📄 View ID Front</a>
                  <a href="${applicationData.idBackUrl}" target="_blank" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">📄 View ID Back</a>
                </div>
              </div>
              
              <div style="background: #dc2626; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="color: white; margin: 0; font-weight: bold;">⚠️ Action Required: Please review this application in the Admin Panel → Sales Team tab to approve or reject.</p>
              </div>
              
              <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
                Submitted: ${new Date(applicationData.submittedAt).toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </p>
            </div>
            
            <p style="color: #64748b; font-size: 11px; text-align: center; margin-top: 20px;">
              Clean Check Partner Program • Automated Notification
            </p>
          </div>
        `,
      });

      console.log(`Email sent to ${adminEmail}:`, emailResponse);
      return emailResponse;
    });

    const results = await Promise.all(emailPromises);
    console.log("All notification emails sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin notifications sent",
        emailsSent: results.length 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-partner-application function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
