-- ============================================================
-- 1. HASH-CHAIN AUDIT TRAIL
-- Add previous_hash for immutable chain linking
-- ============================================================

ALTER TABLE public.synth_senate_runs 
ADD COLUMN IF NOT EXISTS previous_hash TEXT,
ADD COLUMN IF NOT EXISTS record_hash TEXT;

-- Create function to compute and chain hashes on insert
CREATE OR REPLACE FUNCTION public.chain_synth_senate_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_previous_hash TEXT;
  v_record_data TEXT;
BEGIN
  -- Get the hash of the most recent prior record
  SELECT record_hash INTO v_previous_hash
  FROM public.synth_senate_runs
  WHERE created_at < NEW.created_at
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no previous record, use genesis hash
  IF v_previous_hash IS NULL THEN
    v_previous_hash := 'GENESIS_' || encode(sha256('SYNTH_SENATE_GENESIS'::bytea), 'hex');
  END IF;
  
  -- Concatenate key fields for hashing
  v_record_data := COALESCE(NEW.trace_id, '') || '|' ||
                   COALESCE(NEW.user_id::text, '') || '|' ||
                   COALESCE(NEW.input_text, '') || '|' ||
                   COALESCE(NEW.final_answer, '') || '|' ||
                   NEW.created_at::text || '|' ||
                   v_previous_hash;
  
  -- Set hashes
  NEW.previous_hash := v_previous_hash;
  NEW.record_hash := encode(sha256(v_record_data::bytea), 'hex');
  
  RETURN NEW;
END;
$$;

-- Create trigger for hash chaining
DROP TRIGGER IF EXISTS trg_chain_senate_hash ON public.synth_senate_runs;
CREATE TRIGGER trg_chain_senate_hash
  BEFORE INSERT ON public.synth_senate_runs
  FOR EACH ROW
  EXECUTE FUNCTION public.chain_synth_senate_hash();

-- ============================================================
-- 2. SESSION LOCK - Add escalation tracking
-- ============================================================

-- Add escalation action column if not exists
ALTER TABLE public.synth_security_events
ADD COLUMN IF NOT EXISTS action_taken TEXT DEFAULT 'logged';

-- Create function to detect complexity shifts and escalate
CREATE OR REPLACE FUNCTION public.detect_session_lock_trigger(
  p_user_id UUID,
  p_session_id UUID,
  p_current_tokens INTEGER,
  p_previous_tokens INTEGER,
  p_current_readability REAL,
  p_previous_readability REAL,
  p_language_shift BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
  should_escalate BOOLEAN,
  escalation_level INTEGER,
  reason_codes TEXT[],
  action TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_delta_pct REAL;
  v_readability_delta REAL;
  v_reason_codes TEXT[] := ARRAY[]::TEXT[];
  v_escalation_level INTEGER := 0;
  v_current_level INTEGER := 0;
  v_is_probation BOOLEAN := FALSE;
  v_threshold_multiplier REAL := 1.0;
BEGIN
  -- Check if user is on probation (stricter thresholds)
  SELECT EXISTS (
    SELECT 1 FROM public.synth_probation
    WHERE target_user_id = p_user_id
      AND is_active = TRUE
      AND expires_at > NOW()
  ) INTO v_is_probation;
  
  -- Probation users get 50% stricter thresholds
  IF v_is_probation THEN
    v_threshold_multiplier := 0.5;
  END IF;
  
  -- Get current escalation level for this session
  SELECT COALESCE(MAX(escalation_level), 0) INTO v_current_level
  FROM public.synth_security_events
  WHERE user_id = p_user_id
    AND session_id = p_session_id
    AND resolved_at IS NULL;
  
  -- Calculate deltas
  IF p_previous_tokens > 0 THEN
    v_token_delta_pct := ABS(p_current_tokens - p_previous_tokens)::REAL / p_previous_tokens * 100;
  ELSE
    v_token_delta_pct := 0;
  END IF;
  
  v_readability_delta := ABS(COALESCE(p_current_readability, 0) - COALESCE(p_previous_readability, 0));
  
  -- Detect anomalies with threshold adjustments
  -- Token length shift > 200% (or 100% for probation)
  IF v_token_delta_pct > (200 * v_threshold_multiplier) THEN
    v_reason_codes := array_append(v_reason_codes, 'TOKEN_LENGTH_SHIFT');
    v_escalation_level := v_escalation_level + 1;
  END IF;
  
  -- Readability shift > 30 points (or 15 for probation)
  IF v_readability_delta > (30 * v_threshold_multiplier) THEN
    v_reason_codes := array_append(v_reason_codes, 'READABILITY_SHIFT');
    v_escalation_level := v_escalation_level + 1;
  END IF;
  
  -- Language shift detected
  IF p_language_shift THEN
    v_reason_codes := array_append(v_reason_codes, 'LANGUAGE_SHIFT');
    v_escalation_level := v_escalation_level + 1;
  END IF;
  
  -- Calculate final escalation level (1=verify, 2=restrict, 3=lock)
  v_escalation_level := LEAST(v_current_level + v_escalation_level, 3);
  
  RETURN QUERY SELECT
    array_length(v_reason_codes, 1) > 0,
    v_escalation_level,
    v_reason_codes,
    CASE v_escalation_level
      WHEN 1 THEN 'verify'
      WHEN 2 THEN 'restrict'
      WHEN 3 THEN 'lock'
      ELSE 'none'
    END;
END;
$$;

-- ============================================================
-- 3. PROBATION MODE - Ensure table has all needed columns
-- ============================================================

-- Already has: target_user_id, enabled_by, started_at, expires_at, is_active, 
-- extra_logging, strict_session_lock, step_up_auth

-- Add notes column for audit purposes
ALTER TABLE public.synth_probation
ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================================
-- 4. CALIBRATION - Add org_id for employer-org scoping
-- ============================================================

ALTER TABLE public.synth_calibration
ADD COLUMN IF NOT EXISTS org_id UUID;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_synth_calibration_org 
ON public.synth_calibration(org_id) WHERE org_id IS NOT NULL;