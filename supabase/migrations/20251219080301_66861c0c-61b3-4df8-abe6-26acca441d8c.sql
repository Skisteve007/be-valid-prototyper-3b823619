-- Create pricing_models table for storing editable pricing configurations
CREATE TABLE public.pricing_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_key TEXT NOT NULL UNIQUE, -- 'nightlife' or 'stadium'
  display_name TEXT NOT NULL,
  description TEXT,
  
  -- SaaS fees
  saas_monthly_fee NUMERIC DEFAULT 0,
  saas_annual_discount_percent NUMERIC DEFAULT 0,
  
  -- Per-scan fees (door entry)
  scan_fee_door_min NUMERIC DEFAULT 0.20,
  scan_fee_door_max NUMERIC DEFAULT 0.50,
  scan_fee_door_default NUMERIC DEFAULT 0.20,
  
  -- Per-scan fees (purchase/POS)
  scan_fee_purchase_min NUMERIC DEFAULT 0.10,
  scan_fee_purchase_max NUMERIC DEFAULT 0.25,
  scan_fee_purchase_default NUMERIC DEFAULT 0.15,
  
  -- Instant Load fee (guest pays)
  instant_load_fee_percent NUMERIC DEFAULT 3.5,
  instant_load_fee_flat NUMERIC DEFAULT 0,
  
  -- ID Verification fees
  idv_standard_passthrough NUMERIC DEFAULT 1.50,
  idv_standard_markup NUMERIC DEFAULT 0.50,
  idv_premium_passthrough NUMERIC DEFAULT 3.00,
  idv_premium_markup NUMERIC DEFAULT 1.00,
  
  -- Payout settings
  payout_cadence_default TEXT DEFAULT 'weekly', -- 'nightly' or 'weekly'
  payout_cadence_options TEXT[] DEFAULT ARRAY['nightly', 'weekly'],
  
  -- Volume tiers (JSONB for flexibility)
  volume_tiers JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_models ENABLE ROW LEVEL SECURITY;

-- Admins can manage pricing models
CREATE POLICY "Admins can manage pricing models"
  ON public.pricing_models
  FOR ALL
  USING (has_role(auth.uid(), 'administrator'))
  WITH CHECK (has_role(auth.uid(), 'administrator'));

-- Public can read active pricing models (for display)
CREATE POLICY "Public can read active pricing models"
  ON public.pricing_models
  FOR SELECT
  USING (is_active = true);

-- Create updated_at trigger
CREATE TRIGGER update_pricing_models_updated_at
  BEFORE UPDATE ON public.pricing_models
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pricing models
INSERT INTO public.pricing_models (model_key, display_name, description, saas_monthly_fee, scan_fee_door_default, scan_fee_purchase_default, payout_cadence_default, volume_tiers) VALUES
(
  'nightlife',
  'Nightlife & Events',
  'Clubs, bars, festivals, corporate events - high-frequency verification with Ghost Pass revenue share',
  0,
  0.20,
  0.15,
  'nightly',
  '[
    {"min_scans": 0, "max_scans": 999, "fee": 0.50},
    {"min_scans": 1000, "max_scans": 9999, "fee": 0.25},
    {"min_scans": 10000, "max_scans": 99999, "fee": 0.15},
    {"min_scans": 100000, "max_scans": null, "fee": 0.10}
  ]'::jsonb
),
(
  'stadium',
  'Stadiums & Arenas',
  'High-volume venues (10,000+ attendees) - Enterprise SaaS + tiered per-scan pricing',
  2500,
  0.12,
  0.08,
  'weekly',
  '[
    {"min_scans": 0, "max_scans": 49999, "fee": 0.15},
    {"min_scans": 50000, "max_scans": 99999, "fee": 0.12},
    {"min_scans": 100000, "max_scans": 499999, "fee": 0.10},
    {"min_scans": 500000, "max_scans": null, "fee": 0.08}
  ]'::jsonb
);

-- Create venue_statements table for statement tracking
CREATE TABLE public.venue_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id),
  statement_period_start DATE NOT NULL,
  statement_period_end DATE NOT NULL,
  
  -- Gross metrics
  gross_spend NUMERIC DEFAULT 0,
  total_scan_count INTEGER DEFAULT 0,
  door_scan_count INTEGER DEFAULT 0,
  purchase_scan_count INTEGER DEFAULT 0,
  
  -- Fees collected
  scan_fees_total NUMERIC DEFAULT 0,
  idv_fees_total NUMERIC DEFAULT 0,
  instant_load_fees_total NUMERIC DEFAULT 0,
  
  -- Payouts
  promoter_payouts NUMERIC DEFAULT 0,
  account_manager_payouts NUMERIC DEFAULT 0,
  
  -- Adjustments
  refunds_voids NUMERIC DEFAULT 0,
  adjustments NUMERIC DEFAULT 0,
  
  -- Final
  net_payout NUMERIC DEFAULT 0,
  payout_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'paid'
  paid_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on venue_statements
ALTER TABLE public.venue_statements ENABLE ROW LEVEL SECURITY;

-- Admins can manage all statements
CREATE POLICY "Admins can manage statements"
  ON public.venue_statements
  FOR ALL
  USING (has_role(auth.uid(), 'administrator'))
  WITH CHECK (has_role(auth.uid(), 'administrator'));

-- Venue operators can view their statements
CREATE POLICY "Venue operators can view their statements"
  ON public.venue_statements
  FOR SELECT
  USING (is_venue_operator(auth.uid(), venue_id));

-- Create unique constraint on venue + period
CREATE UNIQUE INDEX idx_venue_statements_period ON public.venue_statements(venue_id, statement_period_start, statement_period_end);

-- Create updated_at trigger for statements
CREATE TRIGGER update_venue_statements_updated_at
  BEFORE UPDATE ON public.venue_statements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();