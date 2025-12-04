-- Add discount code tracking to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS signup_discount_code TEXT,
ADD COLUMN IF NOT EXISTS referred_by_code TEXT;

-- Create a table to track discount code usage and analytics
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL DEFAULT 10,
  usage_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Admins can manage discount codes
CREATE POLICY "Admins can manage discount codes"
ON public.discount_codes FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Everyone can view active discount codes (for validation)
CREATE POLICY "Anyone can view active discount codes"
ON public.discount_codes FOR SELECT
USING (is_active = true);

-- Insert the default discount code
INSERT INTO public.discount_codes (code, discount_percent, is_active)
VALUES ('CLEANFRIEND10', 10, true)
ON CONFLICT (code) DO NOTHING;

-- Create function to increment discount code usage
CREATE OR REPLACE FUNCTION public.increment_discount_usage(_code TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.discount_codes 
  SET usage_count = usage_count + 1, updated_at = now()
  WHERE UPPER(code) = UPPER(_code);
END;
$$;