-- Add linkedin_handle column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS linkedin_handle TEXT;