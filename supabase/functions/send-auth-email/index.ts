import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  email: string;
  type: 'signup_confirmation' | 'password_reset' | 'wallet_funding';
  confirmationUrl?: string;
  resetUrl?: string;
  amount?: number;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, confirmationUrl, resetUrl, amount, userName }: AuthEmailRequest = await req.json();
    
    console.log(`Sending ${type} email to ${email}`);

    let subject = "";
    let html = "";

    switch (type) {
      case 'signup_confirmation':
        subject = "Confirm your VALID™ account";
        html = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #e0e0ff; padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #00f0ff; font-size: 28px; margin: 0;">VALID™</h1>
              <p style="color: #888; font-size: 14px;">One Identity. Zero Limits.</p>
            </div>
            
            <h2 style="color: #fff; font-size: 22px;">Welcome${userName ? `, ${userName}` : ''}!</h2>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for joining VALID™. Please confirm your email address to activate your account and unlock your secure digital identity.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" style="background: linear-gradient(135deg, #00f0ff, #0080ff); color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Confirm Email
              </a>
            </div>
            
            <p style="font-size: 14px; color: #888;">
              If you didn't create an account with VALID™, you can safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #666; text-align: center;">
              © ${new Date().getFullYear()} VALID™. All rights reserved.<br>
              This is an automated message. Please do not reply.
            </p>
          </div>
        `;
        break;

      case 'password_reset':
        subject = "Reset your VALID™ password";
        html = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #e0e0ff; padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #00f0ff; font-size: 28px; margin: 0;">VALID™</h1>
              <p style="color: #888; font-size: 14px;">One Identity. Zero Limits.</p>
            </div>
            
            <h2 style="color: #fff; font-size: 22px;">Password Reset Request</h2>
            
            <p style="font-size: 16px; line-height: 1.6;">
              We received a request to reset your password. Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #00f0ff, #0080ff); color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #888;">
              This link expires in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </p>
            
            <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #666; text-align: center;">
              © ${new Date().getFullYear()} VALID™. All rights reserved.
            </p>
          </div>
        `;
        break;

      case 'wallet_funding':
        subject = "Wallet Funded Successfully - VALID™";
        html = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #e0e0ff; padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #00f0ff; font-size: 28px; margin: 0;">VALID™</h1>
              <p style="color: #888; font-size: 14px;">Ghost Wallet</p>
            </div>
            
            <h2 style="color: #00ff88; font-size: 22px;">✓ Funds Added Successfully</h2>
            
            <div style="background: #1a1f2e; border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center;">
              <p style="color: #888; font-size: 14px; margin: 0 0 8px 0;">Amount Added</p>
              <p style="color: #00ff88; font-size: 36px; font-weight: bold; margin: 0;">$${amount?.toFixed(2) || '0.00'}</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Your Ghost Wallet has been funded. You're ready to activate Ghost Passes and enjoy seamless access at VALID™ partner venues.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://bevalid.app/dashboard" style="background: linear-gradient(135deg, #00ff88, #00cc66); color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                View Wallet
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #666; text-align: center;">
              © ${new Date().getFullYear()} VALID™. All rights reserved.<br>
              Funds are held in FDIC-insured FBO accounts.
            </p>
          </div>
        `;
        break;
    }

    const emailResponse = await resend.emails.send({
      from: "VALID™ <noreply@bevalid.app>",
      to: [email],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse.data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending auth email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
