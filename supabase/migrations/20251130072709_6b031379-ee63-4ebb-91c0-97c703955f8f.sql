-- Create table for QR code access tokens
CREATE TABLE public.qr_access_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  used_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.qr_access_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Users can create tokens for their own profile
CREATE POLICY "Users can create tokens for own profile"
ON public.qr_access_tokens
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = qr_access_tokens.profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- Policy: Anyone can view valid tokens (needed for validation)
CREATE POLICY "Anyone can view valid tokens"
ON public.qr_access_tokens
FOR SELECT
TO anon, authenticated
USING (expires_at > now() AND used_at IS NULL);

-- Policy: Token can be marked as used by anyone with the token
CREATE POLICY "Anyone can mark token as used"
ON public.qr_access_tokens
FOR UPDATE
TO anon, authenticated
USING (expires_at > now())
WITH CHECK (expires_at > now());

-- Create index for faster token lookups
CREATE INDEX idx_qr_tokens_token ON public.qr_access_tokens(token);
CREATE INDEX idx_qr_tokens_expires ON public.qr_access_tokens(expires_at);

-- Create function to check if valid token exists for profile
CREATE OR REPLACE FUNCTION public.has_valid_qr_token(_profile_id uuid, _token text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.qr_access_tokens
    WHERE profile_id = _profile_id
      AND token = _token
      AND expires_at > now()
  )
$$;

-- Add RLS policy to profiles table for QR token access
CREATE POLICY "Profiles viewable with valid QR token"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.qr_access_tokens
    WHERE qr_access_tokens.profile_id = profiles.id
      AND qr_access_tokens.expires_at > now()
  )
);