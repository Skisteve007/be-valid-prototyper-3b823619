import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * CHAD 5.2 SPEC: Ghost Token Revoke
 * 
 * Revokes a ghost_ref/jti. Can be called by:
 * 1) User (revoking their own tokens)
 * 2) Admin (revoking any token)
 * 3) System (automatic revocation on security event)
 */

interface RevokeRequest {
  ghost_ref: string;
  reason?: string;
}

function logStep(step: string, details?: unknown) {
  console.log(`[ghost-revoke] ${step}`, details ? JSON.stringify(details) : '');
}

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
      logStep('Auth failed', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { ghost_ref, reason = 'user_requested' }: RevokeRequest = await req.json();
    logStep('Revoke request', { ghost_ref, reason, user_id: user.id });

    if (!ghost_ref) {
      return new Response(
        JSON.stringify({ error: 'ghost_ref is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the token
    const { data: token, error: tokenError } = await supabase
      .from('ghost_tokens')
      .select('id, user_id, jti, revoked_at')
      .eq('jti', ghost_ref)
      .single();

    if (tokenError || !token) {
      logStep('Token not found', tokenError);
      return new Response(
        JSON.stringify({ error: 'Token not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user owns this token (or is admin)
    if (token.user_id !== user.id) {
      // Check if user is admin
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'administrator');

      if (!roles || roles.length === 0) {
        logStep('Unauthorized - not owner or admin');
        return new Response(
          JSON.stringify({ error: 'Unauthorized to revoke this token' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check if already revoked
    if (token.revoked_at) {
      logStep('Token already revoked');
      return new Response(
        JSON.stringify({ revoked: true, message: 'Token was already revoked' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Revoke the token
    const { error: updateError } = await supabase
      .from('ghost_tokens')
      .update({
        revoked_at: new Date().toISOString(),
        revocation_reason: reason,
      })
      .eq('jti', ghost_ref);

    if (updateError) {
      logStep('Revocation failed', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to revoke token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the revoke event
    await supabase.from('ghost_token_events').insert({
      jti: ghost_ref,
      event_type: 'revoked',
      actor_type: token.user_id === user.id ? 'user' : 'admin',
      actor_id: user.id,
      metadata: { reason },
    });

    logStep('Token revoked successfully', { jti: ghost_ref });

    return new Response(
      JSON.stringify({ revoked: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    logStep('Error', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
