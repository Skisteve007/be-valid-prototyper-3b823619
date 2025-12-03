-- Add new columns to affiliates table for KYC
ALTER TABLE public.affiliates 
ADD COLUMN IF NOT EXISTS id_front_url TEXT,
ADD COLUMN IF NOT EXISTS id_back_url TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS payout_method TEXT DEFAULT 'paypal',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Create storage bucket for affiliate documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('affiliate-docs', 'affiliate-docs', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for affiliate docs bucket (admin only access)
CREATE POLICY "Users can upload their own affiliate docs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'affiliate-docs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own affiliate docs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'affiliate-docs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all affiliate docs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'affiliate-docs' 
  AND public.has_role(auth.uid(), 'administrator')
);