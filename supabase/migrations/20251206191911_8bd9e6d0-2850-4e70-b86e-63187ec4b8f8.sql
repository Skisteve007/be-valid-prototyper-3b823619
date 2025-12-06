-- Add per-category sharing toggles for preferences
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS sharing_social_dynamic_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sharing_relationship_style_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sharing_sensory_prefs_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sharing_specific_activities_enabled boolean DEFAULT false;