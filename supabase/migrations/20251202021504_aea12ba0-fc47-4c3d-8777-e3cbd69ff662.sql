
-- Create the sponsor-logos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('sponsor-logos', 'sponsor-logos', true);

-- Allow authenticated users to upload sponsor logos
CREATE POLICY "Authenticated users can upload sponsor logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sponsor-logos');

-- Allow authenticated users to update sponsor logos
CREATE POLICY "Authenticated users can update sponsor logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'sponsor-logos');

-- Allow everyone to view sponsor logos (public bucket)
CREATE POLICY "Public can view sponsor logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'sponsor-logos');

-- Allow authenticated users to delete sponsor logos
CREATE POLICY "Authenticated users can delete sponsor logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'sponsor-logos');
