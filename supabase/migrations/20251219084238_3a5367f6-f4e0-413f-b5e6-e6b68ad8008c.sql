-- Update DRIVER_FACE_CHECK_DEEP to $3.25 (from $2.50) with range $2.75-$3.50
UPDATE public.pricing_catalog 
SET unit_price = 3.25,
    vendor_cost = 1.90,
    markup = 1.35,
    description = 'Deep facial verification for drivers. Default $3.25, range $2.75-$3.50. Billed per successful check.',
    updated_at = now()
WHERE event_code = 'DRIVER_FACE_CHECK_DEEP';

-- Add onboarding events to pricing catalog (using per_event for billing_cadence)
INSERT INTO public.pricing_catalog (event_code, event_name, payer, unit_price, vendor_cost, markup, billing_cadence, description)
VALUES 
  ('DRIVER_ONBOARDING_FEE', 'Driver Onboarding Orchestration', 'company', 25.00, 0, 25.00, 'per_event', 'Per-driver orchestration fee for onboarding workflow.'),
  ('IDV_DRIVER_STANDARD', 'Driver IDV Standard', 'company', 3.00, 1.50, 1.50, 'per_event', 'Standard ID verification for driver onboarding.'),
  ('DRUG_TEST_LAB', 'Drug Test Lab Order', 'company', 45.00, 35.00, 10.00, 'per_event', 'Drug test order pass-through + orchestration markup.'),
  ('MVR_BACKGROUND', 'MVR / Background Check', 'company', 15.00, 10.00, 5.00, 'per_event', 'Motor Vehicle Record / background check (optional).')
ON CONFLICT (event_code) DO UPDATE SET
  event_name = EXCLUDED.event_name,
  unit_price = EXCLUDED.unit_price,
  vendor_cost = EXCLUDED.vendor_cost,
  markup = EXCLUDED.markup,
  description = EXCLUDED.description,
  updated_at = now();

-- Update transportation package with driver-based tiers
UPDATE public.industry_packages 
SET 
  description = 'Fleet/driver management with active driver-based pricing tiers. Deep face checks, onboarding orchestration, lab tests.',
  target_audience = 'Transportation companies, fleet operators, logistics',
  included_events = ARRAY['DRIVER_FACE_CHECK_DEEP', 'DRIVER_ONBOARDING_FEE', 'IDV_DRIVER_STANDARD', 'DRUG_TEST_LAB', 'MVR_BACKGROUND']::text[],
  volume_tiers = '[
    {"tier": "T1", "min_drivers": 1, "max_drivers": 10, "saas_monthly": 499, "included_checks": 10, "overage_rate": 3.25},
    {"tier": "T2", "min_drivers": 11, "max_drivers": 20, "saas_monthly": 999, "included_checks": 20, "overage_rate": 3.25},
    {"tier": "T3", "min_drivers": 21, "max_drivers": 50, "saas_monthly": 1999, "included_checks": 50, "overage_rate": 3.25},
    {"tier": "T4", "min_drivers": 51, "max_drivers": 100, "saas_monthly": 3499, "included_checks": 100, "overage_rate": 3.25},
    {"tier": "T5", "min_drivers": 101, "max_drivers": null, "saas_monthly": null, "included_checks": null, "overage_rate": null, "enterprise": true}
  ]'::jsonb,
  payout_cadence_options = ARRAY['monthly']::text[],
  payout_cadence_default = 'monthly',
  updated_at = now()
WHERE package_key = 'transportation';

-- Update statement template for transportation
UPDATE public.statement_templates
SET line_item_config = '[
  {"label": "SaaS Fee (Active Driver Tier)", "event_code": null, "type": "saas"},
  {"label": "Included Deep Face Checks", "event_code": "DRIVER_FACE_CHECK_DEEP", "type": "included"},
  {"label": "Overage Deep Face Checks", "event_code": "DRIVER_FACE_CHECK_DEEP", "type": "overage"},
  {"label": "Driver Onboarding Orchestration", "event_code": "DRIVER_ONBOARDING_FEE", "type": "usage"},
  {"label": "Driver IDV", "event_code": "IDV_DRIVER_STANDARD", "type": "usage"},
  {"label": "Drug Test Lab Orders", "event_code": "DRUG_TEST_LAB", "type": "usage"},
  {"label": "MVR / Background (Optional)", "event_code": "MVR_BACKGROUND", "type": "usage"}
]'::jsonb,
    updated_at = now()
WHERE package_id = (SELECT id FROM public.industry_packages WHERE package_key = 'transportation');