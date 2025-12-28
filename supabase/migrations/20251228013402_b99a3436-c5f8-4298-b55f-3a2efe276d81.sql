-- Drop existing permissive policies that allow too broad access
DROP POLICY IF EXISTS "Users can view their senate runs" ON public.synth_senate_runs;
DROP POLICY IF EXISTS "Admins can view all senate runs" ON public.synth_senate_runs;
DROP POLICY IF EXISTS "Service role can manage senate runs" ON public.synth_senate_runs;

-- Create restrictive policies that only allow admin access for SELECT
-- Only administrators can view senate runs (proprietary AI decision data)
CREATE POLICY "Only admins can view senate runs"
ON public.synth_senate_runs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'administrator'::app_role));

-- Service role can manage (for edge functions)
CREATE POLICY "Service role can manage senate runs"
ON public.synth_senate_runs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);