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

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Receiving lab result webhook...");

    const { requisition_id, result, barcode } = await req.json();

    if (!requisition_id && !barcode) {
      throw new Error("Either requisition_id or barcode is required");
    }

    if (!result || !["negative", "positive", "inconclusive"].includes(result.toLowerCase())) {
      throw new Error("Invalid result value. Must be: negative, positive, or inconclusive");
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
      throw new Error("Lab order not found");
    }

    console.log(`Found lab order: ${labOrder.id}`);

    // Update the lab order with result
    const { error: updateError } = await supabase
      .from("lab_orders")
      .update({
        result_status: result.toLowerCase(),
        order_status: "result_received",
      })
      .eq("id", labOrder.id);

    if (updateError) {
      console.error("Failed to update lab order:", updateError);
      throw updateError;
    }

    console.log("Lab order updated successfully");

    // If result is negative, update user's profile status to verified
    if (result.toLowerCase() === "negative") {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          status_color: "green",
        })
        .eq("user_id", labOrder.user_id);

      if (profileError) {
        console.error("Failed to update profile:", profileError);
        // Don't throw here, lab result was still recorded
      } else {
        console.log("Profile status updated to verified");
      }
    }

    // TODO: Send notification to user (email/SMS)
    console.log(`User ${labOrder.profiles?.full_name} should be notified of result: ${result}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Lab result processed successfully",
        order_id: labOrder.id,
        result: result.toLowerCase(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error processing lab result:", error);
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
