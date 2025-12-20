-- Add SYNTH intake columns to profiles table
-- Identity
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_avatar_class_id text NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_avatar_color text NULL;

-- Location (optional)
-- country, state_region, city - using existing where_from and current_home_city for now
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_country text NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_state_region text NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_city text NULL;

-- Demographics (optional)
-- synth_age_range already exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_gender text NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_gender_self_describe text NULL;

-- Goals (optional)
-- synth_primary_goal and synth_domain_interest already exist

-- Experience level (years format)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_experience_level text NULL;

-- Leaderboard visibility
-- synth_leaderboard_visibility already exists, ensure default
ALTER TABLE public.profiles ALTER COLUMN synth_leaderboard_visibility SET DEFAULT 'anonymous';

-- Consent flags
-- synth_consent_scoring and synth_consent_analytics already exist

-- LLM Profile fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_llm_experience_level text NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_primary_assistant text NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_primary_assistant_other text NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_usage_frequency text NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_use_cases text[] NULL;

-- Intake completion tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS synth_intake_started_at timestamptz NULL;