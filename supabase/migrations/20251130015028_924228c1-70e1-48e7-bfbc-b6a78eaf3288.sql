-- Add user_interests field to profiles table to store lifestyle preferences
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS user_interests jsonb DEFAULT '{}'::jsonb;