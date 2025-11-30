-- Add RLS policy to allow users to delete their own certifications
CREATE POLICY "Users can delete their own certifications"
ON public.certifications
FOR DELETE
USING (auth.uid() = user_id);