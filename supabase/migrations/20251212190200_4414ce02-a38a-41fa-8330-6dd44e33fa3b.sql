-- Add IP address column to email_verification_tokens for audit trail
ALTER TABLE public.email_verification_tokens 
ADD COLUMN IF NOT EXISTS ip_address text,
ADD COLUMN IF NOT EXISTS user_agent text;