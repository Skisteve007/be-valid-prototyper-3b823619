-- Create venue_operators table to link users to venues
CREATE TABLE IF NOT EXISTS public.venue_operators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id) ON DELETE CASCADE,
  access_level TEXT NOT NULL DEFAULT 'operator',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, venue_id)
);

-- Create venue_qr_scans table to track scans by venue
CREATE TABLE IF NOT EXISTS public.venue_qr_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id) ON DELETE CASCADE,
  scanned_user_id UUID REFERENCES public.profiles(user_id),
  scanned_member_id TEXT,
  scan_result TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  scanned_by_operator_id UUID,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.venue_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_qr_scans ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is venue operator
CREATE OR REPLACE FUNCTION public.is_venue_operator(_user_id UUID, _venue_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.venue_operators
    WHERE user_id = _user_id AND venue_id = _venue_id
  )
$$;

-- RLS Policies for venue_operators
-- Admins can manage all operators
CREATE POLICY "Admins can manage venue operators"
ON public.venue_operators FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Users can view their own operator assignments
CREATE POLICY "Users can view their operator assignments"
ON public.venue_operators FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for venue_qr_scans
-- Admins can view all scans
CREATE POLICY "Admins can view all venue scans"
ON public.venue_qr_scans FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Admins can insert scans
CREATE POLICY "Admins can insert venue scans"
ON public.venue_qr_scans FOR INSERT
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Venue operators can view only their venue's scans
CREATE POLICY "Venue operators can view their venue scans"
ON public.venue_qr_scans FOR SELECT
USING (is_venue_operator(auth.uid(), venue_id));

-- Venue operators can insert scans for their venue
CREATE POLICY "Venue operators can insert their venue scans"
ON public.venue_qr_scans FOR INSERT
WITH CHECK (is_venue_operator(auth.uid(), venue_id));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_venue_operators_user_id ON public.venue_operators(user_id);
CREATE INDEX IF NOT EXISTS idx_venue_operators_venue_id ON public.venue_operators(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_qr_scans_venue_id ON public.venue_qr_scans(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_qr_scans_scanned_at ON public.venue_qr_scans(scanned_at DESC);