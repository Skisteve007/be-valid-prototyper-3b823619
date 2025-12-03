-- Add full_name and email columns to affiliates table for easier admin access
ALTER TABLE public.affiliates 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS email text;

-- Add index for admin searching
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON public.affiliates(status);
CREATE INDEX IF NOT EXISTS idx_affiliates_full_name ON public.affiliates(full_name);