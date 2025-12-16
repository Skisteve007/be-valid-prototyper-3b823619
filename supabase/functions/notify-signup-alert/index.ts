import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SignupAlertRequest {
  userId: string;
  email: string;
  fullName: string;
  createdAt: string;
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, email, fullName, createdAt, source } = await req.json() as SignupAlertRequest;

    console.log("Sending signup alert for:", email);

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get total user count
    const { count: totalUsers } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const signupDate = new Date(createdAt);
    const formattedDate = signupDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const emailResponse = await resend.emails.send({
      from: "VALID™ Alerts <onboarding@resend.dev>",
      to: ["steve@bevalid.app"],
      subject: `🚀 New VALID™ Signup - ${fullName || 'New User'}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #0a0a0a;
                color: #ffffff;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
                border-radius: 16px;
                border: 1px solid rgba(0, 240, 255, 0.2);
                overflow: hidden;
              }
              .header {
                background: linear-gradient(135deg, #00f0ff 0%, #0080ff 100%);
                padding: 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                color: #000;
                font-size: 24px;
                letter-spacing: 2px;
              }
              .content {
                padding: 30px;
              }
              .divider {
                border: none;
                border-top: 1px solid rgba(0, 240, 255, 0.3);
                margin: 20px 0;
              }
              .label {
                color: #888;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
              }
              .value {
                color: #fff;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 20px;
              }
              .highlight {
                color: #00f0ff;
              }
              .stats-box {
                background: rgba(0, 240, 255, 0.1);
                border: 1px solid rgba(0, 240, 255, 0.3);
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                margin-top: 20px;
              }
              .stats-number {
                font-size: 48px;
                font-weight: bold;
                color: #00f0ff;
                margin: 0;
              }
              .stats-label {
                color: #888;
                font-size: 14px;
                margin-top: 5px;
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
                border-top: 1px solid rgba(255,255,255,0.1);
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #00f0ff 0%, #0080ff 100%);
                color: #000;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚀 NEW USER ALERT</h1>
              </div>
              
              <div class="content">
                <hr class="divider">
                
                <div class="label">Name</div>
                <div class="value">${fullName || 'Not provided'}</div>
                
                <div class="label">Email Address</div>
                <div class="value highlight">${email}</div>
                
                <div class="label">Signed Up</div>
                <div class="value">${formattedDate}</div>
                
                <div class="label">Source</div>
                <div class="value">${source || 'Direct'}</div>
                
                <hr class="divider">
                
                <div class="stats-box">
                  <p class="stats-number">${totalUsers?.toLocaleString() || '0'}</p>
                  <p class="stats-label">Total Users</p>
                </div>
                
                <center>
                  <a href="https://bevalid.app/admin" class="cta-button">
                    View in Admin Dashboard →
                  </a>
                </center>
              </div>
              
              <div class="footer">
                VALID™ — We Check. We Don't Collect.<br>
                © 2025 Giant Ventures LLC
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Signup alert email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-signup-alert function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
