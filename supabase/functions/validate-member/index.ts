import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { memberId } = await req.json();
    console.log("Validating member:", memberId);

    if (!memberId) {
      console.log("No memberId provided");
      return new Response(
        JSON.stringify({ verified: false, error: "No member ID provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up profile by member_id
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, member_id, full_name, status_color, is_valid, validity_expires_at, idv_status, profile_image_url")
      .eq("member_id", memberId)
      .maybeSingle();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ verified: false, error: "Database error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (!profile) {
      console.log("Member not found:", memberId);
      return new Response(
        JSON.stringify({ verified: false, error: "Member not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Determine verification status based on profile data
    const isExpired = profile.validity_expires_at 
      ? new Date(profile.validity_expires_at) < new Date() 
      : false;
    
    const verified = profile.is_valid === true && !isExpired;

    console.log("Verification result:", { memberId, verified, status: profile.status_color });

    return new Response(
      JSON.stringify({
        verified,
        memberId: profile.member_id,
        displayName: profile.full_name ? profile.full_name.split(" ")[0] + " " + (profile.full_name.split(" ")[1]?.[0] || "") + "." : "Member",
        statusColor: profile.status_color || "gray",
        idvStatus: profile.idv_status,
        profileImage: profile.profile_image_url,
        isExpired,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error validating member:", error);
    return new Response(
      JSON.stringify({ verified: false, error: "Validation failed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
