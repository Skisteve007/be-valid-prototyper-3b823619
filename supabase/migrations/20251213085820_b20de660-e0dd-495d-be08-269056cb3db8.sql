-- Create venue_stations table for tracking individual stations
CREATE TABLE public.venue_stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id) ON DELETE CASCADE,
  station_name TEXT NOT NULL,
  station_category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.venue_stations ENABLE ROW LEVEL SECURITY;

-- Policies for venue_stations
CREATE POLICY "Admins can manage all stations" ON public.venue_stations
  FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Venue operators can manage their stations" ON public.venue_stations
  FOR ALL USING (is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Service role can manage stations" ON public.venue_stations
  FOR INSERT WITH CHECK (true);

-- Add station_id to staff_shifts table
ALTER TABLE public.staff_shifts 
  ADD COLUMN station_id UUID REFERENCES public.venue_stations(id) ON DELETE SET NULL;

-- Add station_id to pos_transactions table  
ALTER TABLE public.pos_transactions
  ADD COLUMN station_id UUID REFERENCES public.venue_stations(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX idx_venue_stations_venue ON public.venue_stations(venue_id);
CREATE INDEX idx_staff_shifts_station ON public.staff_shifts(station_id);
CREATE INDEX idx_pos_transactions_station ON public.pos_transactions(station_id);

-- Enable realtime for venue_stations
ALTER PUBLICATION supabase_realtime ADD TABLE public.venue_stations;

-- Trigger for updated_at
CREATE TRIGGER update_venue_stations_updated_at
  BEFORE UPDATE ON public.venue_stations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();