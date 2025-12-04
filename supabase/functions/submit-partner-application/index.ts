import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Admin emails to notify
const ADMIN_EMAILS = [
  "sgrillocce@gmail.com",
  "aeidigitalsolutions@gmail.com"
];

interface PartnerApplicationRequest {
  fullName: string;
  email: string;
  phone: string;
  payoutMethod: string;
  payoutHandle: string;
  idFrontBase64: string;
  idBackBase64: string;
  idFrontName: string;
  idBackName: string;
}

function generateReferralCode(name: string): string {
  const cleanName = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName}${random}`;
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  // Remove data URL prefix if present
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("submit-partner-application function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Use service role client for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const data: PartnerApplicationRequest = await req.json();
    console.log("Processing partner application for:", data.email);

    // Generate unique folder for this application
    const applicationId = `app-${Date.now()}-${data.email.replace(/[^a-zA-Z0-9]/g, '')}`;
    const referralCode = generateReferralCode(data.fullName);

    // Upload ID front
    const idFrontBytes = base64ToArrayBuffer(data.idFrontBase64);
    const idFrontExt = data.idFrontName.split('.').pop() || 'jpg';
    const idFrontPath = `${applicationId}/id-front.${idFrontExt}`;
    
    const { error: frontUploadError } = await supabaseAdmin.storage
      .from("affiliate-docs")
      .upload(idFrontPath, idFrontBytes, {
        contentType: `image/${idFrontExt}`,
        upsert: true
      });

    if (frontUploadError) {
      console.error("Error uploading ID front:", frontUploadError);
      throw new Error(`Failed to upload ID front: ${frontUploadError.message}`);
    }

    // Upload ID back
    const idBackBytes = base64ToArrayBuffer(data.idBackBase64);
    const idBackExt = data.idBackName.split('.').pop() || 'jpg';
    const idBackPath = `${applicationId}/id-back.${idBackExt}`;
    
    const { error: backUploadError } = await supabaseAdmin.storage
      .from("affiliate-docs")
      .upload(idBackPath, idBackBytes, {
        contentType: `image/${idBackExt}`,
        upsert: true
      });

    if (backUploadError) {
      console.error("Error uploading ID back:", backUploadError);
      throw new Error(`Failed to upload ID back: ${backUploadError.message}`);
    }

    // Get public URLs
    const { data: frontUrlData } = supabaseAdmin.storage
      .from("affiliate-docs")
      .getPublicUrl(idFrontPath);
    
    const { data: backUrlData } = supabaseAdmin.storage
      .from("affiliate-docs")
      .getPublicUrl(idBackPath);

    const idFrontUrl = frontUrlData.publicUrl;
    const idBackUrl = backUrlData.publicUrl;

    console.log("Documents uploaded successfully");

    // Create affiliate record in database (for existing users who can't insert via RLS)
    // First check if affiliate already exists for this email
    const { data: existingAffiliate } = await supabaseAdmin
      .from("affiliates")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();

    if (!existingAffiliate) {
      // Create new affiliate record without user_id (for existing users not logged in)
      // We'll use a placeholder UUID and let admin link it later if needed
      const { error: insertError } = await supabaseAdmin
        .from("affiliates")
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000', // Placeholder for unlinked applications
          referral_code: referralCode,
          full_name: data.fullName,
          email: data.email,
          phone_number: data.phone,
          payout_method: data.payoutMethod,
          paypal_email: data.payoutHandle,
          id_front_url: idFrontUrl,
          id_back_url: idBackUrl,
          status: 'pending',
        });

      if (insertError) {
        console.error("Error creating affiliate record:", insertError);
        // Don't throw - still send notification even if DB insert fails
      } else {
        console.log("Affiliate record created successfully");
      }
    } else {
      // Update existing affiliate with new info
      const { error: updateError } = await supabaseAdmin
        .from("affiliates")
        .update({
          full_name: data.fullName,
          phone_number: data.phone,
          payout_method: data.payoutMethod,
          paypal_email: data.payoutHandle,
          id_front_url: idFrontUrl,
          id_back_url: idBackUrl,
        })
        .eq("email", data.email);

      if (updateError) {
        console.error("Error updating affiliate record:", updateError);
      } else {
        console.log("Existing affiliate record updated");
      }
    }

    // Send admin notification email
    const emailPromises = ADMIN_EMAILS.map(async (adminEmail) => {
      const emailResponse = await resend.emails.send({
        from: "Clean Check <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `🆕 New Partner Application: ${data.fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🤝 New Partner Application</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px; border-radius: 0 0 10px 10px; color: #e2e8f0;">
              <p style="color: #fbbf24; font-weight: bold; margin-bottom: 20px;">A new strategic partner application has been submitted and requires your review.</p>
              
              <div style="background: #334155; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #fbbf24; font-size: 16px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Applicant Details</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8; width: 140px;">Full Name:</td>
                    <td style="padding: 8px 0; color: white; font-weight: bold;">${data.fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8;">Email:</td>
                    <td style="padding: 8px 0; color: white;">${data.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8;">Phone:</td>
                    <td style="padding: 8px 0; color: white;">${data.phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8;">Referral Code:</td>
                    <td style="padding: 8px 0; color: #22c55e; font-weight: bold; font-family: monospace;">${referralCode}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #334155; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #fbbf24; font-size: 16px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Payout Information</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8; width: 140px;">Method:</td>
                    <td style="padding: 8px 0; color: white; text-transform: capitalize;">${data.payoutMethod}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8;">Handle/Email:</td>
                    <td style="padding: 8px 0; color: white;">${data.payoutHandle}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #334155; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #fbbf24; font-size: 16px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Identity Documents (KYC)</h2>
                
                <p style="color: #94a3b8; margin-bottom: 15px;">Click below to review uploaded identification documents:</p>
                
                <div>
                  <a href="${idFrontUrl}" target="_blank" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-right: 10px; margin-bottom: 10px;">📄 View ID Front</a>
                  <a href="${idBackUrl}" target="_blank" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">📄 View ID Back</a>
                </div>
              </div>
              
              <div style="background: #dc2626; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="color: white; margin: 0; font-weight: bold;">⚠️ Action Required: Please review this application in the Admin Panel → Sales Team tab to approve or reject.</p>
              </div>
              
              <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
                Submitted: ${new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </p>
            </div>
            
            <p style="color: #64748b; font-size: 11px; text-align: center; margin-top: 20px;">
              Clean Check Partner Program • Automated Notification
            </p>
          </div>
        `,
      });
      return emailResponse;
    });

    await Promise.all(emailPromises);
    console.log("Admin notification emails sent");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Application submitted successfully",
        referralCode,
        idFrontUrl,
        idBackUrl
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in submit-partner-application:", error);
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
