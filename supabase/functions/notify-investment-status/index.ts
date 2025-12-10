import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvestmentNotificationRequest {
  investorName: string;
  amount: number;
  status: string;
  date: string;
  totalRaised: number;
  trancheCap: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { investorName, amount, status, date, totalRaised, trancheCap }: InvestmentNotificationRequest = await req.json();

    console.log(`Processing investment notification for ${investorName}, status: ${status}`);

    const formattedAmount = new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(amount);

    const formattedTotal = new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(totalRaised);

    const formattedCap = new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(trancheCap);

    const progressPercent = Math.min((totalRaised / trancheCap) * 100, 100).toFixed(1);
    const isTrancheFilled = totalRaised >= trancheCap;

    const statusEmoji = status === "Cleared in Bank" ? "✅" : "💸";
    const subject = `${statusEmoji} Investment Update: ${investorName} - ${status}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0891b2, #3b82f6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
          .highlight { background: #fff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #0891b2; }
          .progress-bar { background: #e2e8f0; border-radius: 8px; height: 20px; overflow: hidden; margin: 10px 0; }
          .progress-fill { background: ${isTrancheFilled ? '#22c55e' : 'linear-gradient(90deg, #0891b2, #3b82f6)'}; height: 100%; transition: width 0.3s; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
          .badge-success { background: #dcfce7; color: #16a34a; }
          .badge-info { background: #dbeafe; color: #2563eb; }
          .footer { text-align: center; padding: 15px; color: #64748b; font-size: 12px; }
          .stat { text-align: center; padding: 10px; }
          .stat-value { font-size: 24px; font-weight: bold; color: #0891b2; }
          .stat-label { font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">💰 Investment Alert</h1>
            <p style="margin: 5px 0 0;">Giant Ventures / VALID™ Deal Room</p>
          </div>
          <div class="content">
            <div class="highlight">
              <h2 style="margin: 0 0 10px;">${investorName}</h2>
              <p style="margin: 0;"><strong>Amount:</strong> ${formattedAmount}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span class="badge ${status === 'Cleared in Bank' ? 'badge-success' : 'badge-info'}">${status}</span></p>
              <p style="margin: 5px 0 0;"><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <h3>Tranche 1 Progress</h3>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <p style="text-align: center; font-size: 14px;">
              <strong>${formattedTotal}</strong> of ${formattedCap} (${progressPercent}%)
            </p>
            
            ${isTrancheFilled ? `
              <div style="background: #dcfce7; border: 1px solid #22c55e; padding: 15px; border-radius: 8px; text-align: center; margin-top: 15px;">
                <h3 style="color: #16a34a; margin: 0;">🎉 Tranche 1 FILLED!</h3>
                <p style="margin: 5px 0 0; color: #166534;">Time to switch to Tranche 2 pricing.</p>
              </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>This is an automated notification from the VALID™ Deal Room</p>
            <p>Giant Ventures, LLC • Boca Raton, FL</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to admin emails
    const adminEmails = ["sgrillocce@gmail.com", "aeidigitalsolutions@gmail.com"];
    
    const emailResponse = await resend.emails.send({
      from: "VALID Deal Room <onboarding@resend.dev>",
      to: adminEmails,
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-investment-status function:", error);
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
