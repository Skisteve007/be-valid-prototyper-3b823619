import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let labPartner: any = null;
  let requestPayload: any = {};
  
  try {
    console.log("Receiving lab result webhook...");

    // Extract and validate API key from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await logWebhookEvent(supabase, {
        event_type: "result.received",
        payload: {},
        response_status: 401,
        error_message: "Missing or invalid Authorization header"
      });
      throw new Error("Missing or invalid Authorization header. Use: Authorization: Bearer YOUR_API_KEY");
    }

    const apiKey = authHeader.replace("Bearer ", "");

    // Validate API key against lab_partners table
    const { data: partner, error: authError } = await supabase
      .from("lab_partners")
      .select("*")
      .eq("api_key", apiKey)
      .eq("active", true)
      .single();

    if (authError || !partner) {
      console.error("Invalid or inactive API key");
      await logWebhookEvent(supabase, {
        event_type: "result.received",
        payload: {},
        response_status: 403,
        error_message: "Unauthorized: Invalid or inactive API key"
      });
      throw new Error("Unauthorized: Invalid or inactive API key");
    }

    labPartner = partner;
    console.log(`Authenticated lab partner: ${labPartner.name}`);

    // Update last_used_at timestamp
    await supabase
      .from("lab_partners")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", labPartner.id);

    requestPayload = await req.json();
    const { requisition_id, result, barcode } = requestPayload;

    if (!requisition_id && !barcode) {
      await logWebhookEvent(supabase, {
        event_type: "result.received",
        payload: requestPayload,
        response_status: 400,
        error_message: "Either requisition_id or barcode is required",
        lab_partner_id: labPartner.id
      });
      throw new Error("Either requisition_id or barcode is required");
    }

    if (!result || !["negative", "positive", "inconclusive", "sample_damaged"].includes(result.toLowerCase())) {
      await logWebhookEvent(supabase, {
        event_type: "result.received",
        payload: requestPayload,
        response_status: 400,
        error_message: "Invalid result value. Must be: negative, positive, inconclusive, or sample_damaged",
        lab_partner_id: labPartner.id
      });
      throw new Error("Invalid result value. Must be: negative, positive, inconclusive, or sample_damaged");
    }

    console.log(`Processing lab result for requisition: ${requisition_id || barcode}`);

    // Find the lab order by requisition_id or barcode
    const { data: labOrder, error: fetchError } = await supabase
      .from("lab_orders")
      .select("*, profiles(*)")
      .or(`lab_requisition_id.eq.${requisition_id || ""},barcode_value.eq.${barcode || ""}`)
      .single();

    if (fetchError || !labOrder) {
      console.error("Lab order not found:", fetchError);
      await logWebhookEvent(supabase, {
        event_type: "result.received",
        payload: requestPayload,
        response_status: 404,
        error_message: "Lab order not found",
        lab_partner_id: labPartner.id
      });
      throw new Error("Lab order not found");
    }

    console.log(`Found lab order: ${labOrder.id}`);

    // Handle exception cases (sample_damaged, inconclusive)
    if (["sample_damaged", "inconclusive"].includes(result.toLowerCase())) {
      const exceptionType = result.toLowerCase() === "sample_damaged" ? "sample_damaged" : "inconclusive_result";
      const exceptionReason = result.toLowerCase() === "sample_damaged" 
        ? "Lab reported sample was damaged or insufficient for testing"
        : "Lab result was inconclusive and requires retest";

      await supabase.from("exception_queue").insert({
        order_id: labOrder.id,
        user_id: labOrder.user_id,
        exception_type: exceptionType,
        exception_reason: exceptionReason,
        status: "notified",
        notified_at: new Date().toISOString()
      });

      console.log(`Exception created for ${exceptionType}`);
    }

    // PRIVACY FIREWALL: Update the lab order with result but set to LOCKED status
    // Do NOT automatically update user's profile - user must manually consent
    const { error: updateError } = await supabase
      .from("lab_orders")
      .update({
        result_status: result.toLowerCase(),
        order_status: "result_received_locked", // Privacy Firewall: Results locked until user reviews
      })
      .eq("id", labOrder.id);

    if (updateError) {
      console.error("Failed to update lab order:", updateError);
      await logWebhookEvent(supabase, {
        event_type: "result.received",
        payload: requestPayload,
        response_status: 500,
        error_message: updateError.message,
        lab_partner_id: labPartner.id,
        related_order_id: labOrder.id
      });
      throw updateError;
    }

    console.log("Lab order updated successfully with LOCKED status (Privacy Firewall active)");

    // PRIVACY FIREWALL: Do NOT auto-update profile status
    // User must manually review and consent to publish their status
    // The old auto-verification code has been removed for privacy protection

    // Log successful webhook event
    await logWebhookEvent(supabase, {
      event_type: "result.received",
      payload: requestPayload,
      response_status: 200,
      response_body: {
        success: true,
        message: "Lab result received and locked. User notification pending.",
        order_id: labOrder.id,
        result: result.toLowerCase(),
        privacy_status: "locked_pending_user_consent"
      },
      lab_partner_id: labPartner.id,
      related_order_id: labOrder.id
    });

    console.log(`PRIVACY FIREWALL: User ${labOrder.profiles?.full_name} has a new result awaiting review. Status: ${result}`);
    console.log("User must log in to review results and manually consent to profile verification.");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Lab result received and locked. User notification pending.",
        order_id: labOrder.id,
        result: result.toLowerCase(),
        privacy_status: "locked_pending_user_consent"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error processing lab result:", error);
    
    // Log failed webhook event
    if (labPartner) {
      await logWebhookEvent(supabase, {
        event_type: "result.received",
        payload: requestPayload,
        response_status: 400,
        error_message: error.message || "Unknown error",
        lab_partner_id: labPartner.id
      });
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Helper function to log webhook events
async function logWebhookEvent(
  supabase: any,
  event: {
    event_type: string;
    payload: any;
    response_status: number;
    response_body?: any;
    error_message?: string;
    lab_partner_id?: string;
    related_order_id?: string;
  }
) {
  try {
    await supabase.from("webhook_events").insert({
      event_type: event.event_type,
      payload: event.payload,
      response_status: event.response_status,
      response_body: event.response_body || null,
      error_message: event.error_message || null,
      lab_partner_id: event.lab_partner_id || null,
      related_order_id: event.related_order_id || null
    });
  } catch (error) {
    console.error("Failed to log webhook event:", error);
  }
}
