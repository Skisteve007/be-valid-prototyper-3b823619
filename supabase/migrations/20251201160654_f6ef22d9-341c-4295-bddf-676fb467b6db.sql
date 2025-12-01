-- Add lab certification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS lab_certified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS lab_logo_url text;