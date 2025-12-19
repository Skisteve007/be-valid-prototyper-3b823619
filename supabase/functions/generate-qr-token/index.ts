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
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { profileId } = await req.json();

    // Verify user owns this profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile verification error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Profile not found or unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a secure random token (Ghostware™ format)
    const token = crypto.randomUUID();
    
    // Token expires in 60 seconds (Ghostware™ evaporation)
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 60);

    // Create token record
    const { data: tokenData, error: tokenError } = await supabase
      .from('qr_access_tokens')
      .insert({
        profile_id: profileId,
        token: token,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (tokenError) {
      console.error('Token creation error:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Failed to create access token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('QR token generated successfully for profile:', profileId);

    return new Response(
      JSON.stringify({ 
        token: tokenData.token,
        expiresAt: tokenData.expires_at,
        profileId: tokenData.profile_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-qr-token function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
