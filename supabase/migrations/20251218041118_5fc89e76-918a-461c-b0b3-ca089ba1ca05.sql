-- Add age_policy column to partner_venues
ALTER TABLE public.partner_venues ADD COLUMN IF NOT EXISTS age_policy text DEFAULT '21+';

-- Create venue_settings table for manager configurations
CREATE TABLE IF NOT EXISTS public.venue_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES public.partner_venues(id) ON DELETE CASCADE NOT NULL UNIQUE,
  age_policy text DEFAULT '21+' CHECK (age_policy IN ('18+', '21+')),
  allow_door_to_collect_payment boolean DEFAULT false,
  offline_mode_enabled boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create venue_devices table for device pairing
CREATE TABLE IF NOT EXISTS public.venue_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES public.partner_venues(id) ON DELETE CASCADE NOT NULL,
  device_name text NOT NULL,
  device_type text DEFAULT 'scanner' CHECK (device_type IN ('scanner', 'manager', 'pos')),
  device_token text UNIQUE,
  is_online boolean DEFAULT false,
  last_seen_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create door_scan_log table for scan outcomes
CREATE TABLE IF NOT EXISTS public.door_scan_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES public.partner_venues(id) ON DELETE CASCADE NOT NULL,
  staff_user_id uuid,
  device_id uuid REFERENCES public.venue_devices(id),
  scanned_user_id uuid,
  scan_result text NOT NULL CHECK (scan_result IN ('allow', 'deny', 'manual_check')),
  deny_reason text,
  created_at timestamp with time zone DEFAULT now(),
  synced_at timestamp with time zone
);

-- Create manual_check_evidence table
CREATE TABLE IF NOT EXISTS public.manual_check_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_log_id uuid REFERENCES public.door_scan_log(id) ON DELETE CASCADE NOT NULL,
  photo_url text,
  notes text NOT NULL,
  final_decision text NOT NULL CHECK (final_decision IN ('allow', 'deny')),
  evidence_confirmed boolean DEFAULT false,
  staff_user_id uuid,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.venue_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.door_scan_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_check_evidence ENABLE ROW LEVEL SECURITY;

-- RLS policies for venue_settings
CREATE POLICY "Venue operators can manage their venue settings"
ON public.venue_settings FOR ALL
USING (public.is_venue_operator(auth.uid(), venue_id));

-- RLS policies for venue_devices
CREATE POLICY "Venue operators can manage their devices"
ON public.venue_devices FOR ALL
USING (public.is_venue_operator(auth.uid(), venue_id));

-- RLS policies for door_scan_log
CREATE POLICY "Venue operators can view their scan logs"
ON public.door_scan_log FOR SELECT
USING (public.is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Authenticated users can insert scan logs"
ON public.door_scan_log FOR INSERT
TO authenticated
WITH CHECK (true);

-- RLS policies for manual_check_evidence
CREATE POLICY "Venue operators can view manual check evidence"
ON public.manual_check_evidence FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.door_scan_log dsl
  WHERE dsl.id = manual_check_evidence.scan_log_id
  AND public.is_venue_operator(auth.uid(), dsl.venue_id)
));

CREATE POLICY "Authenticated users can insert evidence"
ON public.manual_check_evidence FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add realtime for devices
ALTER PUBLICATION supabase_realtime ADD TABLE public.venue_devices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.door_scan_log;