-- =============================================
-- SYNTH™ Entitlements System
-- =============================================

-- Create entitlements table for trial/paid access
CREATE TABLE public.synth_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('trial_24h', 'pass_7d', 'pass_30d', 'pass_60d', 'pass_90d')),
  expires_at TIMESTAMPTZ NOT NULL,
  runs_remaining INTEGER NULL,
  stripe_subscription_id TEXT NULL,
  stripe_payment_intent TEXT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_trial CHECK (
    (plan = 'trial_24h' AND runs_remaining IS NOT NULL) OR
    (plan != 'trial_24h')
  )
);

-- Create index for active entitlements
CREATE INDEX idx_synth_entitlements_user ON public.synth_entitlements(user_id, is_active);
CREATE INDEX idx_synth_entitlements_expires ON public.synth_entitlements(expires_at);

-- Enable RLS
ALTER TABLE public.synth_entitlements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own entitlements"
ON public.synth_entitlements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage entitlements"
ON public.synth_entitlements FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can view all entitlements"
ON public.synth_entitlements FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

-- =============================================
-- Extend profiles for SYNTH intake
-- =============================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS synth_codename TEXT NULL,
ADD COLUMN IF NOT EXISTS synth_display_name TEXT NULL,
ADD COLUMN IF NOT EXISTS synth_age_range TEXT NULL,
ADD COLUMN IF NOT EXISTS synth_primary_goal TEXT NULL,
ADD COLUMN IF NOT EXISTS synth_domain_interest TEXT NULL,
ADD COLUMN IF NOT EXISTS synth_consent_scoring BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS synth_consent_analytics BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS synth_leaderboard_visibility TEXT DEFAULT 'anonymous',
ADD COLUMN IF NOT EXISTS synth_intake_completed_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS synth_accepted_at TIMESTAMPTZ NULL;

-- =============================================
-- SYNTH Runs table (detailed per-run logging)
-- =============================================

CREATE TABLE public.synth_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.synth_sessions(id),
  template_id TEXT NOT NULL,
  template_category TEXT NULL,
  
  input_hash TEXT NOT NULL,
  input_length INTEGER NOT NULL,
  source_url TEXT NULL,
  source_hostname TEXT NULL,
  source_type TEXT NOT NULL DEFAULT 'web' CHECK (source_type IN ('web', 'extension', 'api')),
  
  synth_index REAL NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('Initiate', 'Operator', 'Architect', 'Oracle', 'Apex')),
  percentile INTEGER NOT NULL CHECK (percentile >= 0 AND percentile <= 100),
  ranking_window TEXT NOT NULL CHECK (ranking_window IN ('7d', '30d', '60d', '90d')),
  
  coherence_score REAL NULL,
  verification_score REAL NULL,
  constraint_discipline_score REAL NULL,
  omission_resistance_score REAL NULL,
  adaptation_score REAL NULL,
  
  integrity_score REAL NULL,
  integrity_flags TEXT[] DEFAULT '{}',
  reason_codes TEXT[] DEFAULT '{}',
  
  policy_version_id TEXT NOT NULL DEFAULT 'POL-1.0',
  board_profile_id TEXT NOT NULL DEFAULT 'BOARD-A',
  
  final_output TEXT NULL,
  client_meta JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processing_time_ms INTEGER NULL
);

CREATE INDEX idx_synth_runs_user_id ON public.synth_runs(user_id);
CREATE INDEX idx_synth_runs_created_at ON public.synth_runs(created_at DESC);
CREATE INDEX idx_synth_runs_template ON public.synth_runs(template_id);
CREATE INDEX idx_synth_runs_tier ON public.synth_runs(tier);

ALTER TABLE public.synth_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own runs"
ON public.synth_runs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage runs"
ON public.synth_runs FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can view all runs"
ON public.synth_runs FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

-- =============================================
-- SYNTH Templates table
-- =============================================

CREATE TABLE public.synth_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NULL,
  rubric JSONB NOT NULL DEFAULT '{}',
  non_negotiables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.synth_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active templates"
ON public.synth_templates FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage templates"
ON public.synth_templates FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role));

INSERT INTO public.synth_templates (id, name, category, description, rubric, non_negotiables, sort_order) VALUES
('college_essay', 'College Essay', 'admissions', 'Evaluate college application essays', '{"dimensions": ["coherence", "authenticity", "structure"]}', '["no_plagiarism", "word_limit"]', 1),
('swe_technical', 'SWE Technical', 'engineering', 'Evaluate software engineering responses', '{"dimensions": ["accuracy", "depth", "clarity"]}', '["no_hallucination"]', 2),
('security_analysis', 'Security Analysis', 'security', 'Evaluate security assessments', '{"dimensions": ["threat_coverage", "mitigation_quality"]}', '["no_false_positives"]', 3),
('product_brief', 'Product Brief', 'product', 'Evaluate product documentation', '{"dimensions": ["clarity", "completeness"]}', '[]', 4),
('research_summary', 'Research Summary', 'research', 'Evaluate research summaries', '{"dimensions": ["accuracy", "citations", "methodology"]}', '["verifiable_claims"]', 5),
('general', 'General', 'general', 'General purpose evaluation', '{"dimensions": ["coherence", "verification"]}', '[]', 10);

-- =============================================
-- Functions
-- =============================================

CREATE OR REPLACE FUNCTION public.generate_synth_codename(p_tier TEXT DEFAULT 'Initiate')
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prefix TEXT;
  v_suffix TEXT;
  v_codename TEXT;
BEGIN
  v_prefix := CASE p_tier
    WHEN 'Initiate' THEN 'Σ'
    WHEN 'Operator' THEN 'Δ'
    WHEN 'Architect' THEN 'Ω'
    WHEN 'Oracle' THEN 'Φ'
    WHEN 'Apex' THEN 'Ψ'
    ELSE 'Σ'
  END;
  
  v_suffix := LPAD(FLOOR(RANDOM() * 100)::TEXT, 2, '0');
  v_codename := UPPER(p_tier) || '-' || v_prefix || v_suffix;
  
  RETURN v_codename;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_or_create_synth_entitlement(p_user_id UUID)
RETURNS public.synth_entitlements
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_entitlement public.synth_entitlements;
BEGIN
  SELECT * INTO v_entitlement
  FROM public.synth_entitlements
  WHERE user_id = p_user_id
    AND expires_at > now()
    AND is_active = true
    AND (runs_remaining IS NULL OR runs_remaining > 0)
  ORDER BY expires_at DESC
  LIMIT 1;
  
  IF v_entitlement.id IS NOT NULL THEN
    RETURN v_entitlement;
  END IF;
  
  IF EXISTS (SELECT 1 FROM public.synth_entitlements WHERE user_id = p_user_id) THEN
    RETURN NULL;
  END IF;
  
  INSERT INTO public.synth_entitlements (user_id, plan, expires_at, runs_remaining)
  VALUES (p_user_id, 'trial_24h', now() + interval '24 hours', 10)
  RETURNING * INTO v_entitlement;
  
  RETURN v_entitlement;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_synth_trial_run(p_entitlement_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.synth_entitlements
  SET runs_remaining = runs_remaining - 1,
      updated_at = now()
  WHERE id = p_entitlement_id
    AND plan = 'trial_24h'
    AND runs_remaining > 0;
  
  RETURN FOUND;
END;
$$;