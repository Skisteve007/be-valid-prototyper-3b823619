-- Pricing Catalog: atomic billable events (source of truth)
CREATE TABLE public.pricing_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_code TEXT NOT NULL UNIQUE,
  event_name TEXT NOT NULL,
  description TEXT,
  payer TEXT NOT NULL CHECK (payer IN ('venue', 'guest', 'company', 'driver', 'renter')),
  unit_price NUMERIC NOT NULL DEFAULT 0,
  vendor_cost NUMERIC DEFAULT NULL,
  markup NUMERIC DEFAULT NULL,
  billing_cadence TEXT DEFAULT 'per_event' CHECK (billing_cadence IN ('per_event', 'monthly', 'annual')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Industry Packages: bundled pricing by vertical
CREATE TABLE public.industry_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  target_audience TEXT,
  saas_monthly_fee NUMERIC DEFAULT NULL,
  saas_annual_fee NUMERIC DEFAULT NULL,
  included_events TEXT[] DEFAULT '{}',
  volume_tiers JSONB DEFAULT '[]',
  payout_cadence_options TEXT[] DEFAULT ARRAY['nightly', 'weekly'],
  payout_cadence_default TEXT DEFAULT 'nightly',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contract Templates
CREATE TABLE public.contract_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES public.industry_packages(id),
  template_name TEXT NOT NULL,
  template_content TEXT,
  contract_terms JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Statement Templates
CREATE TABLE public.statement_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES public.industry_packages(id),
  template_name TEXT NOT NULL,
  line_item_config JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statement_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pricing_catalog
CREATE POLICY "Admins can manage pricing catalog" ON public.pricing_catalog FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role)) WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));
CREATE POLICY "Public can read active catalog items" ON public.pricing_catalog FOR SELECT USING (is_active = true);

-- RLS Policies for industry_packages
CREATE POLICY "Admins can manage industry packages" ON public.industry_packages FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role)) WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));
CREATE POLICY "Public can read active packages" ON public.industry_packages FOR SELECT USING (is_active = true);

-- RLS Policies for contract_templates
CREATE POLICY "Admins can manage contract templates" ON public.contract_templates FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role)) WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- RLS Policies for statement_templates
CREATE POLICY "Admins can manage statement templates" ON public.statement_templates FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role)) WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_pricing_catalog_updated_at BEFORE UPDATE ON public.pricing_catalog FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_industry_packages_updated_at BEFORE UPDATE ON public.industry_packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contract_templates_updated_at BEFORE UPDATE ON public.contract_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_statement_templates_updated_at BEFORE UPDATE ON public.statement_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert atomic billable events into pricing_catalog
INSERT INTO public.pricing_catalog (event_code, event_name, description, payer, unit_price, vendor_cost, markup) VALUES
  ('SCAN_EVENT_DOOR', 'Door Entry Scan', 'Authorization scan at venue entry', 'venue', 0.20, NULL, NULL),
  ('SCAN_EVENT_PURCHASE', 'Purchase Scan', 'Authorization scan for in-venue purchase', 'venue', 0.20, NULL, NULL),
  ('ID_VERIFICATION_STANDARD', 'ID Verification (Standard)', 'Footprint standard identity verification', 'venue', 2.00, 1.50, 0.50),
  ('ID_VERIFICATION_PREMIUM', 'ID Verification (Premium)', 'Footprint premium with watchlist screening', 'venue', 4.00, 3.00, 1.00),
  ('DRIVER_FACE_CHECK_DEEP', 'Driver Deep Face Check', 'Footprint deep facial verification for drivers', 'company', 2.50, 1.90, 0.60),
  ('LAB_TEST_ORDER', 'Lab Test Order', 'Laboratory test order with orchestration', 'company', 0, NULL, NULL),
  ('INSTANT_LOAD_FEE', 'Instant Load Fee', 'Guest convenience fee for instant wallet funding via card', 'guest', 3.95, NULL, NULL);

-- Insert industry packages
INSERT INTO public.industry_packages (package_key, display_name, description, target_audience, saas_monthly_fee, included_events, volume_tiers, payout_cadence_options, payout_cadence_default, sort_order) VALUES
  ('nightlife_events', 'Nightlife & Events', 'Clubs, bars, festivals, corporate events', 'Venue owners, event promoters', NULL, 
   ARRAY['SCAN_EVENT_DOOR', 'SCAN_EVENT_PURCHASE', 'ID_VERIFICATION_STANDARD', 'ID_VERIFICATION_PREMIUM', 'INSTANT_LOAD_FEE'],
   '[]'::jsonb,
   ARRAY['nightly', 'weekly'], 'nightly', 1),
  
  ('stadiums_arenas', 'Stadiums & Arenas', 'High-volume venues with 10,000+ attendees', 'Stadium operators, arena management', NULL,
   ARRAY['SCAN_EVENT_DOOR', 'SCAN_EVENT_PURCHASE', 'ID_VERIFICATION_STANDARD', 'ID_VERIFICATION_PREMIUM'],
   '[{"tier": 1, "label": "First 50,000 scans/month", "max_scans": 50000, "per_scan_fee": 0.10}, {"tier": 2, "label": "50,001 - 200,000 scans/month", "max_scans": 200000, "per_scan_fee": 0.06}, {"tier": 3, "label": "200,001+ scans/month", "max_scans": null, "per_scan_fee": 0.03}]'::jsonb,
   ARRAY['nightly', 'weekly'], 'nightly', 2),
  
  ('transportation', 'Transportation', 'Fleet operators and driver verification', 'Rideshare companies, fleet managers', NULL,
   ARRAY['DRIVER_FACE_CHECK_DEEP', 'LAB_TEST_ORDER'],
   '[]'::jsonb,
   ARRAY['monthly'], 'monthly', 3),
  
  ('rentals', 'Rentals', 'Car, exotic, boat rentals with identity verification', 'Rental companies, luxury vehicle operators', NULL,
   ARRAY['ID_VERIFICATION_STANDARD', 'ID_VERIFICATION_PREMIUM', 'SCAN_EVENT_PURCHASE', 'INSTANT_LOAD_FEE'],
   '[]'::jsonb,
   ARRAY['nightly', 'weekly'], 'weekly', 4);

-- Insert statement templates for each package
INSERT INTO public.statement_templates (package_id, template_name, line_item_config) VALUES
  ((SELECT id FROM public.industry_packages WHERE package_key = 'nightlife_events'), 'Nightlife Statement', 
   '[{"code": "SCAN_EVENT_DOOR", "label": "Door Scans"}, {"code": "SCAN_EVENT_PURCHASE", "label": "Purchase Scans"}, {"code": "ID_VERIFICATION_STANDARD", "label": "ID Verifications (Standard)"}, {"code": "ID_VERIFICATION_PREMIUM", "label": "ID Verifications (Premium)"}, {"code": "promoter_payouts", "label": "Promoter Payouts"}, {"code": "refunds_voids", "label": "Refunds & Voids"}]'::jsonb),
  
  ((SELECT id FROM public.industry_packages WHERE package_key = 'stadiums_arenas'), 'Stadium Statement',
   '[{"code": "SCAN_EVENT_DOOR", "label": "Entry Scans (Tiered)"}, {"code": "SCAN_EVENT_PURCHASE", "label": "Purchase Scans (Tiered)"}, {"code": "ID_VERIFICATION_STANDARD", "label": "Age/ID Verifications"}, {"code": "ID_VERIFICATION_PREMIUM", "label": "Watchlist Checks"}, {"code": "refunds_voids", "label": "Refunds & Voids"}]'::jsonb),
  
  ((SELECT id FROM public.industry_packages WHERE package_key = 'transportation'), 'Fleet Statement',
   '[{"code": "DRIVER_FACE_CHECK_DEEP", "label": "Driver Face Checks"}, {"code": "LAB_TEST_ORDER", "label": "Lab Tests"}, {"code": "saas_fee", "label": "Monthly Platform Fee"}]'::jsonb),
  
  ((SELECT id FROM public.industry_packages WHERE package_key = 'rentals'), 'Rental Statement',
   '[{"code": "ID_VERIFICATION_STANDARD", "label": "Rental Verifications"}, {"code": "ID_VERIFICATION_PREMIUM", "label": "Premium Verifications"}, {"code": "SCAN_EVENT_PURCHASE", "label": "Payment Scans"}, {"code": "refunds_voids", "label": "Refunds & Voids"}]'::jsonb);