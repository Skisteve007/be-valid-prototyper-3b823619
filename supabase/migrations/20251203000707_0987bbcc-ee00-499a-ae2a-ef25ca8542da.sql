-- Create user_agreements table for liability waivers
CREATE TABLE public.user_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  waiver_version TEXT NOT NULL DEFAULT '1.0',
  signed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX idx_user_agreements_user_id ON public.user_agreements(user_id);
CREATE INDEX idx_user_agreements_version ON public.user_agreements(waiver_version);

-- Enable Row Level Security
ALTER TABLE public.user_agreements ENABLE ROW LEVEL SECURITY;

-- Users can view their own agreements
CREATE POLICY "Users can view their own agreements" 
ON public.user_agreements 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can sign agreements
CREATE POLICY "Users can sign agreements" 
ON public.user_agreements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Admins can view all agreements (for audit trail)
CREATE POLICY "Admins can view all agreements" 
ON public.user_agreements 
FOR SELECT 
USING (has_role(auth.uid(), 'administrator'::app_role));