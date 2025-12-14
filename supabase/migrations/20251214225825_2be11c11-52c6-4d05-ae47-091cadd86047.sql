-- Create investor_leads table for funding tranche interest
CREATE TABLE public.investor_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin_url TEXT,
  accredited_confirmed BOOLEAN NOT NULL DEFAULT false,
  tranche_interest TEXT NOT NULL DEFAULT 'launch_round',
  utm_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.investor_leads ENABLE ROW LEVEL SECURITY;

-- Only admins can view all leads
CREATE POLICY "Admins can view all investor leads"
ON public.investor_leads
FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Anyone can submit a lead (INSERT only)
CREATE POLICY "Anyone can submit investor lead"
ON public.investor_leads
FOR INSERT
WITH CHECK (true);

-- Admins can manage leads
CREATE POLICY "Admins can manage investor leads"
ON public.investor_leads
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role));