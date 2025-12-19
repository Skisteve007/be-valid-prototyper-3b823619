-- Create operator verification enum
CREATE TYPE operator_verification_type AS ENUM ('self_entered', 'pin', 'biometric_future');

-- Create operator event type enum
CREATE TYPE operator_event_type AS ENUM (
  'STATION_SWITCH',
  'SHIFT_START',
  'SHIFT_END',
  'SCAN_PERFORMED',
  'STATION_LOGIN',
  'STATION_LOGOUT'
);

-- Create operator_events table for station switch logging
CREATE TABLE public.operator_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  venue_id UUID REFERENCES public.partner_venues(id),
  device_id UUID REFERENCES public.venue_devices(id),
  event_type operator_event_type NOT NULL,
  from_station_label TEXT,
  to_station_label TEXT,
  current_station_label TEXT,
  operator_label TEXT NOT NULL,
  operator_verification operator_verification_type NOT NULL DEFAULT 'self_entered',
  scan_log_id UUID REFERENCES public.door_scan_log(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.operator_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all operator events"
  ON public.operator_events FOR SELECT
  USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Venue operators can view their venue events"
  ON public.operator_events FOR SELECT
  USING (is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Service role can insert operator events"
  ON public.operator_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can manage operator events"
  ON public.operator_events FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add index for fast lookups
CREATE INDEX idx_operator_events_venue_timestamp 
  ON public.operator_events(venue_id, timestamp DESC);

CREATE INDEX idx_operator_events_operator 
  ON public.operator_events(operator_label, timestamp DESC);

CREATE INDEX idx_operator_events_station 
  ON public.operator_events(current_station_label, timestamp DESC);

-- Add operator tracking columns to door_scan_log if not exists
ALTER TABLE public.door_scan_log 
  ADD COLUMN IF NOT EXISTS station_label TEXT,
  ADD COLUMN IF NOT EXISTS operator_label TEXT;