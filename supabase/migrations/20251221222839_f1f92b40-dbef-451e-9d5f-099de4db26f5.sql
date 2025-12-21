-- =====================================================
-- SYNTH SENATE: Tables for 7-Seat AI Governance System
-- (Simplified - no org membership table dependency)
-- =====================================================

-- Table for organization calibration weights
CREATE TABLE public.synth_calibration (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID, -- For individual calibration if no org
  seat_1_weight INTEGER NOT NULL DEFAULT 15 CHECK (seat_1_weight >= 0 AND seat_1_weight <= 100), -- OpenAI
  seat_2_weight INTEGER NOT NULL DEFAULT 15 CHECK (seat_2_weight >= 0 AND seat_2_weight <= 100), -- Anthropic
  seat_3_weight INTEGER NOT NULL DEFAULT 15 CHECK (seat_3_weight >= 0 AND seat_3_weight <= 100), -- Google
  seat_4_weight INTEGER NOT NULL DEFAULT 14 CHECK (seat_4_weight >= 0 AND seat_4_weight <= 100), -- Meta
  seat_5_weight INTEGER NOT NULL DEFAULT 14 CHECK (seat_5_weight >= 0 AND seat_5_weight <= 100), -- DeepSeek
  seat_6_weight INTEGER NOT NULL DEFAULT 14 CHECK (seat_6_weight >= 0 AND seat_6_weight <= 100), -- Mistral
  seat_7_weight INTEGER NOT NULL DEFAULT 13 CHECK (seat_7_weight >= 0 AND seat_7_weight <= 100), -- xAI
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT weights_sum_to_100 CHECK (
    seat_1_weight + seat_2_weight + seat_3_weight + seat_4_weight + 
    seat_5_weight + seat_6_weight + seat_7_weight = 100
  )
);

-- Table for probation mode settings
CREATE TABLE public.synth_probation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_user_id UUID NOT NULL,
  enabled_by UUID NOT NULL,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  extra_logging BOOLEAN NOT NULL DEFAULT true,
  strict_session_lock BOOLEAN NOT NULL DEFAULT true,
  step_up_auth BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for prefill context (Chrome extension)
CREATE TABLE public.synth_prefills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prefill_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  url TEXT,
  title TEXT,
  selected_text TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  consumed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours')
);

-- Table for security events (Session Lock)
CREATE TABLE public.synth_security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID,
  event_type TEXT NOT NULL,
  reason_codes TEXT[] NOT NULL DEFAULT '{}',
  metrics JSONB NOT NULL DEFAULT '{}',
  escalation_level INTEGER NOT NULL DEFAULT 1,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for calibration/probation audit log
CREATE TABLE public.synth_calibration_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  target_id UUID,
  from_value JSONB,
  to_value JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for learning rate data (error tracking over time)
CREATE TABLE public.synth_learning_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  is_error BOOLEAN NOT NULL DEFAULT false,
  score REAL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to store senate run ballots
CREATE TABLE public.synth_senate_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trace_id TEXT NOT NULL UNIQUE,
  input_text TEXT NOT NULL,
  ballots JSONB NOT NULL DEFAULT '[]',
  judge_output JSONB NOT NULL DEFAULT '{}',
  final_answer TEXT,
  contested BOOLEAN NOT NULL DEFAULT false,
  participation_summary JSONB NOT NULL DEFAULT '{}',
  weights_used JSONB NOT NULL DEFAULT '{}',
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.synth_calibration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synth_probation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synth_prefills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synth_security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synth_calibration_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synth_learning_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synth_senate_runs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for synth_calibration
CREATE POLICY "Users can view their own calibration"
  ON public.synth_calibration FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all calibration"
  ON public.synth_calibration FOR ALL
  USING (has_role(auth.uid(), 'administrator'));

CREATE POLICY "Users can insert their calibration"
  ON public.synth_calibration FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their calibration"
  ON public.synth_calibration FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for synth_probation
CREATE POLICY "Users can view probation targeting them"
  ON public.synth_probation FOR SELECT
  USING (target_user_id = auth.uid() OR enabled_by = auth.uid());

CREATE POLICY "Admins can manage probation"
  ON public.synth_probation FOR ALL
  USING (has_role(auth.uid(), 'administrator'));

-- RLS Policies for synth_prefills (CRITICAL SECURITY - User-scoped)
CREATE POLICY "Users can only access their own prefills"
  ON public.synth_prefills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prefills"
  ON public.synth_prefills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prefills"
  ON public.synth_prefills FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage prefills"
  ON public.synth_prefills FOR ALL
  USING (true);

-- RLS Policies for synth_security_events
CREATE POLICY "Users can view their own security events"
  ON public.synth_security_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage security events"
  ON public.synth_security_events FOR ALL
  USING (true);

CREATE POLICY "Admins can view all security events"
  ON public.synth_security_events FOR SELECT
  USING (has_role(auth.uid(), 'administrator'));

-- RLS Policies for synth_calibration_audit
CREATE POLICY "Users can view their audit logs"
  ON public.synth_calibration_audit FOR SELECT
  USING (actor_user_id = auth.uid());

CREATE POLICY "Admins can view all audit logs"
  ON public.synth_calibration_audit FOR SELECT
  USING (has_role(auth.uid(), 'administrator'));

CREATE POLICY "Service role can insert audit logs"
  ON public.synth_calibration_audit FOR INSERT
  WITH CHECK (true);

-- RLS Policies for synth_learning_events
CREATE POLICY "Users can view their learning events"
  ON public.synth_learning_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their learning events"
  ON public.synth_learning_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all learning events"
  ON public.synth_learning_events FOR SELECT
  USING (has_role(auth.uid(), 'administrator'));

-- RLS Policies for synth_senate_runs
CREATE POLICY "Users can view their senate runs"
  ON public.synth_senate_runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage senate runs"
  ON public.synth_senate_runs FOR ALL
  USING (true);

CREATE POLICY "Admins can view all senate runs"
  ON public.synth_senate_runs FOR SELECT
  USING (has_role(auth.uid(), 'administrator'));

-- Create indexes for performance
CREATE INDEX idx_synth_prefills_user ON public.synth_prefills(user_id);
CREATE INDEX idx_synth_prefills_prefill_id ON public.synth_prefills(prefill_id);
CREATE INDEX idx_synth_prefills_expires ON public.synth_prefills(expires_at);
CREATE INDEX idx_synth_security_events_user ON public.synth_security_events(user_id);
CREATE INDEX idx_synth_learning_events_user ON public.synth_learning_events(user_id, created_at);
CREATE INDEX idx_synth_probation_target ON public.synth_probation(target_user_id);
CREATE INDEX idx_synth_senate_runs_user ON public.synth_senate_runs(user_id, created_at);
CREATE INDEX idx_synth_senate_runs_trace ON public.synth_senate_runs(trace_id);

-- Cleanup function for expired prefills
CREATE OR REPLACE FUNCTION public.cleanup_expired_synth_prefills()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.synth_prefills
  WHERE expires_at < NOW();
END;
$$;

-- Add trigger to update updated_at
CREATE TRIGGER update_synth_calibration_updated_at
  BEFORE UPDATE ON public.synth_calibration
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_synth_probation_updated_at
  BEFORE UPDATE ON public.synth_probation
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();