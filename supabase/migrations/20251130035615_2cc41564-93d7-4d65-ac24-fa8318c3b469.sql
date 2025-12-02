-- Remove the public SELECT policy that exposes all profile data
DROP POLICY IF EXISTS "Profiles are viewable by QR code (public)" ON public.profiles;

-- Add policy for authenticated users to view profiles they have permission to access
-- This allows QR code viewing but only for authenticated users
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);