-- Add country and gm_email columns to partner_venues
ALTER TABLE public.partner_venues 
ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT 'USA',
ADD COLUMN IF NOT EXISTS gm_email text;

-- Create index for country filtering
CREATE INDEX IF NOT EXISTS idx_partner_venues_country ON public.partner_venues(country);