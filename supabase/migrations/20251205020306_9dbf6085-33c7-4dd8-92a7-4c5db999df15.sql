-- Add sharing toggle fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS sharing_interests_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sharing_vices_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sharing_orientation_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sharing_social_enabled boolean DEFAULT false;