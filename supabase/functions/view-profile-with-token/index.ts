import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Parse bundle flags from incognito token
// Format: INCOG_{flags}_{token}
// Flags: I = ID included, P = Payment authorized, S = Status only
function parseBundleFlags(token: string): { includeId: boolean; includePayment: boolean } {
  const flags = { includeId: false, includePayment: false };
  
  if (!token.startsWith('INCOG_')) return flags;
  
  const parts = token.split('_');
  if (parts.length >= 3) {
    const flagStr = parts[1];
    flags.includeId = flagStr.includes('I');
    flags.includePayment = flagStr.includes('P');
  }
  
  return flags;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
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
        JSON.stringify({ error: 'This QR code has expired. Please request a new one.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if this is an incognito token and parse bundle flags
    const isIncognitoToken = token.startsWith('INCOG_');
    const bundleFlags = parseBundleFlags(token);
    
    // Incognito tokens get full 24-hour window with NO anxiety timer
    const VIEW_WINDOW_MINUTES = isIncognitoToken ? (24 * 60) : 3;
    let viewExpiresAt: Date;
    
    if (tokenData.used_at) {
      const usedAt = new Date(tokenData.used_at);
      viewExpiresAt = new Date(usedAt.getTime() + VIEW_WINDOW_MINUTES * 60 * 1000);
      
      if (now > viewExpiresAt) {
        console.log('View window expired for token:', token);
        return new Response(
          JSON.stringify({ error: 'Viewing time has expired. This profile can no longer be accessed.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      await supabase
        .from('qr_access_tokens')
        .update({ used_at: now.toISOString() })
        .eq('id', tokenData.id);
      
      viewExpiresAt = new Date(now.getTime() + VIEW_WINDOW_MINUTES * 60 * 1000);
    }

    // Fetch profile data
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

    const isIncognitoMode = isIncognitoToken || profile.status_color === 'gray';

    // Record QR code view
    await supabase
      .from('qr_code_views')
      .insert({
        profile_id: profile.id,
        viewed_by_ip: req.headers.get('x-forwarded-for') || 'unknown'
      });

    // INCOGNITO MODE: Master Access Token response
    if (isIncognitoMode) {
      const { data: userData } = await supabase.auth.admin.getUserById(profile.user_id);
      
      // Base limited profile for incognito
      const incognitoProfile: any = {
        id: profile.id,
        member_id: profile.member_id,
        full_name: profile.full_name,
        email: userData?.user?.email || null,
        status_color: 'gray',
        profile_image_url: profile.profile_image_url,
        compliance_verified: profile.status_color === 'green' || profile.status_color === 'gray',
      };

      // If ID bundle flag is set, include ID verification data
      if (bundleFlags.includeId) {
        const { data: idDocs } = await supabase
          .from('certifications')
          .select('id, title, document_url, expiry_date, issuer')
          .eq('user_id', profile.user_id)
          .or('title.ilike.%ID%,title.ilike.%License%,title.ilike.%Passport%,title.ilike.%Driver%')
          .order('created_at', { ascending: false })
          .limit(1);

        if (idDocs && idDocs.length > 0) {
          incognitoProfile.id_verification = {
            type: idDocs[0].title,
            document_url: idDocs[0].document_url,
            expiry_date: idDocs[0].expiry_date,
            issuer: idDocs[0].issuer,
            verified: true
          };
        }
        console.log('ID verification data included in response');
      }

      // If Payment bundle flag is set, include payment authorization data
      if (bundleFlags.includePayment) {
        const { data: paymentMethod } = await supabase
          .from('user_payment_methods')
          .select('payment_type, payment_identifier')
          .eq('user_id', profile.user_id)
          .eq('is_default', true)
          .single();

        if (paymentMethod) {
          incognitoProfile.payment_authorized = {
            type: paymentMethod.payment_type,
            // Only show last 4 chars for security
            identifier: paymentMethod.payment_identifier.slice(-4),
            bar_tab_enabled: true
          };
        }
        console.log('Payment authorization data included in response');
      }

      console.log('Incognito Master Token response - bundle flags:', bundleFlags);

      return new Response(
        JSON.stringify({ 
          profile: incognitoProfile,
          tokenExpiresAt: tokenData.expires_at,
          viewExpiresAt: viewExpiresAt.toISOString(),
          isIncognitoMode: true,
          bundleFlags: bundleFlags
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STANDARD MODE: Dynamic Profile Bundle response
    // Base profile data always shared
    const sharedProfile: any = {
      id: profile.id,
      member_id: profile.member_id,
      full_name: profile.full_name,
      profile_image_url: profile.profile_image_url,
      status_color: profile.status_color,
      birthday: profile.birthday,
      where_from: profile.where_from,
      current_home_city: profile.current_home_city,
      relationship_status: profile.relationship_status,
      gender_identity: profile.gender_identity,
      partner_preferences: profile.partner_preferences,
      covid_vaccinated: profile.covid_vaccinated,
      circumcised: profile.circumcised,
      smoker: profile.smoker,
      health_document_uploaded_at: profile.health_document_uploaded_at,
      created_at: profile.created_at,
    };

    // --- DYNAMIC CONTENT BUNDLE (Based on Member's Profile Toggles) ---
    
    // 1. ID Verification Status (always shared in standard mode)
    const { data: idDocs } = await supabase
      .from('certifications')
      .select('title')
      .eq('user_id', profile.user_id)
      .or('title.ilike.%ID%,title.ilike.%License%,title.ilike.%Passport%,title.ilike.%Driver%')
      .limit(1);
    
    sharedProfile.id_status = idDocs && idDocs.length > 0 
      ? `${idDocs[0].title} Verified` 
      : "Unverified";

    // 2. Interests & Preferences (if enabled)
    if (profile.sharing_interests_enabled === true) {
      sharedProfile.user_interests = profile.user_interests;
      sharedProfile.selected_interests = profile.selected_interests;
      sharedProfile.sexual_preferences = profile.sexual_preferences;
      console.log('Sharing interests enabled - data included');
    }

    // 3. Vices / Lifestyle (if enabled)
    if (profile.sharing_vices_enabled === true) {
      sharedProfile.vices = profile.vices;
      console.log('Sharing vices enabled - data included');
    }

    // 4. Sexual Orientation (if enabled)
    if (profile.sharing_orientation_enabled === true) {
      sharedProfile.sexual_orientation = profile.sexual_orientation;
      console.log('Sharing orientation enabled - data included');
    }

    // 5. Social Media Handles (locked by default - must be explicitly enabled)
    if (profile.sharing_social_enabled === true) {
      sharedProfile.social_media = {
        instagram: profile.instagram_handle,
        tiktok: profile.tiktok_handle,
        facebook: profile.facebook_handle,
        onlyfans: profile.onlyfans_handle,
        twitter: profile.twitter_handle,
      };
      console.log('Sharing social media enabled - data included');
    } else {
      sharedProfile.social_media = "Locked by User";
    }

    // Email sharing (existing logic)
    if (profile.email_shareable === true) {
      const { data: userData } = await supabase.auth.admin.getUserById(profile.user_id);
      sharedProfile.email = userData?.user?.email || null;
    }

    // STD Acknowledgment (existing logic)
    if (profile.std_acknowledgment_locked === false) {
      sharedProfile.std_acknowledgment = profile.std_acknowledgment;
    }

    // References (existing logic)
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

    // Documents
    const { data: documents } = await supabase
      .from('certifications')
      .select('id, title, issue_date, expiry_date, issuer, status, document_url, created_at')
      .eq('user_id', profile.user_id)
      .order('created_at', { ascending: false });

    sharedProfile.documents = documents || [];

    console.log('Dynamic Profile Bundle shared with toggles:', {
      interests: profile.sharing_interests_enabled,
      vices: profile.sharing_vices_enabled,
      orientation: profile.sharing_orientation_enabled,
      social: profile.sharing_social_enabled
    });

    return new Response(
      JSON.stringify({ 
        profile: sharedProfile,
        tokenExpiresAt: tokenData.expires_at,
        viewExpiresAt: viewExpiresAt.toISOString(),
        privacySettings: {
          emailShared: profile.email_shareable === true,
          referencesShared: profile.references_locked === false,
          stdAcknowledgmentShared: profile.std_acknowledgment_locked === false,
          interestsShared: profile.sharing_interests_enabled === true,
          vicesShared: profile.sharing_vices_enabled === true,
          orientationShared: profile.sharing_orientation_enabled === true,
          socialShared: profile.sharing_social_enabled === true,
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
