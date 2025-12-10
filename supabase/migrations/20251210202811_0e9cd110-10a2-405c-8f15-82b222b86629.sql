-- Add vibe_metadata column to profiles table for storing user Vibe preferences
ALTER TABLE public.profiles
ADD COLUMN vibe_metadata JSONB DEFAULT '{}'::jsonb;