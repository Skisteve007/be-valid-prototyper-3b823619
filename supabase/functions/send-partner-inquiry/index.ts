import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PartnerInquiryRequest {
  name: string;
  company: string;
  email: string;
  apiDocLink?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, company, email, apiDocLink, message }: PartnerInquiryRequest = await req.json();

    console.log("Partner inquiry received:", { name, company, email });

    const adminEmails = ["sgrillocce@gmail.com", "Office@bigtexasroof.com"];

    const emailHtml = `
      <h2>New Partner Inquiry from ${company}</h2>
      <p><strong>Contact Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${apiDocLink ? `<p><strong>API Documentation:</strong> <a href="${apiDocLink}">${apiDocLink}</a></p>` : ''}
      ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : ''}
      <hr />
      <p style="color: #666; font-size: 12px;">Received from Clean Check Partners page</p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Clean Check <onboarding@resend.dev>",
      to: adminEmails,
      replyTo: email,
      subject: `🤝 New Partner Inquiry: ${company}`,
      html: emailHtml,
    });

    console.log("Partner inquiry email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-partner-inquiry function:", error);
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
