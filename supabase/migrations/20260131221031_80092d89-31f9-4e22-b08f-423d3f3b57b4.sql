-- Add scan hardware deployment fields to ghost_pass_event_intakes
ALTER TABLE public.ghost_pass_event_intakes
ADD COLUMN IF NOT EXISTS num_countertop_units integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS countertop_locations text,
ADD COLUMN IF NOT EXISTS num_handheld_units integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS handheld_locations text;