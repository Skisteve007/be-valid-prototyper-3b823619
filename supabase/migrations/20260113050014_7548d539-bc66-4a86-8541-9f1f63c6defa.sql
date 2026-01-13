-- Add Footprint liveness toggle to venue_settings
ALTER TABLE public.venue_settings 
ADD COLUMN IF NOT EXISTS require_liveness_on_scan boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS liveness_check_mode text DEFAULT 'off' CHECK (liveness_check_mode IN ('off', 'suspicious_only', 'all_scans'));