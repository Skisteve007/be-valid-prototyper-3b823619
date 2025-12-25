import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, profileId } = await req.json();

    // Validate input
    if (!token || !profileId) {
      console.log("[verify-qr-token] Missing required fields:", { token: !!token, profileId: !!profileId });
      return new Response(
        JSON.stringify({ 
          result: "INVALID", 
          reason: "Missing token or profileId" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[verify-qr-token] Verifying token for profile:", profileId);

    // Create Supabase client with service role for backend access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up the QR token
    const { data: tokenRecord, error: tokenError } = await supabase
      .from("qr_access_tokens")
      .select("id, profile_id, token, expires_at, used_at, created_at")
      .eq("token", token)
      .eq("profile_id", profileId)
      .maybeSingle();

    if (tokenError) {
      console.error("[verify-qr-token] Database error:", tokenError);
      return new Response(
        JSON.stringify({ result: "ERROR", reason: "Database lookup failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Token not found
    if (!tokenRecord) {
      console.log("[verify-qr-token] Token not found");
      return new Response(
        JSON.stringify({ result: "INVALID", reason: "Token not found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check expiration
    const now = new Date();
    const expiresAt = new Date(tokenRecord.expires_at);
    
    if (expiresAt < now) {
      console.log("[verify-qr-token] Token expired at:", expiresAt.toISOString());
      return new Response(
        JSON.stringify({ 
          result: "EXPIRED", 
          reason: "Token has expired",
          expired_at: tokenRecord.expires_at
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Token is valid - fetch profile status badges
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, status_color, status_expiry, lab_certified, idv_verified, member_id")
      .eq("id", profileId)
      .maybeSingle();

    if (profileError) {
      console.error("[verify-qr-token] Profile lookup error:", profileError);
      return new Response(
        JSON.stringify({ result: "ERROR", reason: "Profile lookup failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!profile) {
      console.log("[verify-qr-token] Profile not found for id:", profileId);
      return new Response(
        JSON.stringify({ result: "INVALID", reason: "Profile not found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark token as used (optional tracking)
    await supabase
      .from("qr_access_tokens")
      .update({ used_at: now.toISOString() })
      .eq("id", tokenRecord.id);

    // Build status badges
    const statusBadges = {
      idv_verified: profile.idv_verified === true,
      lab_certified: profile.lab_certified === true,
      status_color: profile.status_color || "grey",
      status_valid: profile.status_expiry ? new Date(profile.status_expiry) > now : false,
    };

    console.log("[verify-qr-token] ALLOW - Profile:", profile.member_id, "Badges:", statusBadges);

    return new Response(
      JSON.stringify({
        result: "ALLOW",
        profile: {
          member_id: profile.member_id,
          display_name: profile.full_name?.split(" ")[0] || "Member", // First name only for privacy
        },
        badges: statusBadges,
        token_expires_at: tokenRecord.expires_at,
        verified_at: now.toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[verify-qr-token] Unexpected error:", error);
    return new Response(
      JSON.stringify({ result: "ERROR", reason: "Unexpected server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
