import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { page_path, referrer, user_agent, session_id, device_type, browser, os } = await req.json();

    // Get client IP from headers
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     req.headers.get("x-real-ip") ||
                     "unknown";

    console.log("Tracking page view for IP:", clientIP);

    // Fetch geo data from ip-api.com (no API key needed, 45 requests/minute)
    let country = null;
    let city = null;
    let region = null;

    if (clientIP && clientIP !== "unknown" && clientIP !== "127.0.0.1") {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${clientIP}?fields=status,country,regionName,city`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          console.log("Geo data received:", geoData);
          if (geoData.status === "success") {
            country = geoData.country || null;
            city = geoData.city || null;
            region = geoData.regionName || null;
          }
        }
      } catch (geoError) {
        console.error("Geo lookup failed:", geoError);
      }
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Insert page view
    const { error } = await supabaseClient.from("page_views").insert({
      page_path,
      referrer,
      user_agent,
      session_id,
      device_type,
      browser,
      os,
      country,
      city,
      region,
    });

    if (error) {
      console.error("Database insert error:", error);
      throw error;
    }

    // Increment global visitor counter
    await supabaseClient.rpc("increment_global_stat", {
      stat_name: "total_visitors",
      increment_by: 1,
    });

    console.log("Page view tracked successfully:", { page_path, country, city, region });

    return new Response(JSON.stringify({ success: true, country, city, region }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Error tracking page view:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
