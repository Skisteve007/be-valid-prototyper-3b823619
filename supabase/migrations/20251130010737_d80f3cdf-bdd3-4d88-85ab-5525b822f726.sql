-- Create storage bucket for sponsor logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('sponsor-logos', 'sponsor-logos', true);

-- Allow admins to upload sponsor logos
CREATE POLICY "Admins can upload sponsor logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'sponsor-logos' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'administrator'
  )
);

-- Allow admins to update sponsor logos
CREATE POLICY "Admins can update sponsor logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'sponsor-logos' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'administrator'
  )
);

-- Allow admins to delete sponsor logos
CREATE POLICY "Admins can delete sponsor logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'sponsor-logos' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'administrator'
  )
);

-- Allow everyone to view sponsor logos
CREATE POLICY "Anyone can view sponsor logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'sponsor-logos');