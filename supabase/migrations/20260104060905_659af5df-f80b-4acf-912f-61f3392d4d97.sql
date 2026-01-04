-- Partner Depot Configuration
-- Allows partners to define verification requirements that connect to Ghost Pass signals

-- Signal types that can be required by partners
CREATE TYPE public.depot_signal_type AS ENUM (
  'age_verified',
  'idv_status',
  'background_check',
  'terrorist_list_clear',
  'covid_vaccinated',
  'health_card',
  'drug_test_clear',
  'license_verified',
  'education_verified',
  'employment_verified',
  'credit_check',
  'insurance_verified',
  'certification_valid',
  'custom'
);

-- Partner depot configuration - what signals each partner requires
CREATE TABLE public.partner_depot_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES public.partner_venues(id) ON DELETE CASCADE NOT NULL,
  depot_name TEXT NOT NULL DEFAULT 'Default Depot',
  description TEXT,
  
  -- Required signals for this depot
  required_signals depot_signal_type[] NOT NULL DEFAULT '{}',
  
  -- Custom signal definitions (for 'custom' type)
  custom_signals JSONB DEFAULT '[]',
  
  -- Policy settings
  fail_action TEXT NOT NULL DEFAULT 'deny', -- 'deny', 'flag', 'log_only'
  partial_pass_threshold SMALLINT DEFAULT 100, -- percentage of signals needed
  
  -- Integration settings
  webhook_url TEXT, -- where to send verification results
  api_key_hash TEXT, -- hashed API key for this depot
  
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Signal sources - external providers that send verification signals
CREATE TABLE public.depot_signal_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL UNIQUE, -- 'labcorp', 'checkr', 'footprint', 'fbi_api', etc.
  source_type depot_signal_type NOT NULL,
  api_endpoint TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Signal intake log - records received from sources of truth
-- CONDUIT MODEL: We store the signal result, not the raw data
CREATE TABLE public.depot_signal_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What user this signal is for (via ghost token reference)
  user_id UUID NOT NULL, -- internal user reference
  ghost_token_jti TEXT, -- which ghost token was used
  
  -- Signal metadata
  signal_type depot_signal_type NOT NULL,
  source_id UUID REFERENCES public.depot_signal_sources(id),
  source_name TEXT, -- denormalized for query speed
  
  -- CONDUIT: Only store the result, not the data
  signal_result TEXT NOT NULL, -- 'pass', 'fail', 'pending', 'expired'
  result_hash TEXT, -- cryptographic hash of the verification
  
  -- Validity window
  verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  
  -- Audit trail
  request_id TEXT, -- external request ID from provider
  metadata JSONB DEFAULT '{}', -- non-PII metadata only
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Per-partner verification requirements fulfilled
CREATE TABLE public.depot_verification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  depot_id UUID REFERENCES public.partner_depot_config(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  
  -- Aggregated result
  overall_status TEXT NOT NULL DEFAULT 'pending', -- 'pass', 'fail', 'partial', 'pending'
  signals_checked SMALLINT NOT NULL DEFAULT 0,
  signals_passed SMALLINT NOT NULL DEFAULT 0,
  
  -- Link to individual signals
  signal_intake_ids UUID[] DEFAULT '{}',
  
  -- When verified
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_depot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depot_signal_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depot_signal_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depot_verification_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Partner depot config: venue operators can manage their depots
CREATE POLICY "Venue operators can view their depot configs"
ON public.partner_depot_config FOR SELECT
USING (public.is_venue_operator(auth.uid(), venue_id) OR public.has_role(auth.uid(), 'administrator'));

CREATE POLICY "Venue operators can manage their depot configs"
ON public.partner_depot_config FOR ALL
USING (public.is_venue_operator(auth.uid(), venue_id) OR public.has_role(auth.uid(), 'administrator'));

-- Signal sources: admins only
CREATE POLICY "Admins can manage signal sources"
ON public.depot_signal_sources FOR ALL
USING (public.has_role(auth.uid(), 'administrator'));

CREATE POLICY "Anyone can view active signal sources"
ON public.depot_signal_sources FOR SELECT
USING (is_active = true);

-- Signal intake: users can see their own, venue operators can see for their venues
CREATE POLICY "Users can view their own signal intake"
ON public.depot_signal_intake FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all signal intake"
ON public.depot_signal_intake FOR ALL
USING (public.has_role(auth.uid(), 'administrator'));

-- Verification records: users and venue operators
CREATE POLICY "Users can view their own verification records"
ON public.depot_verification_records FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Venue operators can view verification records for their depots"
ON public.depot_verification_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.partner_depot_config pdc
    WHERE pdc.id = depot_id
    AND public.is_venue_operator(auth.uid(), pdc.venue_id)
  )
);

CREATE POLICY "Admins can manage all verification records"
ON public.depot_verification_records FOR ALL
USING (public.has_role(auth.uid(), 'administrator'));

-- Indexes for performance
CREATE INDEX idx_depot_config_venue ON public.partner_depot_config(venue_id);
CREATE INDEX idx_signal_intake_user ON public.depot_signal_intake(user_id);
CREATE INDEX idx_signal_intake_type ON public.depot_signal_intake(signal_type);
CREATE INDEX idx_verification_records_user ON public.depot_verification_records(user_id);
CREATE INDEX idx_verification_records_depot ON public.depot_verification_records(depot_id);

-- Trigger for updated_at
CREATE TRIGGER update_partner_depot_config_updated_at
BEFORE UPDATE ON public.partner_depot_config
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_depot_verification_records_updated_at
BEFORE UPDATE ON public.depot_verification_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();