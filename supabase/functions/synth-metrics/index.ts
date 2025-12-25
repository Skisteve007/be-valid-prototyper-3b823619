import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================
// SYNTH METRICS API
// GET /synth-metrics?window=24h|7d|30d|60d|90d
// ============================================================

interface MetricsRequest {
  window: '24h' | '7d' | '30d' | '60d' | '90d';
}

interface SeatMetrics {
  seat_name: string;
  total_runs: number;
  avg_latency_ms: number;
  abstain_count: number;
  abstain_rate: number;
}

interface MetricsResponse {
  window: string;
  totals: {
    total_runs: number;
    avg_synth_index: number;
    contested_count: number;
    contested_rate: number;
    judge_used_count: number;
    judge_rate: number;
    pass_count: number;
    review_count: number;
    deny_count: number;
    avg_latency_ms: number;
  };
  kpis: {
    pass_rate: number;
    review_rate: number;
    deny_rate: number;
    reliability_score: number;
  };
  series: Array<{
    date: string;
    total_runs: number;
    avg_synth_index: number;
    contested_count: number;
  }>;
  seat_table: SeatMetrics[];
}

function getWindowDays(window: string): number {
  switch (window) {
    case '24h': return 1;
    case '7d': return 7;
    case '30d': return 30;
    case '60d': return 60;
    case '90d': return 90;
    default: return 7;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const window = url.searchParams.get('window') || '7d';
    const days = getWindowDays(window);

    console.log(`[SYNTH-METRICS] Fetching metrics for window: ${window} (${days} days)`);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Fetch daily metrics for the window
    const { data: dailyMetrics, error: dailyError } = await supabaseClient
      .from('synth_demo_metrics_daily')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (dailyError) {
      console.error('[SYNTH-METRICS] Error fetching daily metrics:', dailyError);
      throw dailyError;
    }

    console.log(`[SYNTH-METRICS] Found ${dailyMetrics?.length || 0} daily records`);

    // Aggregate totals
    const totals = {
      total_runs: 0,
      avg_synth_index: 0,
      contested_count: 0,
      contested_rate: 0,
      judge_used_count: 0,
      judge_rate: 0,
      pass_count: 0,
      review_count: 0,
      deny_count: 0,
      avg_latency_ms: 0,
    };

    let synthIndexSum = 0;
    let latencySum = 0;
    let latencyCount = 0;

    for (const day of dailyMetrics || []) {
      totals.total_runs += day.total_runs || 0;
      totals.contested_count += day.contested_count || 0;
      totals.judge_used_count += day.judge_used_count || 0;
      totals.pass_count += day.pass_count || 0;
      totals.review_count += day.review_count || 0;
      totals.deny_count += day.deny_count || 0;
      
      if (day.avg_synth_index) {
        synthIndexSum += (day.avg_synth_index * day.total_runs);
      }
      
      if (day.avg_latency_ms) {
        latencySum += (day.avg_latency_ms * day.total_runs);
        latencyCount += day.total_runs;
      }
    }

    if (totals.total_runs > 0) {
      totals.avg_synth_index = parseFloat((synthIndexSum / totals.total_runs).toFixed(2));
      totals.contested_rate = parseFloat((totals.contested_count / totals.total_runs * 100).toFixed(1));
      totals.judge_rate = parseFloat((totals.judge_used_count / totals.total_runs * 100).toFixed(1));
    }

    if (latencyCount > 0) {
      totals.avg_latency_ms = Math.round(latencySum / latencyCount);
    }

    // Calculate KPIs
    const passRate = totals.total_runs > 0 ? parseFloat((totals.pass_count / totals.total_runs * 100).toFixed(1)) : 0;
    const reviewRate = totals.total_runs > 0 ? parseFloat((totals.review_count / totals.total_runs * 100).toFixed(1)) : 0;
    const denyRate = totals.total_runs > 0 ? parseFloat((totals.deny_count / totals.total_runs * 100).toFixed(1)) : 0;

    const kpis = {
      pass_rate: passRate,
      review_rate: reviewRate,
      deny_rate: denyRate,
      reliability_score: Math.min(100, Math.max(0, 100 - totals.contested_rate - (denyRate * 0.5))),
    };

    // Build time series
    const series = (dailyMetrics || []).map(day => ({
      date: day.date,
      total_runs: day.total_runs,
      avg_synth_index: day.avg_synth_index,
      contested_count: day.contested_count,
    }));

    // Fetch seat-level metrics from run_metrics table
    const { data: seatData, error: seatError } = await supabaseClient
      .from('synth_demo_run_metrics')
      .select('seat_name, status, latency_ms')
      .gte('created_at', startDate.toISOString());

    const seatAggregates: Record<string, { runs: number; latencySum: number; abstainCount: number }> = {};

    for (const metric of seatData || []) {
      if (!seatAggregates[metric.seat_name]) {
        seatAggregates[metric.seat_name] = { runs: 0, latencySum: 0, abstainCount: 0 };
      }
      seatAggregates[metric.seat_name].runs += 1;
      seatAggregates[metric.seat_name].latencySum += metric.latency_ms || 0;
      if (metric.status !== 'online') {
        seatAggregates[metric.seat_name].abstainCount += 1;
      }
    }

    const seat_table: SeatMetrics[] = Object.entries(seatAggregates).map(([name, data]) => ({
      seat_name: name,
      total_runs: data.runs,
      avg_latency_ms: data.runs > 0 ? Math.round(data.latencySum / data.runs) : 0,
      abstain_count: data.abstainCount,
      abstain_rate: data.runs > 0 ? parseFloat((data.abstainCount / data.runs * 100).toFixed(1)) : 0,
    }));

    const response: MetricsResponse = {
      window,
      totals,
      kpis,
      series,
      seat_table,
    };

    console.log(`[SYNTH-METRICS] Returning metrics: ${totals.total_runs} total runs`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SYNTH-METRICS] Error:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
