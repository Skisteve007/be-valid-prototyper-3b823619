-- Add wearable identification integration field to ghost_pass_event_intakes
ALTER TABLE public.ghost_pass_event_intakes
ADD COLUMN IF NOT EXISTS wearable_integration_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS wearable_types text[] DEFAULT '{}';