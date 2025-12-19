-- Create enum for event sources
CREATE TYPE synth_event_source AS ENUM ('console', 'extension', 'partner', 'api');

-- Create enum for event types (movement events)
CREATE TYPE synth_event_type AS ENUM (
  -- Entry + Audit
  'PROMPT_SUBMITTED',
  'AUDIT_STARTED',
  'AUDIT_COMPLETED',
  -- Decision interactions
  'DECISION_VIEWED',
  'SAFE_ANSWER_COPIED',
  'SAFE_ANSWER_INSERTED',
  'USER_ACCEPTED_REWRITE',
  'USER_REJECTED_REWRITE',
  -- Revision flow
  'USER_EDITED_AND_RESUBMITTED',
  'USER_CHANGED_RISKY_INTENT',
  -- Review flow
  'HUMAN_REVIEW_REQUESTED',
  'HUMAN_REVIEW_COMPLETED',
  'HUMAN_REVIEW_OVERRULED',
  -- Safety/anomaly
  'POLICY_BLOCK_TRIGGERED',
  'INJECTION_PATTERN_DETECTED',
  'TEMPLATE_DUPLICATION_DETECTED',
  'ANOMALY_SCORE_SPIKE_DETECTED'
);

-- Create enum for risk decisions
CREATE TYPE synth_risk_decision AS ENUM ('ALLOW', 'RESTRICT', 'BLOCK');

-- Create enum for final decisions
CREATE TYPE synth_decision AS ENUM ('RELEASE_FULL', 'RELEASE_SAFE_PARTIAL', 'REFUSE', 'HUMAN_REVIEW_REQUIRED');

-- Create enum for reason codes
CREATE TYPE synth_reason_code AS ENUM (
  -- Positive
  'HIGH_STABILITY_OVER_TIME',
  'CONSISTENT_CONTRADICTION_AVOIDANCE',
  'STRONG_EVIDENCE_DISCIPLINE',
  'SAFE_REFRAME_BEHAVIOR',
  'CALIBRATED_UNCERTAINTY',
  'HIGH_ACCEPTANCE_OF_SAFE_REWRITES',
  -- Improvement
  'HIGH_UNSUPPORTED_CLAIM_RATE',
  'LOW_STABILITY_HIGH_VARIANCE',
  'FREQUENT_POLICY_BOUNDARY_HITS',
  'REPEATED_TEMPLATE_USAGE',
  'INCONSISTENT_REVISIONS',
  'OVERCONFIDENT_LANGUAGE_PATTERN',
  -- Governance
  'ESCALATED_DUE_TO_LOW_COHERENCE',
  'ESCALATED_DUE_TO_LOW_VERIFICATION',
  'REFUSED_DUE_TO_POLICY_BLOCK',
  'RELEASED_SAFE_PARTIAL_DUE_TO_RESTRICTED_RISK'
);

-- Create synth_sessions table
CREATE TABLE public.synth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_hash text,
  source synth_event_source NOT NULL DEFAULT 'console',
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  event_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create synth_events table (the core movement tracking table)
CREATE TABLE public.synth_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_hash text,
  session_id uuid REFERENCES public.synth_sessions(id) ON DELETE SET NULL,
  request_id text,
  source synth_event_source NOT NULL DEFAULT 'console',
  event_type synth_event_type NOT NULL,
  risk_decision synth_risk_decision,
  decision synth_decision,
  coherence_score real,
  verification_score real,
  prompt_hash text,
  answer_hash text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_synth_events_user_id ON public.synth_events(user_id);
CREATE INDEX idx_synth_events_session_id ON public.synth_events(session_id);
CREATE INDEX idx_synth_events_request_id ON public.synth_events(request_id);
CREATE INDEX idx_synth_events_event_type ON public.synth_events(event_type);
CREATE INDEX idx_synth_events_timestamp ON public.synth_events(timestamp DESC);
CREATE INDEX idx_synth_events_user_timestamp ON public.synth_events(user_id, timestamp DESC);
CREATE INDEX idx_synth_sessions_user_id ON public.synth_sessions(user_id);
CREATE INDEX idx_synth_sessions_last_activity ON public.synth_sessions(last_activity_at DESC);

-- Create user metrics aggregation table for computed flow metrics
CREATE TABLE public.synth_user_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  period_type text NOT NULL DEFAULT 'weekly', -- weekly, monthly, etc.
  
  -- Flow metrics
  prompts_submitted integer DEFAULT 0,
  audits_completed integer DEFAULT 0,
  rewrites_accepted integer DEFAULT 0,
  rewrites_rejected integer DEFAULT 0,
  revisions_submitted integer DEFAULT 0,
  human_reviews_requested integer DEFAULT 0,
  policy_blocks_triggered integer DEFAULT 0,
  
  -- Computed rates (stored for fast access)
  completion_rate real,
  revision_rate real,
  acceptance_rate real,
  review_rate real,
  
  -- Timing metrics
  avg_time_to_decision_ms integer,
  median_time_to_decision_ms integer,
  
  -- Scores
  avg_coherence_score real,
  avg_verification_score real,
  
  -- Reason codes (array of applicable codes)
  reason_codes synth_reason_code[] DEFAULT '{}',
  
  -- Tier classification
  tier_percentile integer, -- 1, 5, 10, 15, 20, or NULL
  
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, period_start, period_end, period_type)
);

CREATE INDEX idx_synth_user_metrics_user_period ON public.synth_user_metrics(user_id, period_start DESC);
CREATE INDEX idx_synth_user_metrics_tier ON public.synth_user_metrics(tier_percentile);

-- Enable RLS
ALTER TABLE public.synth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synth_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synth_user_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for synth_sessions
CREATE POLICY "Users can view their own sessions"
  ON public.synth_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage sessions"
  ON public.synth_sessions FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can view all sessions"
  ON public.synth_sessions FOR SELECT
  USING (has_role(auth.uid(), 'administrator'::app_role));

-- RLS Policies for synth_events
CREATE POLICY "Users can view their own events"
  ON public.synth_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage events"
  ON public.synth_events FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can view all events"
  ON public.synth_events FOR SELECT
  USING (has_role(auth.uid(), 'administrator'::app_role));

-- RLS Policies for synth_user_metrics
CREATE POLICY "Users can view their own metrics"
  ON public.synth_user_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage metrics"
  ON public.synth_user_metrics FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can view all metrics"
  ON public.synth_user_metrics FOR SELECT
  USING (has_role(auth.uid(), 'administrator'::app_role));

-- Function to get or create an active session (30 min inactivity rule)
CREATE OR REPLACE FUNCTION public.get_or_create_synth_session(
  p_user_id uuid,
  p_user_hash text DEFAULT NULL,
  p_source synth_event_source DEFAULT 'console'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_session_id uuid;
  v_inactivity_threshold interval := '30 minutes';
BEGIN
  -- Try to find an active session within the inactivity threshold
  SELECT id INTO v_session_id
  FROM public.synth_sessions
  WHERE (user_id = p_user_id OR user_hash = p_user_hash)
    AND source = p_source
    AND last_activity_at > now() - v_inactivity_threshold
    AND ended_at IS NULL
  ORDER BY last_activity_at DESC
  LIMIT 1;
  
  -- If found, update last activity
  IF v_session_id IS NOT NULL THEN
    UPDATE public.synth_sessions
    SET last_activity_at = now(),
        event_count = event_count + 1
    WHERE id = v_session_id;
    RETURN v_session_id;
  END IF;
  
  -- Close any old sessions for this user
  UPDATE public.synth_sessions
  SET ended_at = last_activity_at
  WHERE (user_id = p_user_id OR user_hash = p_user_hash)
    AND source = p_source
    AND ended_at IS NULL;
  
  -- Create new session
  INSERT INTO public.synth_sessions (user_id, user_hash, source, event_count)
  VALUES (p_user_id, p_user_hash, p_source, 1)
  RETURNING id INTO v_session_id;
  
  RETURN v_session_id;
END;
$$;

-- Function to log a SYNTH event
CREATE OR REPLACE FUNCTION public.log_synth_event(
  p_user_id uuid,
  p_event_type synth_event_type,
  p_request_id text DEFAULT NULL,
  p_source synth_event_source DEFAULT 'console',
  p_risk_decision synth_risk_decision DEFAULT NULL,
  p_decision synth_decision DEFAULT NULL,
  p_coherence_score real DEFAULT NULL,
  p_verification_score real DEFAULT NULL,
  p_prompt_hash text DEFAULT NULL,
  p_answer_hash text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_session_id uuid;
  v_event_id uuid;
  v_user_hash text;
BEGIN
  -- Generate user hash for privacy
  IF p_user_id IS NOT NULL THEN
    v_user_hash := encode(sha256(p_user_id::text::bytea), 'hex');
  END IF;
  
  -- Get or create session
  v_session_id := get_or_create_synth_session(p_user_id, v_user_hash, p_source);
  
  -- Insert the event
  INSERT INTO public.synth_events (
    user_id,
    user_hash,
    session_id,
    request_id,
    source,
    event_type,
    risk_decision,
    decision,
    coherence_score,
    verification_score,
    prompt_hash,
    answer_hash,
    metadata
  ) VALUES (
    p_user_id,
    v_user_hash,
    v_session_id,
    p_request_id,
    p_source,
    p_event_type,
    p_risk_decision,
    p_decision,
    p_coherence_score,
    p_verification_score,
    p_prompt_hash,
    p_answer_hash,
    p_metadata
  )
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$;