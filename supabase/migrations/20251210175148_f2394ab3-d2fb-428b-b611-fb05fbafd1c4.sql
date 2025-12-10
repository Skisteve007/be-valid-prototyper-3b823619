-- Create IDV verifications table
CREATE TABLE public.idv_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('standard', 'vip')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'verified', 'failed', 'expired')),
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  verified_hash TEXT,
  document_type TEXT,
  verification_provider TEXT,
  verification_reference TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.idv_verifications ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_idv_verifications_user_id ON public.idv_verifications(user_id);
CREATE INDEX idx_idv_verifications_status ON public.idv_verifications(status);
CREATE INDEX idx_idv_verifications_stripe_session ON public.idv_verifications(stripe_session_id);

-- RLS Policies
CREATE POLICY "Users can view their own IDV records"
ON public.idv_verifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own IDV records"
ON public.idv_verifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update IDV records"
ON public.idv_verifications FOR UPDATE
USING (true);

CREATE POLICY "Admins can view all IDV records"
ON public.idv_verifications FOR SELECT
USING (has_role(auth.uid(), 'administrator'));

CREATE POLICY "Admins can update all IDV records"
ON public.idv_verifications FOR UPDATE
USING (has_role(auth.uid(), 'administrator'));

-- Add IDV status columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS idv_tier TEXT CHECK (idv_tier IN ('standard', 'vip')),
ADD COLUMN IF NOT EXISTS idv_status TEXT DEFAULT 'unverified' CHECK (idv_status IN ('unverified', 'pending', 'verified', 'failed')),
ADD COLUMN IF NOT EXISTS idv_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS idv_verified_hash TEXT;

-- Trigger for updated_at
CREATE TRIGGER update_idv_verifications_updated_at
BEFORE UPDATE ON public.idv_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();