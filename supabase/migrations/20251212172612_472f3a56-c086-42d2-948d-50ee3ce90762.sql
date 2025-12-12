-- Create email verification tokens table
CREATE TABLE public.email_verification_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Allow edge functions to manage tokens (service role)
CREATE POLICY "Service role can manage tokens"
ON public.email_verification_tokens
FOR ALL
USING (true)
WITH CHECK (true);

-- Add email_verified column to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Index for fast token lookups
CREATE INDEX idx_verification_tokens_token ON public.email_verification_tokens(token);
CREATE INDEX idx_verification_tokens_user ON public.email_verification_tokens(user_id);