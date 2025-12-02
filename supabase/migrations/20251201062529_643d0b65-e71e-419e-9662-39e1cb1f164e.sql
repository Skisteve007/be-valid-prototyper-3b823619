-- Create test_type enum
CREATE TYPE public.test_type AS ENUM ('STD_PANEL', 'TOX_10_PANEL');

-- Add test_type column to lab_orders
ALTER TABLE public.lab_orders 
ADD COLUMN test_type public.test_type NOT NULL DEFAULT 'STD_PANEL';

-- Add index for faster queries
CREATE INDEX idx_lab_orders_test_type ON public.lab_orders(test_type);

-- Create safety_certificates table for sharing
CREATE TABLE public.safety_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  test_type public.test_type NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.safety_certificates ENABLE ROW LEVEL SECURITY;

-- Users can create certificates for their own profile
CREATE POLICY "Users can create certificates for own profile"
ON public.safety_certificates
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = safety_certificates.profile_id 
    AND profiles.user_id = auth.uid()
  )
);

-- Users can view their own certificates
CREATE POLICY "Users can view their own certificates"
ON public.safety_certificates
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = safety_certificates.profile_id 
    AND profiles.user_id = auth.uid()
  )
);

-- Index for token lookups
CREATE INDEX idx_safety_certificates_token ON public.safety_certificates(token);
CREATE INDEX idx_safety_certificates_expires ON public.safety_certificates(expires_at);