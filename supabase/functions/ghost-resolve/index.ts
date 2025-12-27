import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * CHAD 5.2 SPEC: Ghost Token Resolve
 * 
 * Partner/scanner calls this endpoint with a ghost_ref.
 * We:
 * 1) Validate ghost_ref (exp + revoked + purpose)
 * 2) Load user Share Policy (locks + chosen profile)
 * 3) Request needed signals from originators/vendors (licensed connectors)
 * 4) Return a "Signal Pack" (generalized outputs only)
 * 
 * NO PII is ever returned. Only generalized signals (booleans/tiers/bands/tags).
 */

type Grade = 'green' | 'yellow' | 'red';
type SignalSource = 'user' | 'verified_partner' | 'multi_partner';
type SignalStrength = 'low' | 'standard' | 'high';
type SignalFreshness = 'live' | 'recent' | 'stale';

interface SignalMetadata {
  signal_source: SignalSource;
  signal_strength: SignalStrength;
  signal_freshness: SignalFreshness;
}

interface SignalPack {
  // Door/Venue Human View (primary)
  grade: Grade;
  message: string;
  
  // Machine View (partner backend + admin)
  signals: Record<string, unknown>;
  signal_metadata: Record<string, SignalMetadata>;
  
  // Token info
  purpose: string;
  expires_at: string;
}

interface ResolveRequest {
  ghost_ref: string;
  partner_id?: string; // for audit logging
}

function logStep(step: string, details?: unknown) {
  console.log(`[ghost-resolve] ${step}`, details ? JSON.stringify(details) : '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Use service role for resolving tokens (partner endpoint)
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { ghost_ref, partner_id }: ResolveRequest = await req.json();
    logStep('Resolve request', { ghost_ref, partner_id });

    if (!ghost_ref) {
      return new Response(
        JSON.stringify({ error: 'ghost_ref is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1) Validate ghost_ref (jti)
    const { data: token, error: tokenError } = await supabase
      .from('ghost_tokens')
      .select('*')
      .eq('jti', ghost_ref)
      .single();

    if (tokenError || !token) {
      logStep('Token not found', tokenError);
      return new Response(
        JSON.stringify({ 
          grade: 'red', 
          message: 'Token not found.',
          signals: {},
          signal_metadata: {}
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check expiration
    if (new Date(token.expires_at) < new Date()) {
      logStep('Token expired');
      await supabase.from('ghost_token_events').insert({
        jti: ghost_ref,
        event_type: 'resolve_failed',
        metadata: { reason: 'expired', partner_id },
      });
      return new Response(
        JSON.stringify({ 
          grade: 'red', 
          message: 'Token expired.',
          signals: {},
          signal_metadata: {}
        }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check revocation
    if (token.revoked_at) {
      logStep('Token revoked');
      await supabase.from('ghost_token_events').insert({
        jti: ghost_ref,
        event_type: 'resolve_failed',
        metadata: { reason: 'revoked', partner_id },
      });
      return new Response(
        JSON.stringify({ 
          grade: 'red', 
          message: 'Token revoked.',
          signals: {},
          signal_metadata: {}
        }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2) Load user Share Policy
    const shareProfile = token.share_profile;
    const allowedClaims: string[] = token.allowed_claims || [];
    logStep('Share policy', { shareProfile, allowedClaims });

    // Share Nothing => return restricted stub
    if (shareProfile === 'nothing' || allowedClaims.length === 0) {
      logStep('Share Nothing profile - returning stub');
      await supabase.from('ghost_token_events').insert({
        jti: ghost_ref,
        event_type: 'resolved',
        profile_used: shareProfile,
        allowed_claims: [],
        metadata: { partner_id, result: 'stub' },
      });
      return new Response(
        JSON.stringify({
          grade: 'yellow',
          message: 'User shared limited info.',
          signals: { profile_present: true },
          signal_metadata: {
            profile_present: { signal_source: 'user', signal_strength: 'low', signal_freshness: 'live' }
          },
          purpose: token.audience,
          expires_at: token.expires_at,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3) Gather signals from user data (respecting locks)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', token.user_id)
      .single();

    const { data: wallet } = await supabase
      .from('user_wallets')
      .select('balance')
      .eq('user_id', token.user_id)
      .single();

    const { data: idv } = await supabase
      .from('idv_verifications')
      .select('status, tier, verified_at')
      .eq('user_id', token.user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Build signals based on allowed claims
    const signals: Record<string, unknown> = {};
    const signalMetadata: Record<string, SignalMetadata> = {};

    // PROFILE tab signals
    if (allowedClaims.includes('profile_visible')) {
      signals.profile_present = !!profile;
      signalMetadata.profile_present = { signal_source: 'user', signal_strength: 'standard', signal_freshness: 'live' };
      
      // Determine basic_profile_level
      const hasBasic = profile?.full_name;
      const hasComplete = hasBasic && profile?.birthday && profile?.current_home_city;
      signals.basic_profile_level = hasComplete ? 'complete' : hasBasic ? 'basic' : 'empty';
      signalMetadata.basic_profile_level = { signal_source: 'user', signal_strength: 'standard', signal_freshness: 'live' };

      // Vibe tags (from user_interests)
      if (profile?.user_interests) {
        const interests = Object.values(profile.user_interests).flat().slice(0, 5);
        signals.vibe_tags = interests;
        signalMetadata.vibe_tags = { signal_source: 'user', signal_strength: 'low', signal_freshness: 'live' };
      }
    }

    // ID tab signals
    if (allowedClaims.includes('age_verified') || allowedClaims.includes('idv_status')) {
      const isVerified = idv?.status === 'verified';
      signals.age_verified = isVerified;
      signals.id_verified = isVerified;
      signalMetadata.age_verified = { signal_source: 'verified_partner', signal_strength: 'high', signal_freshness: isVerified ? 'recent' : 'stale' };
      signalMetadata.id_verified = { signal_source: 'verified_partner', signal_strength: 'high', signal_freshness: isVerified ? 'recent' : 'stale' };

      // IDV tier
      signals.idv_tier = idv?.tier || 'none';
      signalMetadata.idv_tier = { signal_source: 'verified_partner', signal_strength: 'high', signal_freshness: 'recent' };

      // Member since band
      const memberSince = profile?.created_at ? new Date(profile.created_at) : null;
      const monthsAsMember = memberSince ? Math.floor((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0;
      signals.member_since_band = monthsAsMember > 12 ? 'veteran' : monthsAsMember > 3 ? 'established' : 'new';
      signalMetadata.member_since_band = { signal_source: 'user', signal_strength: 'standard', signal_freshness: 'live' };
    }

    // FUNDS tab signals
    if (allowedClaims.includes('wallet_active')) {
      const balance = wallet?.balance || 0;
      signals.wallet_tier = balance > 200 ? 'supercharged' : balance > 0 ? 'funded' : 'none';
      signalMetadata.wallet_tier = { signal_source: 'user', signal_strength: 'standard', signal_freshness: 'live' };

      // Balance band (never exact amount)
      signals.balance_band = balance === 0 ? '0' : balance <= 50 ? '1-50' : balance <= 200 ? '50-200' : '200+';
      signalMetadata.balance_band = { signal_source: 'user', signal_strength: 'standard', signal_freshness: 'live' };

      signals.pass_eligible = balance > 0;
      signalMetadata.pass_eligible = { signal_source: 'user', signal_strength: 'standard', signal_freshness: 'live' };
    }

    // BIO tab signals
    if (allowedClaims.includes('bio_summary')) {
      signals.bio_present = !!profile?.where_from || !!profile?.current_home_city;
      signalMetadata.bio_present = { signal_source: 'user', signal_strength: 'low', signal_freshness: 'live' };

      if (profile?.user_interests) {
        const allInterests = Object.values(profile.user_interests).flat().slice(0, 10);
        signals.interest_tags = allInterests;
        signalMetadata.interest_tags = { signal_source: 'user', signal_strength: 'low', signal_freshness: 'live' };
      }
    }

    // TOX tab signals
    if (allowedClaims.includes('tox_status')) {
      const statusColor = profile?.status_color;
      const toxStatus = statusColor === 'green' ? 'clear' : statusColor === 'red' ? 'restricted' : 'unknown';
      signals.tox_status = toxStatus;
      signalMetadata.tox_status = { signal_source: 'verified_partner', signal_strength: 'high', signal_freshness: 'recent' };

      // Tox recency (based on status_expiry)
      const expiry = profile?.status_expiry ? new Date(profile.status_expiry) : null;
      const daysSinceTest = expiry ? Math.floor((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : -999;
      signals.tox_recency = daysSinceTest > 0 ? 'recent' : expiry ? 'stale' : 'never';
      signalMetadata.tox_recency = { signal_source: 'verified_partner', signal_strength: 'standard', signal_freshness: 'recent' };
    }

    // 4) Compute grade
    let grade: Grade = 'green';
    let message = 'Verified. Admit.';

    const purpose = token.audience;
    
    if (purpose === 'venue_admission' || purpose === 'venue_pass') {
      // For venue admission, check key requirements
      const hasAgeVerified = signals.age_verified === true;
      const hasToxClear = signals.tox_status === 'clear' || signals.tox_status === undefined;
      const hasIdVerified = signals.id_verified === true;

      if (!hasIdVerified && allowedClaims.includes('idv_status')) {
        grade = 'yellow';
        message = 'Limited verification. Check ID.';
      } else if (!hasAgeVerified && allowedClaims.includes('age_verified')) {
        grade = 'yellow';
        message = 'Age not verified. Check ID.';
      } else if (signals.tox_status === 'restricted') {
        grade = 'red';
        message = 'Not verified. Do not admit.';
      } else if (Object.keys(signals).length < 2) {
        grade = 'yellow';
        message = 'Limited verification. Check ID.';
      }
    } else {
      // Profile share - prefer green/yellow
      if (Object.keys(signals).length < 3) {
        grade = 'yellow';
        message = 'User shared limited info.';
      }
    }

    // Log resolve event (no PII)
    await supabase.from('ghost_token_events').insert({
      jti: ghost_ref,
      event_type: 'resolved',
      profile_used: shareProfile,
      allowed_claims: Object.keys(signals),
      metadata: { partner_id, grade, signals_count: Object.keys(signals).length },
    });

    logStep('Resolved successfully', { grade, signals_count: Object.keys(signals).length });

    const response: SignalPack = {
      grade,
      message,
      signals,
      signal_metadata: signalMetadata,
      purpose,
      expires_at: token.expires_at,
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    logStep('Error', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        grade: 'red', 
        message: 'System error.',
        error: errorMessage 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
