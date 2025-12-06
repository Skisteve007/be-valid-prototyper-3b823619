-- Create member_beta_surveys table for member feedback
CREATE TABLE public.member_beta_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ease_of_use TEXT NOT NULL,
  trust_in_security TEXT NOT NULL,
  qr_sharing_experience TEXT NOT NULL,
  missing_feature TEXT,
  recommendation_likelihood TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.member_beta_surveys ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert surveys (for anonymous feedback)
CREATE POLICY "Anyone can submit member beta surveys"
ON public.member_beta_surveys
FOR INSERT
WITH CHECK (true);

-- Only admins can view all surveys
CREATE POLICY "Admins can view all member beta surveys"
ON public.member_beta_surveys
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'administrator'
  )
);