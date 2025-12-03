-- Create workplace_roster table to link employees to venues/employers
CREATE TABLE public.workplace_roster (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id uuid NOT NULL REFERENCES public.partner_venues(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_added timestamp with time zone NOT NULL DEFAULT now(),
  status text DEFAULT 'active',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(venue_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.workplace_roster ENABLE ROW LEVEL SECURITY;

-- Venue managers (admins) can view their roster
CREATE POLICY "Admins can manage all rosters"
ON public.workplace_roster
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Users can view if they are on a roster
CREATE POLICY "Users can view their own roster entries"
ON public.workplace_roster
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert roster entries (for QR scan linking)
CREATE POLICY "System can insert roster entries"
ON public.workplace_roster
FOR INSERT
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_workplace_roster_updated_at
BEFORE UPDATE ON public.workplace_roster
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.workplace_roster IS 'Links employees to workplace venues for real-time status monitoring';