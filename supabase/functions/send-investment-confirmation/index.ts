import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvestmentConfirmationData {
  investorName: string;
  investorEmail: string;
  investmentAmount: string;
  paymentMethod: string;
  referralCode: string;
  accreditedStatus: string;
  investmentExperience: string;
  investmentObjective: string;
  riskTolerance: string;
  transactionDate: string;
}

const formatAccreditedStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'accredited_income': 'Accredited Investor (Income)',
    'accredited_networth': 'Accredited Investor (Net Worth)',
    'accredited_professional': 'Accredited Investor (Licensed Professional)',
    'accredited_entity': 'Accredited Investor (Entity)',
    'sophisticated': 'Sophisticated Investor',
  };
  return statusMap[status] || status;
};

const formatExperience = (exp: string): string => {
  const expMap: Record<string, string> = {
    'first_time': 'First-Time Angel/Seed Investor',
    'some_experience': '1-3 Private Investments',
    'experienced': '4-10 Private Investments',
    'professional': 'Professional Investor (10+ investments)',
    'institutional': 'Institutional/Fund Manager',
  };
  return expMap[exp] || exp;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-investment-confirmation function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: InvestmentConfirmationData = await req.json();
    console.log("Sending investment confirmation to:", data.investorEmail);

    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(parseInt(data.investmentAmount));

    const transactionDate = new Date(data.transactionDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    // Send confirmation email to investor
    const emailResponse = await resend.emails.send({
      from: "Giant Ventures <onboarding@resend.dev>",
      to: [data.investorEmail],
      subject: `Investment Confirmation - ${formattedAmount} Strategic Partner Investment`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #fbbf24; margin: 0 0 10px 0; font-size: 28px;">🎉 Investment Confirmed</h1>
            <p style="color: #e2e8f0; margin: 0; font-size: 16px;">Thank you for your strategic investment</p>
          </div>
          
          <!-- Main Content -->
          <div style="background: #ffffff; padding: 40px 30px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
            
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Dear <strong>${data.investorName}</strong>,
            </p>
            
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              We are pleased to confirm your investment in <strong>Giant Ventures, LLC d/b/a Clean Check</strong>. 
              Your commitment to our mission is deeply appreciated, and we're excited to have you as a strategic partner.
            </p>
            
            <!-- Investment Summary Box -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px; border: 2px solid #f59e0b;">
              <h2 style="color: #92400e; margin: 0 0 20px 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">Investment Summary</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; color: #78350f; font-weight: 500; border-bottom: 1px solid #fcd34d;">Investment Amount:</td>
                  <td style="padding: 12px 0; color: #78350f; font-weight: bold; font-size: 24px; text-align: right; border-bottom: 1px solid #fcd34d;">${formattedAmount} USD</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #78350f; font-weight: 500; border-bottom: 1px solid #fcd34d;">Transaction Date:</td>
                  <td style="padding: 12px 0; color: #78350f; text-align: right; border-bottom: 1px solid #fcd34d;">${transactionDate}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #78350f; font-weight: 500; border-bottom: 1px solid #fcd34d;">Payment Method:</td>
                  <td style="padding: 12px 0; color: #78350f; text-align: right; border-bottom: 1px solid #fcd34d;">${data.paymentMethod.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #78350f; font-weight: 500;">Partner Reference:</td>
                  <td style="padding: 12px 0; color: #78350f; font-weight: bold; font-family: monospace; text-align: right;">${data.referralCode}</td>
                </tr>
              </table>
            </div>
            
            <!-- Investor Profile -->
            <div style="background: #f1f5f9; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
              <h2 style="color: #334155; margin: 0 0 20px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Investor Profile on File</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #64748b; width: 180px;">Accredited Status:</td>
                  <td style="padding: 10px 0; color: #334155;">${formatAccreditedStatus(data.accreditedStatus)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b;">Experience Level:</td>
                  <td style="padding: 10px 0; color: #334155;">${formatExperience(data.investmentExperience)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b;">Investment Objective:</td>
                  <td style="padding: 10px 0; color: #334155; text-transform: capitalize;">${data.investmentObjective.replace('_', ' ')}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b;">Risk Tolerance:</td>
                  <td style="padding: 10px 0; color: #334155; text-transform: capitalize;">${data.riskTolerance}</td>
                </tr>
              </table>
            </div>
            
            <!-- Contract Summary -->
            <div style="background: #0f172a; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
              <h2 style="color: #fbbf24; margin: 0 0 20px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">📋 Investment Contract Outline</h2>
              
              <div style="color: #e2e8f0; font-size: 14px; line-height: 1.8;">
                <p style="margin: 0 0 15px 0;"><strong style="color: #fbbf24;">1. INVESTMENT COMMITMENT:</strong> Partner commits ${formattedAmount} USD to Giant Ventures, LLC Strategic Partner Program.</p>
                
                <p style="margin: 0 0 15px 0;"><strong style="color: #fbbf24;">2. COMMISSION STRUCTURE:</strong></p>
                <ul style="margin: 0 0 15px 20px; padding: 0;">
                  <li>20% commission on first-year subscription revenue from referred customers</li>
                  <li>10% commission on renewal revenue for years 2-3</li>
                  <li>Commissions paid monthly for preceding calendar month</li>
                </ul>
                
                <p style="margin: 0 0 15px 0;"><strong style="color: #fbbf24;">3. TERM:</strong> One (1) year, automatically renewing unless terminated with 30 days written notice.</p>
                
                <p style="margin: 0 0 15px 0;"><strong style="color: #fbbf24;">4. CONFIDENTIALITY:</strong> Partner agrees to maintain strict confidentiality of all non-public information.</p>
                
                <p style="margin: 0;"><strong style="color: #fbbf24;">5. INTELLECTUAL PROPERTY:</strong> All IP remains exclusive property of Company.</p>
              </div>
            </div>
            
            <!-- Next Steps -->
            <div style="background: #ecfdf5; padding: 25px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin: 0 0 15px 0;">Next Steps</h3>
              <ul style="color: #047857; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Your investment is being processed and will reflect in our records within 24-48 hours</li>
                <li>You will receive access to the Partner Portal shortly</li>
                <li>Our team will reach out to schedule your onboarding call</li>
                <li>Save this email for your records</li>
              </ul>
            </div>
            
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              If you have any questions about your investment or need to update your information, 
              please don't hesitate to contact us at <a href="mailto:Steve@BeValid.app" style="color: #3b82f6;">Steve@BeValid.app</a>.
            </p>
            
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">
              Welcome to the team,<br>
              <strong>Steven Grillo</strong><br>
              Managing Member, Giant Ventures LLC
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #1e293b; padding: 30px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px 0;">
              Giant Ventures, LLC d/b/a Clean Check • Strategic Partner Program
            </p>
            <p style="color: #64748b; font-size: 11px; margin: 0;">
              This is an automated confirmation. Please retain this email for your records.
            </p>
          </div>
          
        </body>
        </html>
      `,
    });

    console.log("Investment confirmation email sent:", emailResponse);

    // Also notify admin
    await resend.emails.send({
      from: "Clean Check <onboarding@resend.dev>",
      to: ["Steve@BeValid.app"],
      subject: `💰 Investment Payment Received: ${formattedAmount} from ${data.investorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #10b981;">Investment Payment Confirmed</h1>
          <p><strong>Investor:</strong> ${data.investorName}</p>
          <p><strong>Amount:</strong> ${formattedAmount}</p>
          <p><strong>Email:</strong> ${data.investorEmail}</p>
          <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
          <p><strong>Reference Code:</strong> ${data.referralCode}</p>
          <p><strong>Accredited Status:</strong> ${formatAccreditedStatus(data.accreditedStatus)}</p>
          <p><strong>Date:</strong> ${transactionDate}</p>
          <hr>
          <p style="color: #64748b;">Confirmation email sent to investor.</p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Investment confirmation sent",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-investment-confirmation function:", error);
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
