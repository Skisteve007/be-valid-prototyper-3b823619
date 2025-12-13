import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");
  const accessType = url.searchParams.get("type") as "investor" | "partner";
  const token = url.searchParams.get("token");

  // Simple validation
  if (!userId || !accessType || !token) {
    return new Response(generateHTML("error", "Invalid request parameters"), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Validate token (simple hash check)
  const expectedToken = btoa(`${userId}-${accessType}-valid-approval`).substring(0, 20);
  if (token !== expectedToken) {
    return new Response(generateHTML("error", "Invalid or expired approval token"), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      console.error("Profile not found:", profileError);
      return new Response(generateHTML("error", "User not found"), {
        status: 404,
        headers: { "Content-Type": "text/html" },
      });
    }

    // Update approval status
    const approvalField = accessType === "investor" 
      ? "investor_access_approved" 
      : "partner_access_approved";
    const approvalDateField = accessType === "investor"
      ? "investor_access_approved_at"
      : "partner_access_approved_at";

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        [approvalField]: true,
        [approvalDateField]: new Date().toISOString()
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(generateHTML("error", "Failed to approve access"), {
        status: 500,
        headers: { "Content-Type": "text/html" },
      });
    }

    const accessLabel = accessType === "investor" ? "Investor Deck" : "Partner Solutions";
    const accessUrl = accessType === "investor" 
      ? "https://bevalid.app/pitch-deck" 
      : "https://bevalid.app/partners";

    // Send confirmation email to the user
    if (profile.email) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "VALID Access Control <noreply@bevalid.app>",
          to: [profile.email],
          subject: `✅ Your ${accessLabel} Access Has Been Approved`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #00f0ff33;">
              <h1 style="color: #00f0ff; margin-bottom: 24px; font-size: 24px;">✅ Access Approved!</h1>
              
              <p style="font-size: 16px; margin-bottom: 24px;">
                Hi ${profile.full_name || "there"},
              </p>
              
              <p style="font-size: 16px; margin-bottom: 24px;">
                Great news! Your request for <strong style="color: #00f0ff;">${accessLabel}</strong> access has been approved.
              </p>
              
              <a href="${accessUrl}" style="display: inline-block; background: linear-gradient(135deg, #00f0ff, #0088ff); color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px;">
                Access ${accessLabel} Now
              </a>
              
              <p style="color: #666; font-size: 12px; margin-top: 32px; border-top: 1px solid #333; padding-top: 16px;">
                This is an automated notification from VALID™ Access Control.
              </p>
            </div>
          `,
        }),
      });
    }

    console.log(`Access approved for ${profile.email} - ${accessType}`);

    return new Response(generateHTML("success", `${accessLabel} access approved for ${profile.full_name || profile.email}!`), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });

  } catch (error: any) {
    console.error("Error approving access:", error);
    return new Response(generateHTML("error", error.message), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
};

function generateHTML(status: "success" | "error", message: string): string {
  const isSuccess = status === "success";
  const bgColor = isSuccess ? "#00f0ff" : "#ff4444";
  const icon = isSuccess ? "✅" : "❌";
  
  // For success, show a brief message then auto-close
  if (isSuccess) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>VALID™ Access Approved</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #0a0a0a;
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
          }
          .card {
            background: #111;
            border: 1px solid #00f0ff33;
            border-radius: 16px;
            padding: 40px;
            text-align: center;
            max-width: 400px;
          }
          .icon { font-size: 48px; margin-bottom: 20px; }
          h1 { color: #00f0ff; margin-bottom: 16px; }
          p { color: #888; line-height: 1.6; }
        </style>
        <script>
          // Auto-close this tab after 2 seconds
          setTimeout(function() { window.close(); }, 2000);
        </script>
      </head>
      <body>
        <div class="card">
          <div class="icon">✅</div>
          <h1>Access Approved!</h1>
          <p>${message}</p>
          <p style="color: #666; font-size: 12px; margin-top: 16px;">This window will close automatically...</p>
        </div>
      </body>
      </html>
    `;
  }
  
  // For errors, show the error message
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>VALID™ Access Error</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: #0a0a0a;
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 20px;
        }
        .card {
          background: #111;
          border: 1px solid #ff444433;
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          max-width: 400px;
        }
        .icon { font-size: 48px; margin-bottom: 20px; }
        h1 { color: #ff4444; margin-bottom: 16px; }
        p { color: #888; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">❌</div>
        <h1>Error</h1>
        <p>${message}</p>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
