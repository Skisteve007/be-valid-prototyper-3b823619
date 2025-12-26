
-- Create a function to check if the current user is Steve (owner)
CREATE OR REPLACE FUNCTION public.is_steve_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
      AND (
        email = 'steve@bevalid.app' 
        OR email = 'sgrillocce@gmail.com'
      )
  )
$$;

-- Update RLS policies for think_tank_entries to restrict to Steve only
DROP POLICY IF EXISTS "Admins can manage think tank entries" ON public.think_tank_entries;
DROP POLICY IF EXISTS "Public can view published entries" ON public.think_tank_entries;

CREATE POLICY "Only Steve can manage think tank entries"
ON public.think_tank_entries
FOR ALL
USING (is_steve_owner())
WITH CHECK (is_steve_owner());

-- Update synth_policies to Steve-only for sensitive operations
DROP POLICY IF EXISTS "Admins can update policies" ON public.synth_policies;

CREATE POLICY "Only Steve can update synth policies"
ON public.synth_policies
FOR UPDATE
USING (is_steve_owner());

-- Update senate_messages to Steve-only
DROP POLICY IF EXISTS "Admins can view all senate messages" ON public.senate_messages;

CREATE POLICY "Only Steve can view senate messages"
ON public.senate_messages
FOR SELECT
USING (is_steve_owner());

-- Update senate_conflicts to Steve-only  
DROP POLICY IF EXISTS "Admins can view all senate conflicts" ON public.senate_conflicts;

CREATE POLICY "Only Steve can view senate conflicts"
ON public.senate_conflicts
FOR SELECT
USING (is_steve_owner());
