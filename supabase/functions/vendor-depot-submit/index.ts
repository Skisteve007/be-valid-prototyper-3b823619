import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VendorDepotRequest {
  submissionId: string;
  vendorName: string;
  vendorEmail: string;
  vendorId: string;
  serviceType: string;
  notes: string;
  files: Array<{ name: string; type: string; size: string }>;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: VendorDepotRequest = await req.json();

    console.log("Vendor Depot submission received:", {
      submissionId: data.submissionId,
      vendorName: data.vendorName,
      serviceType: data.serviceType,
      fileCount: data.files.length,
    });

    const filesList = data.files
      .map((f) => `<li>${f.name} (${f.type}, ${f.size})</li>`)
      .join("");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">
          📁 Vendor Depot Submission
        </h1>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #334155;">Submission Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Submission ID:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">${data.submissionId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;"><strong>Timestamp:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">${data.timestamp}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;"><strong>Vendor Name:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">${data.vendorName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;"><strong>Vendor Email:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;"><a href="mailto:${data.vendorEmail}">${data.vendorEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;"><strong>Vendor ID:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">${data.vendorId}</td>
            </tr>
          </table>
        </div>

        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin-top: 0; color: #065f46;">Service Requested</h3>
          <p style="color: #1e293b; font-size: 18px; font-weight: bold; margin: 0;">${data.serviceType}</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #334155;">Files Attached (${data.files.length})</h3>
          <ul style="color: #1e293b; padding-left: 20px;">
            ${filesList || "<li>No files attached</li>"}
          </ul>
        </div>

        ${data.notes !== "None" ? `
        <div style="background: #fefce8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #eab308;">
          <h3 style="margin-top: 0; color: #854d0e;">Additional Notes</h3>
          <p style="color: #1e293b; margin: 0;">${data.notes}</p>
        </div>
        ` : ""}

        <div style="background: #0ea5e9; color: white; padding: 15px 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-weight: bold;">⚡ ACTION REQUIRED</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Process this submission and return results within 20 minutes</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          Vendor Depot Submission — Valid™ SYNTH Pre-Demo Pipeline<br />
          Reply directly to vendor: <a href="mailto:${data.vendorEmail}">${data.vendorEmail}</a>
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Valid™ SYNTH <onboarding@resend.dev>",
      to: ["steve@bvalid.app"],
      replyTo: data.vendorEmail,
      subject: `📁 Vendor Depot: ${data.serviceType} from ${data.vendorName} [${data.submissionId}]`,
      html: emailHtml,
    });

    console.log("Vendor Depot email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, submissionId: data.submissionId }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in vendor-depot-submit function:", error);
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
