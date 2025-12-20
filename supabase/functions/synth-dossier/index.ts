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
    const url = new URL(req.url);
    const runId = url.searchParams.get('run_id');

    // Get user profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('synth_codename, synth_display_name, synth_leaderboard_visibility')
      .eq('user_id', userId)
      .single();

    // Get entitlement
    const { data: entitlement } = await supabaseClient
      .from('synth_entitlements')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: false })
      .limit(1)
      .single();

    // Get runs with stats
    let runsQuery = supabaseClient
      .from('synth_runs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (runId) {
      runsQuery = runsQuery.eq('id', runId);
    }

    const { data: runs } = await runsQuery.limit(50);

    // Calculate aggregate stats
    const recentRuns = runs || [];
    const stats: {
      total_runs: number;
      avg_synth_index: number;
      current_tier: string;
      current_percentile: number;
      trend_7d: Array<{ date: string; value: number }>;
      trend_30d: Array<{ date: string; value: number }>;
      dimension_averages: Record<string, number>;
    } = {
      total_runs: recentRuns.length,
      avg_synth_index: recentRuns.length > 0 
        ? recentRuns.reduce((sum, r) => sum + r.synth_index, 0) / recentRuns.length 
        : 0,
      current_tier: recentRuns[0]?.tier || 'Initiate',
      current_percentile: recentRuns[0]?.percentile || 50,
      trend_7d: [],
      trend_30d: [],
      dimension_averages: {
        coherence: 0,
        verification: 0,
        constraint_discipline: 0,
        omission_resistance: 0,
        adaptation: 0
      }
    };

    // Calculate dimension averages
    if (recentRuns.length > 0) {
      const dims = ['coherence', 'verification', 'constraint_discipline', 'omission_resistance', 'adaptation'];
      dims.forEach(dim => {
        const key = `${dim}_score` as keyof typeof recentRuns[0];
        stats.dimension_averages[dim as keyof typeof stats.dimension_averages] = 
          recentRuns.reduce((sum, r) => sum + (r[key] || 0), 0) / recentRuns.length;
      });
    }

    // Calculate trends
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    stats.trend_7d = recentRuns
      .filter(r => new Date(r.created_at) >= sevenDaysAgo)
      .map(r => ({ date: r.created_at, value: r.synth_index }))
      .reverse();

    stats.trend_30d = recentRuns
      .filter(r => new Date(r.created_at) >= thirtyDaysAgo)
      .map(r => ({ date: r.created_at, value: r.synth_index }))
      .reverse();

    // Get latest run details if requested
    let latestRun = null;
    if (runId && runs && runs.length > 0) {
      latestRun = runs[0];
    } else if (runs && runs.length > 0) {
      latestRun = runs[0];
    }

    return new Response(
      JSON.stringify({
        profile: {
          codename: profile?.synth_codename,
          display_name: profile?.synth_display_name,
          visibility: profile?.synth_leaderboard_visibility
        },
        entitlement: entitlement ? {
          plan: entitlement.plan,
          expires_at: entitlement.expires_at,
          runs_remaining: entitlement.runs_remaining
        } : null,
        stats,
        latest_run: latestRun ? {
          id: latestRun.id,
          synth_index: latestRun.synth_index,
          tier: latestRun.tier,
          percentile: latestRun.percentile,
          ranking_window: latestRun.ranking_window,
          dimension_scores: {
            coherence: latestRun.coherence_score,
            verification: latestRun.verification_score,
            constraint_discipline: latestRun.constraint_discipline_score,
            omission_resistance: latestRun.omission_resistance_score,
            adaptation: latestRun.adaptation_score
          },
          integrity: {
            score: latestRun.integrity_score,
            flags: latestRun.integrity_flags
          },
          reason_codes: latestRun.reason_codes,
          final_output: latestRun.final_output,
          created_at: latestRun.created_at
        } : null,
        runs: recentRuns.slice(0, 20).map(r => ({
          id: r.id,
          synth_index: r.synth_index,
          tier: r.tier,
          percentile: r.percentile,
          template_id: r.template_id,
          created_at: r.created_at
        }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SYNTH-DOSSIER] Error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
