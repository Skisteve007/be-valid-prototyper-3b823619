import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Hard-coded app base URL (per product decision)
const APP_BASE_URL = "https://bevalid.app";

const redirectToAccessApproved = (params: {
  status: "success" | "error";
  type?: string | null;
  email?: string | null;
  reason?: string | null;
}) => {
  const url = new URL(`${APP_BASE_URL}/access-approved`);
  url.searchParams.set("status", params.status);
  if (params.type) url.searchParams.set("type", params.type);
  if (params.email) url.searchParams.set("email", params.email);
  if (params.reason) url.searchParams.set("reason", params.reason);

  return new Response(null, {
    status: 303,
    headers: {
      Location: url.toString(),
      "Cache-Control": "no-store",
    },
  });
};

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");
  const accessType = url.searchParams.get("type") as "investor" | "partner";
  const token = url.searchParams.get("token");

  // Simple validation
  if (!userId || !accessType || !token) {
    return redirectToAccessApproved({
      status: "error",
      type: accessType ?? null,
      reason: "invalid_params",
    });
  }

  // Validate token (simple hash check)
  const expectedToken = btoa(`${userId}-${accessType}-valid-approval`).substring(0, 20);
  if (token !== expectedToken) {
    return redirectToAccessApproved({
      status: "error",
      type: accessType,
      reason: "invalid_token",
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
      return redirectToAccessApproved({
        status: "error",
        type: accessType,
        reason: "user_not_found",
      });
    }

    // Update approval status
    const approvalField = accessType === "investor" ? "investor_access_approved" : "partner_access_approved";
    const approvalDateField =
      accessType === "investor" ? "investor_access_approved_at" : "partner_access_approved_at";

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        [approvalField]: true,
        [approvalDateField]: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Update error:", updateError);
      return redirectToAccessApproved({
        status: "error",
        type: accessType,
        email: profile.email ?? null,
        reason: "update_failed",
      });
    }

    const accessLabel = accessType === "investor" ? "Investor Deck" : "Partner Solutions";
    const accessUrl = accessType === "investor" ? "https://bevalid.app/pitch-deck" : "https://bevalid.app/partners";

    // Send confirmation email to the user
    if (profile.email) {
      console.log("Sending approval confirmation to:", profile.email);

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "VALID™ Access Control <noreply@bevalid.app>",
          to: [profile.email],
          subject: `VALID™ Access Control — ${accessLabel} approved`,
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

      const emailResponse = await emailRes.json();
      console.log("User notification email response:", JSON.stringify(emailResponse));

      if (!emailRes.ok) {
        console.error("Resend user notification email error:", emailResponse);
      } else {
        console.log("User notification email sent successfully");
      }
    }

    console.log(`Access approved for ${profile.email} - ${accessType}`);

    // Redirect admin to an in-app confirmation page (no more raw function HTML)
    return redirectToAccessApproved({
      status: "success",
      type: accessType,
      email: profile.email ?? null,
    });
  } catch (error: any) {
    console.error("Error approving access:", error);
    return redirectToAccessApproved({
      status: "error",
      type: accessType ?? null,
      reason: "unexpected",
    });
  }
};

function generateHTML(status: "success" | "error", message: string): string {
  if (status === "success") {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Access Approved | VALID</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0a0e1a 0%, #120a21 50%, #0a0e1a 100%);
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: rgba(17, 17, 17, 0.9);
      border: 2px solid #00e5e5;
      border-radius: 24px;
      padding: 60px 50px;
      text-align: center;
      max-width: 420px;
      box-shadow: 0 0 60px rgba(0, 229, 229, 0.25), 0 20px 40px rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
    }
    .check {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #00e5e5, #00a0a0);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 30px;
      font-size: 50px;
      box-shadow: 0 0 30px rgba(0, 229, 229, 0.5);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 30px rgba(0, 229, 229, 0.5); }
      50% { box-shadow: 0 0 50px rgba(0, 229, 229, 0.8); }
    }
    h1 {
      color: #00e5e5;
      font-size: 32px;
      margin-bottom: 16px;
      font-weight: 700;
    }
    p {
      color: #aaa;
      font-size: 18px;
      line-height: 1.6;
    }
    .badge {
      display: inline-block;
      background: rgba(0, 229, 229, 0.15);
      border: 1px solid rgba(0, 229, 229, 0.4);
      color: #00e5e5;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 24px;
    }
    .logo {
      margin-top: 30px;
      font-size: 14px;
      color: #666;
      letter-spacing: 3px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="check">✓</div>
    <h1>Access Approved!</h1>
    <p>The user has been granted access and notified via email.</p>
    <div class="badge">VALID™ Access Control</div>
    <div class="logo">VALID™</div>
  </div>
</body>
</html>`;
  }
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Error | VALID</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0a0e1a 0%, #1a0a0a 50%, #0a0e1a 100%);
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: rgba(17, 17, 17, 0.9);
      border: 2px solid #ff4444;
      border-radius: 24px;
      padding: 60px 50px;
      text-align: center;
      max-width: 420px;
      box-shadow: 0 0 60px rgba(255, 68, 68, 0.25), 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .icon {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #ff4444, #cc0000);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 30px;
      font-size: 50px;
      box-shadow: 0 0 30px rgba(255, 68, 68, 0.5);
    }
    h1 {
      color: #ff4444;
      font-size: 32px;
      margin-bottom: 16px;
      font-weight: 700;
    }
    p {
      color: #aaa;
      font-size: 18px;
      line-height: 1.6;
    }
    .logo {
      margin-top: 30px;
      font-size: 14px;
      color: #666;
      letter-spacing: 3px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✕</div>
    <h1>Error</h1>
    <p>${message}</p>
    <div class="logo">VALID™</div>
  </div>
</body>
</html>`;
}

serve(handler);
