-- Create partner_beta_surveys table for storing partner feedback
CREATE TABLE public.partner_beta_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id TEXT,
  revenue_share_rating TEXT NOT NULL,
  zero_trust_liability TEXT NOT NULL,
  staff_efficiency TEXT NOT NULL,
  deployment_barrier TEXT,
  missing_feature TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_beta_surveys ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert survey responses (public form)
CREATE POLICY "Anyone can submit partner surveys"
ON public.partner_beta_surveys
FOR INSERT
WITH CHECK (true);

-- Only admins can view survey responses
CREATE POLICY "Admins can view partner surveys"
ON public.partner_beta_surveys
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'administrator'
  )
);