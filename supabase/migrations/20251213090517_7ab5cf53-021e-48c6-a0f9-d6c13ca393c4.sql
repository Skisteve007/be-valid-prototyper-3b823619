-- Add staff assignment and tracking fields to venue_stations
ALTER TABLE public.venue_stations 
ADD COLUMN IF NOT EXISTS assigned_staff_name text,
ADD COLUMN IF NOT EXISTS shift_assignment text,
ADD COLUMN IF NOT EXISTS assignment_number serial;