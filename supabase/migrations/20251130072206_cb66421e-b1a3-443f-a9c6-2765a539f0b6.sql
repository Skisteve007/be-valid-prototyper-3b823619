-- Drop the overly permissive policy that allows all authenticated users to view all profiles
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Now only these policies remain:
-- 1. Users can view their own profile (auth.uid() = user_id)
-- 2. Admins can view all profiles (has_role check)
-- This ensures profile data is only accessible to the owner or administrators