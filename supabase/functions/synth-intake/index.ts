import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IntakeData {
  display_name?: string;
  age_range?: string;
  primary_goal?: string;
  domain_interest?: string;
  consent_scoring: boolean;
  consent_analytics?: boolean;
  leaderboard_visibility?: string;
  country?: string;
  state?: string;
  city?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error('Invalid authentication');
    }

    const userId = userData.user.id;
    const body: IntakeData = await req.json();

    // Validate consent
    if (!body.consent_scoring) {
      throw new Error('Consent for scoring is required');
    }

    // Generate codename
    const { data: codename } = await supabaseClient
      .rpc('generate_synth_codename', { p_tier: 'Initiate' });

    // Update profile
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        synth_codename: codename,
        synth_display_name: body.display_name || null,
        synth_age_range: body.age_range || null,
        synth_primary_goal: body.primary_goal || null,
        synth_domain_interest: body.domain_interest || null,
        synth_consent_scoring: true,
        synth_consent_analytics: body.consent_analytics || false,
        synth_leaderboard_visibility: body.leaderboard_visibility || 'anonymous',
        synth_intake_completed_at: new Date().toISOString(),
        synth_accepted_at: new Date().toISOString(),
        // Location fields if they exist
        ...(body.city && { current_home_city: body.city })
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('[SYNTH-INTAKE] Update error:', updateError);
      throw new Error('Failed to save intake data');
    }

    // Create trial entitlement
    const { data: entitlement } = await supabaseClient
      .rpc('get_or_create_synth_entitlement', { p_user_id: userId });

    console.log('[SYNTH-INTAKE] Intake complete for user:', userId, 'Codename:', codename);

    return new Response(
      JSON.stringify({
        success: true,
        codename,
        message: 'Welcome, Initiate. Your SYNTH Index will be calibrated over the next 24 hours.',
        trial: {
          runs: entitlement?.runs_remaining || 10,
          expires_at: entitlement?.expires_at
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SYNTH-INTAKE] Error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
