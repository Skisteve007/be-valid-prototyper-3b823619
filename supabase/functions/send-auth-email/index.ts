import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    let emailData: any;
    let userEmail: string;
    let userName: string = "";

    // Check if this is a webhook from Supabase Auth Hook
    if (hookSecret) {
      try {
        const wh = new Webhook(hookSecret);
        const verified = wh.verify(payload, headers) as {
          user: { email: string; user_metadata?: { full_name?: string } };
          email_data: {
            token: string;
            token_hash: string;
            redirect_to: string;
            email_action_type: string;
          };
        };
        
        userEmail = verified.user.email;
        userName = verified.user.user_metadata?.full_name?.split(' ')[0] || "";
        emailData = verified.email_data;
        
        console.log("Auth Hook triggered for:", userEmail, "Type:", emailData.email_action_type);
      } catch (webhookError) {
        console.log("Not a webhook request, trying direct call:", webhookError);
        // Fall back to direct API call format
        const body = JSON.parse(payload);
        userEmail = body.email;
        userName = body.userName || "";
        emailData = {
          email_action_type: body.type,
          token_hash: body.token_hash,
          redirect_to: body.redirect_to || "https://bevalid.app/dashboard",
        };
      }
    } else {
      // Direct API call (no hook secret configured)
      const body = JSON.parse(payload);
      userEmail = body.email;
      userName = body.userName || "";
      emailData = {
        email_action_type: body.type,
        token_hash: body.token_hash,
        redirect_to: body.redirect_to || "https://bevalid.app/dashboard",
      };
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    
    let subject = "";
    let html = "";

    const actionType = emailData.email_action_type || emailData.type;

    if (actionType === "signup" || actionType === "signup_confirmation") {
      const confirmLink = emailData.token_hash 
        ? `${supabaseUrl}/auth/v1/verify?token=${emailData.token_hash}&type=signup&redirect_to=${encodeURIComponent(emailData.redirect_to || "https://bevalid.app/dashboard")}`
        : "https://bevalid.app/auth?mode=login";
      
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
            <a href="${confirmLink}" style="background: linear-gradient(135deg, #00f0ff, #0080ff); color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
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
    } else if (actionType === "recovery" || actionType === "password_reset") {
      const resetLink = emailData.token_hash 
        ? `${supabaseUrl}/auth/v1/verify?token=${emailData.token_hash}&type=recovery&redirect_to=${encodeURIComponent(emailData.redirect_to || "https://bevalid.app/auth?mode=login")}`
        : "https://bevalid.app/auth?mode=login";
      
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
            <a href="${resetLink}" style="background: linear-gradient(135deg, #00f0ff, #0080ff); color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="font-size: 14px; color: #888;">
            This link expires in 1 hour. If you didn't request a password reset, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            © ${new Date().getFullYear()} VALID™. All rights reserved.
          </p>
        </div>
      `;
    } else if (actionType === "magiclink") {
      const magicLink = `${supabaseUrl}/auth/v1/verify?token=${emailData.token_hash}&type=magiclink&redirect_to=${encodeURIComponent(emailData.redirect_to || "https://bevalid.app/dashboard")}`;
      
      subject = "Your VALID™ Login Link";
      html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #e0e0ff; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00f0ff; font-size: 28px; margin: 0;">VALID™</h1>
            <p style="color: #888; font-size: 14px;">One Identity. Zero Limits.</p>
          </div>
          
          <h2 style="color: #fff; font-size: 22px;">Login Link</h2>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Click the button below to log in to your VALID™ account.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" style="background: linear-gradient(135deg, #00f0ff, #0080ff); color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Log In to VALID™
            </a>
          </div>
          
          <p style="font-size: 14px; color: #888;">
            This link expires in 1 hour. If you didn't request this, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            © ${new Date().getFullYear()} VALID™. All rights reserved.
          </p>
        </div>
      `;
    } else {
      console.log("Unknown email type:", actionType);
      return new Response(JSON.stringify({ error: "Unknown email type" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailResponse = await resend.emails.send({
      from: "VALID™ <admin@bevalid.app>",
      to: [userEmail],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending auth email:", error);
    return new Response(
      JSON.stringify({ error: { http_code: 500, message: error.message } }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
