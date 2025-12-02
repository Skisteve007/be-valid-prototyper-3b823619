-- Drop the dangerous public SELECT policy that exposes all tokens
DROP POLICY IF EXISTS "Anyone can view valid tokens" ON public.qr_access_tokens;

-- Add a restrictive policy: users can only view tokens they created for their own profiles
CREATE POLICY "Users can view their own profile tokens"
ON public.qr_access_tokens
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = qr_access_tokens.profile_id
      AND profiles.user_id = auth.uid()
  )
);