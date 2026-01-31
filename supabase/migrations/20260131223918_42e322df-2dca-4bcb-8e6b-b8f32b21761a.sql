-- Add sensory cargo selection columns to ghost_pass_event_intakes
ALTER TABLE public.ghost_pass_event_intakes
ADD COLUMN IF NOT EXISTS sensory_cargoes_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sensory_audiology boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sensory_visual boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sensory_taste boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sensory_touch boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sensory_olfactory boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sensory_atmospheric boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sensory_notes text;