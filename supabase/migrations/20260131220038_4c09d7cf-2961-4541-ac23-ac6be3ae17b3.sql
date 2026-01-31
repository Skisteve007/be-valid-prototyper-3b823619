-- Add interior location and outside vendor columns to ghost_pass_event_intakes
ALTER TABLE public.ghost_pass_event_intakes
ADD COLUMN IF NOT EXISTS interior_locations text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS num_bar_locations integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS num_server_stations integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS num_table_service_areas integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS num_food_concessions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS num_merch_locations integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS has_outside_vendors boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS outside_vendor_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS outside_vendor_types text[] DEFAULT '{}';