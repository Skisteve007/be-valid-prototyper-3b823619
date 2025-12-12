import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  userId: string;
  firstName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userId, firstName }: EmailRequest = await req.json();
    
    console.log("Sending verification email to:", email, "for user:", userId);

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Generate a secure random token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store token in database
    const { error: tokenError } = await supabaseAdmin
      .from("email_verification_tokens")
      .insert({
        user_id: userId,
        token: token,
        email: email,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Error storing token:", tokenError);
      throw new Error("Failed to generate verification token");
    }

    // Build verification URL
    const baseUrl = "https://bevalid.app";
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

    // Send branded email
    const emailResponse = await resend.emails.send({
      from: "Valid™ <admin@bevalid.app>",
      to: [email],
      subject: "Verify Your Valid™ Account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0A0E1A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse;">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <h1 style="margin: 0; font-size: 36px; font-weight: bold; color: #00FFC2; letter-spacing: 2px;">
                        VALID™
                      </h1>
                      <p style="margin: 10px 0 0; color: #888; font-size: 14px; letter-spacing: 1px;">
                        ONE IDENTITY. ZERO LIMITS.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="background: linear-gradient(135deg, rgba(0, 255, 194, 0.1), rgba(0, 240, 255, 0.05)); border: 1px solid rgba(0, 255, 194, 0.3); border-radius: 16px; padding: 40px;">
                      <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; text-align: center;">
                        Welcome${firstName ? `, ${firstName}` : ''}! 🎉
                      </h2>
                      <p style="margin: 0 0 30px; color: #E0E0E0; font-size: 16px; line-height: 1.6; text-align: center;">
                        You're one step away from accessing the Valid™ network. Click the button below to verify your email and activate your account.
                      </p>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center">
                            <a href="${verificationUrl}" 
                               style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #00FFC2, #00f0ff); color: #0A0E1A; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px; letter-spacing: 1px;">
                              VERIFY EMAIL
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0; color: #888; font-size: 14px; text-align: center;">
                        This link expires in 24 hours.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding-top: 30px;">
                      <p style="margin: 0; color: #666; font-size: 12px; text-align: center; line-height: 1.6;">
                        If you didn't create an account with Valid™, you can safely ignore this email.
                      </p>
                      <p style="margin: 15px 0 0; color: #444; font-size: 11px; text-align: center;">
                        © ${new Date().getFullYear()} Valid™ — All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-auth-email function:", error);
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
