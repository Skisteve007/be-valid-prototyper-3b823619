-- Add Deep Screening Check for stadiums to pricing catalog
INSERT INTO public.pricing_catalog (event_code, event_name, payer, unit_price, vendor_cost, markup, billing_cadence, description)
VALUES (
  'DEEP_SCREENING_CHECK',
  'Deep Screening Check (Stadiums)',
  'venue',
  3.25,
  1.90,
  1.35,
  'per_event',
  'Deep identity + screening workflow for stadiums. Billed once per attendee per event. Range: $2.75-$3.50.'
)
ON CONFLICT (event_code) DO UPDATE SET
  event_name = EXCLUDED.event_name,
  unit_price = EXCLUDED.unit_price,
  vendor_cost = EXCLUDED.vendor_cost,
  markup = EXCLUDED.markup,
  description = EXCLUDED.description,
  updated_at = now();

-- Update stadiums_arenas package to include deep screening in included_events
UPDATE public.industry_packages 
SET included_events = ARRAY['SCAN_EVENT_DOOR', 'SCAN_EVENT_PURCHASE', 'DEEP_SCREENING_CHECK']::text[],
    updated_at = now()
WHERE package_key = 'stadiums_arenas';