-- ============================================================
-- SYNTH DEMO SUITE v1 - Database Schema
-- Phase 1: Core tables for demo orchestrator, metrics, and audit
-- Uses synth_demo_ prefix to avoid conflicts with existing synth_runs
-- ============================================================

-- SYNTH Demo Runs table - stores run summaries (no raw payloads)
CREATE TABLE IF NOT EXISTS public.synth_demo_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trace_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  mode TEXT NOT NULL DEFAULT 'demo' CHECK (mode IN ('demo', 'prod')),
  run_type TEXT NOT NULL DEFAULT 'qa' CHECK (run_type IN ('qa', 'clean_verify', 'enterprise')),
  user_id UUID REFERENCES auth.users(id),
  input_hash TEXT, -- SHA256 of input, not raw input
  synth_index NUMERIC(5,2), -- 0.00 to 100.00
  tier TEXT NOT NULL DEFAULT 'REVIEW' CHECK (tier IN ('PASS', 'REVIEW', 'DENY')),
  judge_used BOOLEAN NOT NULL DEFAULT false,
  contested BOOLEAN NOT NULL DEFAULT false,
  seat_count INTEGER NOT NULL DEFAULT 0,
  online_seat_count INTEGER NOT NULL DEFAULT 0,
  avg_score NUMERIC(5,2),
  avg_confidence NUMERIC(3,2),
  conflict_score NUMERIC(5,2),
  record_hash TEXT NOT NULL,
  previous_hash TEXT,
  retention_mode TEXT NOT NULL DEFAULT 'minimal' CHECK (retention_mode IN ('minimal', 'explicit_opt_in'))
);

-- SYNTH Demo Run Metrics - per-seat metrics for each run
CREATE TABLE IF NOT EXISTS public.synth_demo_run_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trace_id TEXT NOT NULL REFERENCES public.synth_demo_runs(trace_id) ON DELETE CASCADE,
  seat_id INTEGER NOT NULL,
  seat_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'timeout', 'error')),
  stance TEXT CHECK (stance IN ('approve', 'revise', 'block', 'abstain')),
  score INTEGER,
  confidence NUMERIC(3,2),
  latency_ms INTEGER,
  abstain_reason TEXT,
  risk_flags_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- SYNTH Demo Audit Proofs - stores the complete audit proof JSON
CREATE TABLE IF NOT EXISTS public.synth_demo_audit_proofs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trace_id TEXT NOT NULL UNIQUE REFERENCES public.synth_demo_runs(trace_id) ON DELETE CASCADE,
  audit_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- SYNTH Demo Metrics Aggregates - pre-computed metrics for dashboard
CREATE TABLE IF NOT EXISTS public.synth_demo_metrics_daily (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  mode TEXT NOT NULL DEFAULT 'demo',
  total_runs INTEGER NOT NULL DEFAULT 0,
  avg_synth_index NUMERIC(5,2),
  contested_count INTEGER NOT NULL DEFAULT 0,
  judge_used_count INTEGER NOT NULL DEFAULT 0,
  pass_count INTEGER NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  deny_count INTEGER NOT NULL DEFAULT 0,
  avg_latency_ms INTEGER,
  seat_metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date, mode)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_synth_demo_runs_trace_id ON public.synth_demo_runs(trace_id);
CREATE INDEX IF NOT EXISTS idx_synth_demo_runs_created_at ON public.synth_demo_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_synth_demo_runs_mode ON public.synth_demo_runs(mode);
CREATE INDEX IF NOT EXISTS idx_synth_demo_run_metrics_trace_id ON public.synth_demo_run_metrics(trace_id);
CREATE INDEX IF NOT EXISTS idx_synth_demo_audit_proofs_trace_id ON public.synth_demo_audit_proofs(trace_id);
CREATE INDEX IF NOT EXISTS idx_synth_demo_metrics_daily_date ON public.synth_demo_metrics_daily(date DESC);

-- Enable RLS
ALTER TABLE public.synth_demo_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synth_demo_run_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synth_demo_audit_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synth_demo_metrics_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies for synth_demo_runs
CREATE POLICY "Anyone can view demo runs"
  ON public.synth_demo_runs FOR SELECT
  USING (mode = 'demo' OR auth.uid() = user_id);

CREATE POLICY "Service can insert demo runs"
  ON public.synth_demo_runs FOR INSERT
  WITH CHECK (true);

-- RLS Policies for synth_demo_run_metrics
CREATE POLICY "Anyone can view demo run metrics"
  ON public.synth_demo_run_metrics FOR SELECT
  USING (true);

CREATE POLICY "Service can insert demo run metrics"
  ON public.synth_demo_run_metrics FOR INSERT
  WITH CHECK (true);

-- RLS Policies for synth_demo_audit_proofs  
CREATE POLICY "Anyone can view demo audit proofs"
  ON public.synth_demo_audit_proofs FOR SELECT
  USING (true);

CREATE POLICY "Service can insert demo audit proofs"
  ON public.synth_demo_audit_proofs FOR INSERT
  WITH CHECK (true);

-- RLS Policies for synth_demo_metrics_daily
CREATE POLICY "Anyone can view demo metrics"
  ON public.synth_demo_metrics_daily FOR SELECT
  USING (true);

CREATE POLICY "Service can manage demo metrics"
  ON public.synth_demo_metrics_daily FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to update daily metrics after each demo run
CREATE OR REPLACE FUNCTION public.update_synth_demo_daily_metrics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.synth_demo_metrics_daily (date, mode, total_runs, contested_count, judge_used_count, pass_count, review_count, deny_count, avg_synth_index)
  VALUES (
    DATE(NEW.created_at),
    NEW.mode,
    1,
    CASE WHEN NEW.contested THEN 1 ELSE 0 END,
    CASE WHEN NEW.judge_used THEN 1 ELSE 0 END,
    CASE WHEN NEW.tier = 'PASS' THEN 1 ELSE 0 END,
    CASE WHEN NEW.tier = 'REVIEW' THEN 1 ELSE 0 END,
    CASE WHEN NEW.tier = 'DENY' THEN 1 ELSE 0 END,
    NEW.synth_index
  )
  ON CONFLICT (date, mode) DO UPDATE SET
    total_runs = synth_demo_metrics_daily.total_runs + 1,
    contested_count = synth_demo_metrics_daily.contested_count + CASE WHEN NEW.contested THEN 1 ELSE 0 END,
    judge_used_count = synth_demo_metrics_daily.judge_used_count + CASE WHEN NEW.judge_used THEN 1 ELSE 0 END,
    pass_count = synth_demo_metrics_daily.pass_count + CASE WHEN NEW.tier = 'PASS' THEN 1 ELSE 0 END,
    review_count = synth_demo_metrics_daily.review_count + CASE WHEN NEW.tier = 'REVIEW' THEN 1 ELSE 0 END,
    deny_count = synth_demo_metrics_daily.deny_count + CASE WHEN NEW.tier = 'DENY' THEN 1 ELSE 0 END,
    avg_synth_index = (synth_demo_metrics_daily.avg_synth_index * synth_demo_metrics_daily.total_runs + NEW.synth_index) / (synth_demo_metrics_daily.total_runs + 1),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-update metrics
CREATE TRIGGER trigger_update_synth_demo_daily_metrics
  AFTER INSERT ON public.synth_demo_runs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_synth_demo_daily_metrics();

-- Seed some demo history for the monitoring dashboard (90 days)
INSERT INTO public.synth_demo_metrics_daily (date, mode, total_runs, avg_synth_index, contested_count, judge_used_count, pass_count, review_count, deny_count, avg_latency_ms)
SELECT
  (CURRENT_DATE - (n || ' days')::interval)::date as date,
  'demo' as mode,
  (20 + floor(random() * 50))::int as total_runs,
  (70 + random() * 20)::numeric(5,2) as avg_synth_index,
  (floor(random() * 8))::int as contested_count,
  (floor(random() * 15))::int as judge_used_count,
  (15 + floor(random() * 30))::int as pass_count,
  (3 + floor(random() * 10))::int as review_count,
  (floor(random() * 5))::int as deny_count,
  (1200 + floor(random() * 800))::int as avg_latency_ms
FROM generate_series(1, 90) as n
ON CONFLICT (date, mode) DO NOTHING;