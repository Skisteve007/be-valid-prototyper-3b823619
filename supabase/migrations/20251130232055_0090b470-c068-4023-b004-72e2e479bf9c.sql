-- Add references_locked column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN references_locked BOOLEAN DEFAULT true;