import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Get or create entitlement
    const { data: entitlement, error: entError } = await supabaseClient
      .rpc('get_or_create_synth_entitlement', { p_user_id: userId });

    if (entError) {
      console.error('[SYNTH-CHECK] Entitlement error:', entError);
      throw new Error('Failed to check entitlement');
    }

    // Get user profile for codename
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('synth_codename, synth_display_name, synth_intake_completed_at')
      .eq('user_id', userId)
      .single();

    return new Response(
      JSON.stringify({
        entitlement: entitlement ? {
          id: entitlement.id,
          plan: entitlement.plan,
          expires_at: entitlement.expires_at,
          runs_remaining: entitlement.runs_remaining,
          is_active: entitlement.is_active
        } : null,
        profile: {
          codename: profile?.synth_codename,
          display_name: profile?.synth_display_name,
          intake_completed: !!profile?.synth_intake_completed_at
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SYNTH-CHECK] Error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
