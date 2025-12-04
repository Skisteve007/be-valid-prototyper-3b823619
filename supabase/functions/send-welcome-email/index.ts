import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  fullName: string;
  memberId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    // Extract JWT token from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No Authorization header found');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decode JWT to get user ID (JWT is already verified by Supabase runtime since verify_jwt=true)
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;

    if (!userId) {
      console.error('No user ID found in JWT');
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Sending welcome email for authenticated user:', userId);
    
    // Use service role key to fetch user data
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user email from auth.users
    const { data: { user }, error: userError } = await supabaseClient.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      console.error('Failed to fetch user:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('full_name, member_id')
      .eq('user_id', userId)
      .single();
    
    if (profileError || !profile) {
      console.error('Failed to fetch profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const email = user.email!;
    const fullName = profile.full_name || 'Member';
    const memberId = profile.member_id;

    console.log("Sending welcome email to:", email, "with member ID:", memberId);

    const emailResponse = await resend.emails.send({
      from: "Clean Check <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Clean Check - Your Membership is Confirmed!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f8f9fa;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .member-id {
                background: white;
                border: 2px solid #2563eb;
                padding: 20px;
                text-align: center;
                border-radius: 8px;
                margin: 20px 0;
              }
              .member-id-label {
                font-size: 14px;
                color: #666;
                margin-bottom: 5px;
              }
              .member-id-value {
                font-size: 28px;
                font-weight: bold;
                color: #2563eb;
                letter-spacing: 2px;
              }
              .highlight-box {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border-left: 4px solid #2563eb;
                padding: 20px;
                border-radius: 0 8px 8px 0;
                margin: 20px 0;
              }
              .highlight-box h3 {
                color: #2563eb;
                margin: 0 0 15px 0;
                font-size: 18px;
              }
              .highlight-box ul {
                margin: 0;
                padding-left: 20px;
              }
              .highlight-box li {
                padding: 8px 0;
                color: #1e3a5f;
              }
              .speed-badge {
                display: inline-block;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 14px;
                margin: 10px 0;
              }
              .feature-list {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .feature-item {
                padding: 10px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              .feature-item:last-child {
                border-bottom: none;
              }
              .cta-button {
                display: inline-block;
                background: #2563eb;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                margin: 10px 5px;
                font-weight: bold;
              }
              .share-button {
                display: inline-block;
                background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                margin: 10px 5px;
                font-weight: bold;
              }
              .discount-box {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border: 2px dashed #f59e0b;
                padding: 20px;
                text-align: center;
                border-radius: 8px;
                margin: 25px 0;
              }
              .discount-code {
                font-size: 24px;
                font-weight: bold;
                color: #d97706;
                letter-spacing: 3px;
                background: white;
                padding: 10px 20px;
                border-radius: 5px;
                display: inline-block;
                margin: 10px 0;
              }
              .footer {
                text-align: center;
                color: #666;
                font-size: 12px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">🎉 Welcome to Clean Check!</h1>
              <p style="margin: 10px 0 0 0;">Your membership is now active</p>
            </div>
            
            <div class="content">
              <h2>Hi ${fullName}! 👋</h2>
              
              <p>Congratulations! Your Clean Check membership has been successfully activated. You're now part of a community that values verified transparency and mutual trust.</p>
              
              <div class="member-id">
                <div class="member-id-label">YOUR UNIQUE MEMBER ID</div>
                <div class="member-id-value">${memberId}</div>
              </div>
              
              <div class="highlight-box">
                <h3>🛡️ What is Clean Check?</h3>
                <ul>
                  <li><strong>Instant Health Verification</strong> - Share your verified health & toxicology status with a single QR scan</li>
                  <li><strong>Privacy-First Design</strong> - You control who sees your information and when</li>
                  <li><strong>Lab-Certified Results</strong> - Integrated with trusted laboratories for authentic verification</li>
                  <li><strong>Peer-to-Peer Trust</strong> - Build mutual confidence in lifestyle and professional settings</li>
                  <li><strong>HIPAA-Compliant Security</strong> - Your sensitive data is encrypted and protected</li>
                </ul>
              </div>
              
              <center>
                <div class="speed-badge">⚡ QR SCAN VERIFICATION IN UNDER 3 SECONDS</div>
              </center>
              
              <p style="text-align: center; color: #666; font-size: 14px;">
                No more awkward conversations. No paperwork. Just scan, verify, and go with confidence.
              </p>
              
              <div class="feature-list">
                <h3 style="margin-top: 0;">🚀 Get Started Now:</h3>
                <div class="feature-item">
                  ✅ <strong>Complete Your Profile:</strong> Add your personal information
                </div>
                <div class="feature-item">
                  📸 <strong>Upload Profile Photo:</strong> Required for verification
                </div>
                <div class="feature-item">
                  📄 <strong>Upload Documents:</strong> Add your health verification documents
                </div>
                <div class="feature-item">
                  📱 <strong>Get Your QR Code:</strong> Your unique QR badge unlocks after setup
                </div>
              </div>
              
              <center>
                <a href="https://cleancheck.fit/dashboard" class="cta-button">
                  Access Your Dashboard →
                </a>
              </center>
              
              <div class="discount-box">
                <h3 style="margin: 0 0 10px 0; color: #92400e;">🎁 Share the Safety! Give 10% Off</h3>
                <p style="margin: 0 0 10px 0; color: #78350f;">Know someone who values verified trust? Share this exclusive discount code:</p>
                <div class="discount-code">CLEANFRIEND10</div>
                <p style="margin: 10px 0 0 0; font-size: 13px; color: #92400e;">Valid for new members only. Share the link below!</p>
              </div>
              
              <center>
                <a href="https://cleancheck.fit/?discount=CLEANFRIEND10" class="share-button">
                  🔗 Share Clean Check with Friends
                </a>
              </center>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>Need Help?</strong><br>
                If you have any questions or need assistance, please contact our support team.
              </p>
            </div>
            
            <div class="footer">
              <p>
                This email was sent to ${email}<br>
                Clean Check - One Scan. Zero Doubt.
              </p>
              <p>&copy; 2025 Clean Check. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
