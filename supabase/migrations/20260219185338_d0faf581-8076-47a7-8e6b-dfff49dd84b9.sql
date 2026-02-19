
-- Fix 1: Remove overly permissive public profiles policy and add token-gated access
DROP POLICY IF EXISTS "Profiles are viewable by QR code (public)" ON public.profiles;

-- Allow profile viewing via valid QR access token (token-gated, time-limited)
-- Drop first in case it exists from a partial run
DROP POLICY IF EXISTS "Profiles viewable with valid QR token" ON public.profiles;
CREATE POLICY "Profiles viewable with valid QR token"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.qr_access_tokens
      WHERE qr_access_tokens.profile_id = profiles.user_id
        AND qr_access_tokens.expires_at > now()
    )
  );

-- Fix 2: Create a private bucket for health documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('health-documents', 'health-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policy: users can upload their own health documents
DROP POLICY IF EXISTS "Users can upload their own health documents" ON storage.objects;
CREATE POLICY "Users can upload their own health documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'health-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- RLS policy: users can view their own health documents
DROP POLICY IF EXISTS "Users can view their own health documents" ON storage.objects;
CREATE POLICY "Users can view their own health documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'health-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- RLS policy: admins can view all health documents
DROP POLICY IF EXISTS "Administrators can view all health documents" ON storage.objects;
CREATE POLICY "Administrators can view all health documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'health-documents'
    AND public.has_role(auth.uid(), 'administrator')
  );
