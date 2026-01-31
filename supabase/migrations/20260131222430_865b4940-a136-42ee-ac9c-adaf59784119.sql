-- Add access code allocation fields to ghost_pass_event_intakes
ALTER TABLE public.ghost_pass_event_intakes
ADD COLUMN IF NOT EXISTS num_management_access_codes integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS num_ownership_gateway_codes integer DEFAULT 1;