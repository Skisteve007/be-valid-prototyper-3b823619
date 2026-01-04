-- Create enum for deployment environments
CREATE TYPE public.deployment_env AS ENUM ('dev', 'stage', 'prod');

-- Create enum for data environments
CREATE TYPE public.data_environment AS ENUM ('on_prem', 'cloud', 'hybrid');

-- Create enum for connector types
CREATE TYPE public.connector_type AS ENUM ('source_of_truth', 'customer_vault');

-- Create enum for connector storage types
CREATE TYPE public.vault_storage_type AS ENUM ('s3', 'azure', 'gcs', 'sftp', 'on_prem');

-- Create accounts table (replacing venues concept for enterprise)
CREATE TABLE public.enterprise_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_name TEXT NOT NULL,
  industry TEXT NOT NULL DEFAULT 'enterprise',
  location_city TEXT,
  location_country TEXT DEFAULT 'USA',
  status TEXT NOT NULL DEFAULT 'pending',
  
  -- Intake fields
  data_environment data_environment,
  data_classes TEXT[] DEFAULT '{}',
  use_cases TEXT[] DEFAULT '{}',
  output_preference TEXT DEFAULT 'download',
  intake_completed_at TIMESTAMPTZ,
  
  -- Tracking
  last_run_at TIMESTAMPTZ,
  last_verdict TEXT,
  total_runs INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create deployments table (child of account)
CREATE TABLE public.account_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.enterprise_accounts(id) ON DELETE CASCADE,
  deployment_name TEXT NOT NULL,
  environment deployment_env NOT NULL DEFAULT 'dev',
  ttl_minutes INTEGER NOT NULL DEFAULT 10,
  consensus_threshold INTEGER NOT NULL DEFAULT 5,
  
  -- Lens configuration (7 lenses)
  lens_1_enabled BOOLEAN DEFAULT true,
  lens_2_enabled BOOLEAN DEFAULT true,
  lens_3_enabled BOOLEAN DEFAULT true,
  lens_4_enabled BOOLEAN DEFAULT true,
  lens_5_enabled BOOLEAN DEFAULT true,
  lens_6_enabled BOOLEAN DEFAULT true,
  lens_7_enabled BOOLEAN DEFAULT true,
  
  -- Default action after decision
  default_action TEXT NOT NULL DEFAULT 'flush',
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create connectors table
CREATE TABLE public.account_connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.enterprise_accounts(id) ON DELETE CASCADE,
  connector_type connector_type NOT NULL,
  connector_name TEXT NOT NULL,
  
  -- For source of truth connectors
  api_endpoint TEXT,
  auth_type TEXT,
  
  -- For customer vault connectors
  vault_type vault_storage_type,
  vault_endpoint TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_test_at TIMESTAMPTZ,
  last_test_status TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create proof records table (immutable audit trail)
CREATE TABLE public.account_proof_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.enterprise_accounts(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES public.account_deployments(id) ON DELETE SET NULL,
  
  -- Request info
  request_type TEXT NOT NULL,
  requester_hash TEXT,
  
  -- Verdict
  verdict TEXT NOT NULL,
  scores JSONB DEFAULT '{}',
  flags TEXT[] DEFAULT '{}',
  
  -- Proof chain
  proof_record_id TEXT NOT NULL UNIQUE,
  input_hash TEXT NOT NULL,
  output_hash TEXT NOT NULL,
  lens_summaries JSONB DEFAULT '{}',
  connector_refs JSONB DEFAULT '{}',
  
  -- Signing
  signature TEXT,
  signed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create ephemeral payload vault (auto-deletes after TTL or decision)
CREATE TABLE public.ephemeral_payload_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.enterprise_accounts(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES public.account_deployments(id) ON DELETE CASCADE,
  
  -- Payload metadata only (NOT raw data - that stays in memory/temp storage)
  payload_type TEXT NOT NULL,
  payload_size_bytes INTEGER,
  payload_hash TEXT NOT NULL,
  
  -- TTL tracking
  expires_at TIMESTAMPTZ NOT NULL,
  flushed_at TIMESTAMPTZ,
  flush_reason TEXT,
  
  -- If saved to customer vault
  customer_vault_ref TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.enterprise_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_proof_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ephemeral_payload_vault ENABLE ROW LEVEL SECURITY;

-- RLS policies for enterprise_accounts
CREATE POLICY "Admins can manage all accounts" ON public.enterprise_accounts
  FOR ALL USING (has_role(auth.uid(), 'administrator'));

CREATE POLICY "Service role can manage accounts" ON public.enterprise_accounts
  FOR ALL USING (true) WITH CHECK (true);

-- RLS policies for account_deployments
CREATE POLICY "Admins can manage all deployments" ON public.account_deployments
  FOR ALL USING (has_role(auth.uid(), 'administrator'));

CREATE POLICY "Service role can manage deployments" ON public.account_deployments
  FOR ALL USING (true) WITH CHECK (true);

-- RLS policies for account_connectors
CREATE POLICY "Admins can manage all connectors" ON public.account_connectors
  FOR ALL USING (has_role(auth.uid(), 'administrator'));

CREATE POLICY "Service role can manage connectors" ON public.account_connectors
  FOR ALL USING (true) WITH CHECK (true);

-- RLS policies for proof records (read-only for admins, insert for service)
CREATE POLICY "Admins can view proof records" ON public.account_proof_records
  FOR SELECT USING (has_role(auth.uid(), 'administrator'));

CREATE POLICY "Service role can insert proof records" ON public.account_proof_records
  FOR INSERT WITH CHECK (true);

-- RLS policies for ephemeral vault
CREATE POLICY "Admins can view ephemeral vault" ON public.ephemeral_payload_vault
  FOR SELECT USING (has_role(auth.uid(), 'administrator'));

CREATE POLICY "Service role can manage ephemeral vault" ON public.ephemeral_payload_vault
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_accounts_industry ON public.enterprise_accounts(industry);
CREATE INDEX idx_accounts_status ON public.enterprise_accounts(status);
CREATE INDEX idx_deployments_account ON public.account_deployments(account_id);
CREATE INDEX idx_connectors_account ON public.account_connectors(account_id);
CREATE INDEX idx_proof_records_account ON public.account_proof_records(account_id);
CREATE INDEX idx_proof_records_proof_id ON public.account_proof_records(proof_record_id);
CREATE INDEX idx_ephemeral_expires ON public.ephemeral_payload_vault(expires_at);

-- Function to generate proof record ID
CREATE OR REPLACE FUNCTION public.generate_proof_record_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'PRF-' || to_char(now(), 'YYYYMMDD') || '-' || 
         UPPER(substring(gen_random_uuid()::text from 1 for 8));
END;
$$;

-- Function to auto-flush expired payloads
CREATE OR REPLACE FUNCTION public.flush_expired_payloads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.ephemeral_payload_vault
  SET flushed_at = now(),
      flush_reason = 'ttl_expired'
  WHERE expires_at < now()
    AND flushed_at IS NULL;
END;
$$;