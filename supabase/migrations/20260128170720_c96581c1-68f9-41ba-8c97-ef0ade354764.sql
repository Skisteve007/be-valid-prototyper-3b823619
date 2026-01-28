-- Add share toggle columns to profiles table for Ghost Pass synchronization
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS share_id_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS share_funds_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS share_bio_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS share_tox_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS share_profile_enabled BOOLEAN DEFAULT false;