-- Add vices column to profiles table to store user vice preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vices text[] DEFAULT '{}';

COMMENT ON COLUMN profiles.vices IS 'User selected vices preferences: Drinking, Party enhancers, Don''t drink at all, No enhancers at all';