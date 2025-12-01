import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CampaignRequest {
  template_id: string;
  campaign_name: string;
  target_segment: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Verify admin role
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "administrator")
      .single();

    if (roleError || !roleData) {
      throw new Error("Unauthorized: Admin access required");
    }

    const { template_id, campaign_name, target_segment }: CampaignRequest = await req.json();

    console.log(`Starting campaign: ${campaign_name} for segment: ${target_segment}`);

    // Fetch the template
    const { data: template, error: templateError } = await supabase
      .from("marketing_templates")
      .select("*")
      .eq("id", template_id)
      .single();

    if (templateError || !template) {
      throw new Error("Template not found");
    }

    // Build query for target segment
    let query = supabase
      .from("profiles")
      .select("user_id, full_name, id");

    if (target_segment === "Unpaid Users") {
      query = query.or("payment_status.is.null,payment_status.eq.unpaid");
    } else if (target_segment === "Expired Members") {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      query = query.lt("payment_date", ninetyDaysAgo);
    } else if (target_segment === "Monthly Subscribers") {
      query = query.eq("payment_status", "paid");
    }

    const { data: profiles, error: profilesError } = await query;

    if (profilesError) {
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    if (!profiles || profiles.length === 0) {
      console.log("No recipients found for this segment");
      return new Response(
        JSON.stringify({ sent_count: 0, message: "No recipients found" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get email addresses for these users
    const userIds = profiles.map(p => p.user_id);
    const { data: authUsers, error: authError2 } = await supabase.auth.admin.listUsers();
    
    if (authError2) {
      throw new Error(`Failed to fetch user emails: ${authError2.message}`);
    }

    const emailMap = new Map(
      authUsers.users
        .filter(u => userIds.includes(u.id))
        .map(u => [u.id, u.email])
    );

    // Filter out users who already received this campaign
    const { data: previousSends } = await supabase
      .from("email_campaign_log")
      .select("user_id")
      .eq("campaign_name", campaign_name);

    const previousUserIds = new Set(previousSends?.map(s => s.user_id) || []);
    
    const recipientsToSend = profiles.filter(p => 
      !previousUserIds.has(p.user_id) && emailMap.has(p.user_id)
    );

    console.log(`Sending to ${recipientsToSend.length} recipients (filtered ${profiles.length - recipientsToSend.length} already sent)`);

    let sentCount = 0;

    // Send emails in batches
    for (const profile of recipientsToSend) {
      const email = emailMap.get(profile.user_id);
      if (!email) continue;

      const firstName = profile.full_name?.split(" ")[0] || "there";
      
      // Replace {{first_name}} placeholder
      const personalizedBody = template.body_content.replace(/\{\{first_name\}\}/g, firstName);

      try {
        await resend.emails.send({
          from: "Clean Check <onboarding@resend.dev>",
          to: [email],
          subject: template.subject_line,
          html: personalizedBody.replace(/\n/g, "<br>"),
        });

        // Log the send
        await supabase.from("email_campaign_log").insert({
          user_id: profile.user_id,
          campaign_name: campaign_name,
          template_id: template_id,
          email_address: email,
        });

        // Update profile tracking
        await supabase
          .from("profiles")
          .update({
            last_marketing_email_sent_at: new Date().toISOString(),
            last_campaign_received: campaign_name,
          })
          .eq("user_id", profile.user_id);

        sentCount++;
        console.log(`Sent to ${email}`);
      } catch (emailError: any) {
        console.error(`Failed to send to ${email}:`, emailError.message);
      }
    }

    console.log(`Campaign complete. Sent ${sentCount} emails.`);

    return new Response(
      JSON.stringify({ sent_count: sentCount }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-marketing-campaign:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
