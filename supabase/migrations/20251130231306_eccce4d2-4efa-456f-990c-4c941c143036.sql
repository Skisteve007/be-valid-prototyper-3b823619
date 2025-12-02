-- Add email_shareable column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN email_shareable BOOLEAN DEFAULT false;