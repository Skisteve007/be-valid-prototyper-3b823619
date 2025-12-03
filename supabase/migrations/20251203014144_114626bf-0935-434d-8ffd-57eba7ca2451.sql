-- Add custom_logo_url column to partner_venues for Quick Branding feature
ALTER TABLE public.partner_venues 
ADD COLUMN IF NOT EXISTS custom_logo_url TEXT;