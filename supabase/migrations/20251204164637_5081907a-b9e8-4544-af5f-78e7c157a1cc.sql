-- Create marketing-videos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketing-videos', 'marketing-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload
CREATE POLICY "Admins can upload marketing videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'marketing-videos' AND
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'administrator')
);

-- Allow public read access
CREATE POLICY "Public can view marketing videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'marketing-videos');

-- Allow admins to delete
CREATE POLICY "Admins can delete marketing videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'marketing-videos' AND
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'administrator')
);

-- Add uploaded_video_url column to marketing_videos table
ALTER TABLE public.marketing_videos
ADD COLUMN IF NOT EXISTS uploaded_video_url TEXT;