-- Add RESTRICTIVE policy to explicitly deny access to non-owners and non-admins
CREATE POLICY "Only owners and admins can view certifications (restrictive)"
ON public.certifications
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR has_role(auth.uid(), 'administrator'::app_role)
);