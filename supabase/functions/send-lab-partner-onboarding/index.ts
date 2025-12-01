import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LabPartnerOnboardingRequest {
  partnerName: string;
  partnerEmail: string;
  category: 'lab_certified' | 'toxicology';
  websiteUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { partnerName, partnerEmail, category, websiteUrl }: LabPartnerOnboardingRequest = await req.json();

    console.log(`Sending lab partner onboarding email to ${partnerEmail} for ${partnerName}`);

    const categoryDisplay = category === 'lab_certified' ? 'Sexual Health (13-Panel)' : 'Toxicology (10-Panel)';
    const testDetails = category === 'lab_certified' 
      ? `
        <h3 style="color: #8b5cf6; margin-top: 24px;">13-Panel Sexual Health Screen Includes:</h3>
        <ul style="color: #666; line-height: 1.8;">
          <li>HIV I/II (Early Detection + Antibody)</li>
          <li>Herpes Simplex 1 & 2 (HSV-1, HSV-2)</li>
          <li>Hepatitis B & C</li>
          <li>Syphilis</li>
          <li>Chlamydia, Gonorrhea, Trichomoniasis</li>
          <li>Mycoplasma Genitalium, Ureaplasma Urealyticum</li>
          <li>Gardnerella (Bacterial Vaginosis)</li>
        </ul>
      `
      : `
        <h3 style="color: #22c55e; margin-top: 24px;">10-Panel Toxicology Screen Includes:</h3>
        <ul style="color: #666; line-height: 1.8;">
          <li>Amphetamines (AMP)</li>
          <li>Cannabinoids / THC</li>
          <li>Cocaine (COC)</li>
          <li>Opiates (OPI)</li>
          <li>Phencyclidine / PCP</li>
          <li>Benzodiazepines (BZO)</li>
          <li>Barbiturates (BAR)</li>
          <li>Methadone (MTD)</li>
          <li>Methamphetamine (mAMP)</li>
          <li>Ecstasy / MDMA</li>
        </ul>
      `;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Clean Check</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Lab Partner Integration Portal</p>
            </div>

            <!-- Body -->
            <div style="padding: 32px;">
              <h2 style="color: #1e293b; margin-top: 0;">Welcome, ${partnerName}! 🎉</h2>
              
              <p style="color: #475569; line-height: 1.6; margin: 16px 0;">
                Thank you for partnering with Clean Check to provide <strong>${categoryDisplay}</strong> testing services. 
                You've been successfully added to our platform as a trusted lab partner.
              </p>

              <div style="background: #f1f5f9; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0; color: #334155; font-weight: 600;">🔗 Your Partner Profile:</p>
                <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px;">
                  <strong>Category:</strong> ${categoryDisplay}<br>
                  ${websiteUrl ? `<strong>Website:</strong> ${websiteUrl}<br>` : ''}
                  <strong>Logo Display:</strong> Active on member dashboard
                </p>
              </div>

              ${testDetails}

              <h3 style="color: #1e293b; margin-top: 32px;">🚀 Next Steps:</h3>
              
              <div style="background: #fefce8; border-left: 4px solid #eab308; padding: 16px; margin: 16px 0; border-radius: 4px;">
                <p style="margin: 0; color: #713f12; font-weight: 600;">📋 Integration Checklist:</p>
                <ol style="margin: 12px 0 0 0; padding-left: 20px; color: #854d0e; line-height: 1.8;">
                  <li><strong>API Access:</strong> You'll receive your unique API key separately for result submission</li>
                  <li><strong>Barcode System:</strong> Members generate 12-digit alphanumeric barcodes for sample identification</li>
                  <li><strong>Webhook Integration:</strong> Submit results to our secure endpoint with your API key</li>
                  <li><strong>Result Format:</strong> JSON payload with barcode_value, result_status (negative/positive/inconclusive), and order_status</li>
                </ol>
              </div>

              <h3 style="color: #1e293b; margin-top: 24px;">📊 Platform Benefits:</h3>
              <ul style="color: #475569; line-height: 1.8;">
                <li><strong>Recurring Volume:</strong> 90-day testing cycles drive consistent order flow</li>
                <li><strong>Zero Support Burden:</strong> Automated exception handling and member notifications</li>
                <li><strong>Brand Visibility:</strong> Your logo appears on member dashboards and QR codes</li>
                <li><strong>Instant Verification:</strong> Results integrate directly into member profiles</li>
              </ul>

              <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 20px; margin: 32px 0; border-radius: 8px; text-align: center;">
                <p style="color: white; margin: 0; font-size: 16px; font-weight: 600;">
                  🎯 Ready to start processing samples?
                </p>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">
                  Your API credentials and technical documentation will arrive in a separate email.
                </p>
              </div>

              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
                Questions? Contact our technical team at <a href="mailto:HelpDeskCCK@gmail.com" style="color: #3b82f6; text-decoration: none;">HelpDeskCCK@gmail.com</a>
              </p>

              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">

              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                Clean Check - Confidently Share Peer-To-Peer Record Status<br>
                13492 Research Blvd Suite 120 #306, Austin, TX 78750
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Clean Check <onboarding@resend.dev>",
      to: [partnerEmail],
      subject: `Welcome to Clean Check Lab Partners - ${categoryDisplay} Integration`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending lab partner onboarding email:", error);
      throw error;
    }

    console.log("Lab partner onboarding email sent successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Lab partner onboarding email sent successfully",
        emailId: data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-lab-partner-onboarding function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
