import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * CHAD 5.2 SPEC: Ghost Token Mint
 * 
 * Creates a short-lived, opaque ghost_ref that encodes NO claims/PII.
 * The ghost_ref is bound to:
 * - user_id
 * - purpose: 'profile_share' | 'venue_admission' | 'venue_pass'
 * - selected share profile
 * - allowed signal categories (derived from locks)
 * - exp (short TTL) + revocation status
 */

type Purpose = 'profile_share' | 'venue_admission' | 'venue_pass';
type ShareProfile = 'public' | 'minimal' | 'custom' | 'nothing';

interface MintRequest {
  purpose: Purpose;
  ttl_hours?: number; // default 24
  venue_id?: string; // for venue_admission/venue_pass
}

function logStep(step: string, details?: unknown) {
  console.log(`[ghost-token-mint] ${step}`, details ? JSON.stringify(details) : '');
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

    const { purpose, ttl_hours = 24, venue_id }: MintRequest = await req.json();
    logStep('Mint request', { purpose, ttl_hours, venue_id, user_id: user.id });

    // Validate purpose
    if (!['profile_share', 'venue_admission', 'venue_pass'].includes(purpose)) {
      return new Response(
        JSON.stringify({ error: 'Invalid purpose' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's share policy
    const { data: policy } = await supabase
      .from('user_share_policies')
      .select('active_profile')
      .eq('user_id', user.id)
      .single();

    const shareProfile: ShareProfile = policy?.active_profile || 'nothing';
    logStep('Share profile', { shareProfile });

    // Get allowed claims based on share policy
    const { data: allowedClaims } = await supabase
      .rpc('get_ghost_allowed_claims', { p_user_id: user.id });

    const claims: string[] = allowedClaims || [];
    logStep('Allowed claims', { claims });

    // Generate opaque subject hash (privacy-preserving)
    const salt = crypto.randomUUID();
    const encoder = new TextEncoder();
    const data = encoder.encode(user.id + salt + Date.now());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const subjectHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Generate unique JTI (token identifier for revocation)
    const jti = crypto.randomUUID();

    // Calculate expiration
    const issuedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + ttl_hours);

    // Store ghost token
    const { data: token, error: tokenError } = await supabase
      .from('ghost_tokens')
      .insert({
        jti,
        user_id: user.id,
        subject_hash: subjectHash.substring(0, 64),
        audience: purpose,
        share_profile: shareProfile,
        allowed_claims: claims,
        issued_at: issuedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (tokenError) {
      logStep('Token insert failed', tokenError);
      return new Response(
        JSON.stringify({ error: 'Failed to mint token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the mint event (no PII)
    await supabase.from('ghost_token_events').insert({
      jti,
      event_type: 'minted',
      profile_used: shareProfile,
      allowed_claims: claims,
      purpose,
      metadata: { venue_id, ttl_hours },
    });

    logStep('Token minted successfully', { jti });

    // Return ONLY the opaque ghost_ref (jti)
    // QR payload contains ONLY this reference - NO claims, NO PII
    return new Response(
      JSON.stringify({
        ghost_ref: jti,
        expires_at: expiresAt.toISOString(),
        purpose,
        // For QR generation - this is the ONLY data that goes in the QR
        qr_payload: `valid://ghost/${jti}`,
      }),
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
