import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role key to bypass RLS for token validation
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { token } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate token and check expiration
    const { data: tokenData, error: tokenError } = await supabase
      .from('qr_access_tokens')
      .select('id, profile_id, expires_at, used_at')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      console.error('Token validation error:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    if (now > expiresAt) {
      console.log('Token expired:', token);
      return new Response(
        JSON.stringify({ error: 'Token has expired' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark token as used (first time only)
    if (!tokenData.used_at) {
      await supabase
        .from('qr_access_tokens')
        .update({ used_at: now.toISOString() })
        .eq('id', tokenData.id);
    }

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        member_id,
        full_name,
        profile_image_url,
        qr_code_url,
        status_color,
        user_id,
        where_from,
        current_home_city,
        birthday,
        gender_identity,
        sexual_orientation,
        relationship_status,
        partner_preferences,
        covid_vaccinated,
        circumcised,
        smoker,
        instagram_handle,
        tiktok_handle,
        facebook_handle,
        onlyfans_handle,
        twitter_handle,
        sexual_preferences,
        std_acknowledgment,
        health_document_uploaded_at,
        selected_interests,
        user_interests,
        created_at
      `)
      .eq('id', tokenData.profile_id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Profile viewed with token for member:', profile.member_id);

    // If gray incognito mode, only return name and email for event scanning
    if (profile.status_color === 'gray') {
      // Fetch user email from auth.users
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.user_id);
      
      const limitedProfile = {
        id: profile.id,
        member_id: profile.member_id,
        full_name: profile.full_name,
        email: userData?.user?.email || null,
        status_color: profile.status_color,
      };

      console.log('Gray incognito mode - limited profile data returned for event scanning');

      // Record QR code view
      await supabase
        .from('qr_code_views')
        .insert({
          profile_id: profile.id,
          viewed_by_ip: req.headers.get('x-forwarded-for') || 'unknown'
        });

      return new Response(
        JSON.stringify({ 
          profile: limitedProfile,
          tokenExpiresAt: tokenData.expires_at,
          isIncognitoMode: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record QR code view
    await supabase
      .from('qr_code_views')
      .insert({
        profile_id: profile.id,
        viewed_by_ip: req.headers.get('x-forwarded-for') || 'unknown'
      });

    return new Response(
      JSON.stringify({ 
        profile,
        tokenExpiresAt: tokenData.expires_at
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in view-profile-with-token function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
