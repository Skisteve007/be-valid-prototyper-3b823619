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

    // Fetch complete profile data with lock states
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
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
      const { data: userData } = await supabase.auth.admin.getUserById(profile.user_id);
      
      const limitedProfile = {
        id: profile.id,
        member_id: profile.member_id,
        full_name: profile.full_name,
        email: userData?.user?.email || null,
        status_color: profile.status_color,
        profile_image_url: profile.profile_image_url,
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

    // Build response with all non-locked data
    const sharedProfile: any = {
      id: profile.id,
      member_id: profile.member_id,
      full_name: profile.full_name,
      profile_image_url: profile.profile_image_url,
      status_color: profile.status_color,
      gender_identity: profile.gender_identity,
      sexual_orientation: profile.sexual_orientation,
      relationship_status: profile.relationship_status,
      birthday: profile.birthday,
      where_from: profile.where_from,
      current_home_city: profile.current_home_city,
      partner_preferences: profile.partner_preferences,
      covid_vaccinated: profile.covid_vaccinated,
      circumcised: profile.circumcised,
      smoker: profile.smoker,
      selected_interests: profile.selected_interests,
      user_interests: profile.user_interests,
      sexual_preferences: profile.sexual_preferences,
      health_document_uploaded_at: profile.health_document_uploaded_at,
      instagram_handle: profile.instagram_handle,
      tiktok_handle: profile.tiktok_handle,
      facebook_handle: profile.facebook_handle,
      onlyfans_handle: profile.onlyfans_handle,
      twitter_handle: profile.twitter_handle,
      created_at: profile.created_at,
    };

    // Only include email if shareable
    if (profile.email_shareable === true) {
      const { data: userData } = await supabase.auth.admin.getUserById(profile.user_id);
      sharedProfile.email = userData?.user?.email || null;
    }

    // Only include STD acknowledgment if not locked
    if (profile.std_acknowledgment_locked === false) {
      sharedProfile.std_acknowledgment = profile.std_acknowledgment;
    }

    // Fetch and include references if not locked
    if (profile.references_locked === false) {
      const { data: references } = await supabase
        .from('member_references')
        .select(`
          id,
          verified,
          created_at,
          referee:profiles!member_references_referee_user_id_fkey(
            member_id,
            full_name,
            profile_image_url
          )
        `)
        .eq('referrer_user_id', profile.user_id)
        .eq('verified', true);

      sharedProfile.references = references || [];
    }

    // Fetch uploaded documents/certifications with document URLs
    const { data: documents } = await supabase
      .from('certifications')
      .select('id, title, issue_date, expiry_date, issuer, status, document_url, created_at')
      .eq('user_id', profile.user_id)
      .order('created_at', { ascending: false });

    sharedProfile.documents = documents || [];

    // Record QR code view
    await supabase
      .from('qr_code_views')
      .insert({
        profile_id: profile.id,
        viewed_by_ip: req.headers.get('x-forwarded-for') || 'unknown'
      });

    console.log('Complete profile data shared (respecting privacy locks)');

    return new Response(
      JSON.stringify({ 
        profile: sharedProfile,
        tokenExpiresAt: tokenData.expires_at,
        privacySettings: {
          emailShared: profile.email_shareable === true,
          referencesShared: profile.references_locked === false,
          stdAcknowledgmentShared: profile.std_acknowledgment_locked === false,
        }
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
