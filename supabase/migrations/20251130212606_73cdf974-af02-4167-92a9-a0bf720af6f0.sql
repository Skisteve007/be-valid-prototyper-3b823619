-- =====================================================
-- CRITICAL SECURITY FIX: Storage Bucket RLS Policies
-- =====================================================

-- Drop ALL existing storage policies to start fresh
DO $$ 
BEGIN
  -- Drop profile-images policies
  DROP POLICY IF EXISTS "Users can upload their own profile images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own profile images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own profile images" ON storage.objects;
  DROP POLICY IF EXISTS "Profile images are publicly viewable" ON storage.objects;
  
  -- Drop sponsor-logos policies
  DROP POLICY IF EXISTS "Admins can upload sponsor logos" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can update sponsor logos" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can delete sponsor logos" ON storage.objects;
  DROP POLICY IF EXISTS "Sponsor logos are publicly viewable" ON storage.objects;
  
  -- Drop any other potential policies
  DROP POLICY IF EXISTS "Anyone can upload profile images" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can upload sponsor logos" ON storage.objects;
END $$;

-- =====================================================
-- PROFILE IMAGES BUCKET - User-uploaded profile photos
-- =====================================================

CREATE POLICY "Users can upload their own profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Profile images are publicly viewable"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');

-- =====================================================
-- SPONSOR LOGOS BUCKET - Admin-only uploads
-- =====================================================

CREATE POLICY "Admins can upload sponsor logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'sponsor-logos'
  AND has_role(auth.uid(), 'administrator'::app_role)
);

CREATE POLICY "Admins can update sponsor logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'sponsor-logos'
  AND has_role(auth.uid(), 'administrator'::app_role)
);

CREATE POLICY "Admins can delete sponsor logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'sponsor-logos'
  AND has_role(auth.uid(), 'administrator'::app_role)
);

CREATE POLICY "Sponsor logos are publicly viewable"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'sponsor-logos');

-- =====================================================
-- PERFORMANCE: Add critical database indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_member_id ON profiles(member_id);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_token ON qr_access_tokens(token);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_expires_at ON qr_access_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_sponsor_analytics_sponsor_id ON sponsor_analytics(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_analytics_viewed_at ON sponsor_analytics(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_role ON user_roles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- =====================================================
-- DATA CLEANUP: Remove expired QR tokens automatically
-- =====================================================

CREATE OR REPLACE FUNCTION cleanup_expired_qr_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM qr_access_tokens
  WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$;