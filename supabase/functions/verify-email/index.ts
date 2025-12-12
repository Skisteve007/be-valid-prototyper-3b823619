import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token }: VerifyRequest = await req.json();
    
    // Capture IP address and user agent for audit trail
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                      req.headers.get("x-real-ip") || 
                      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    
    console.log("Verifying token:", token, "from IP:", ipAddress);

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find the token
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from("email_verification_tokens")
      .select("*")
      .eq("token", token)
      .is("verified_at", null)
      .single();

    if (tokenError || !tokenData) {
      console.error("Token not found or already used:", tokenError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired verification link" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      console.error("Token expired");
      return new Response(
        JSON.stringify({ error: "Verification link has expired" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Mark token as used with IP and user agent for legal audit trail
    await supabaseAdmin
      .from("email_verification_tokens")
      .update({ 
        verified_at: new Date().toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .eq("id", tokenData.id);

    // Update profile to mark email as verified
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ email_verified: true })
      .eq("user_id", tokenData.user_id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      throw new Error("Failed to verify email");
    }

    console.log("Email verified successfully for user:", tokenData.user_id);

    return new Response(
      JSON.stringify({ success: true, message: "Email verified successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in verify-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
