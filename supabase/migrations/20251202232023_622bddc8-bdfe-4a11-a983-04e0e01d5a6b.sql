-- Create enum for venue categories
CREATE TYPE public.venue_category AS ENUM ('Nightlife', 'Gentlemen', 'Lifestyle');

-- Create partner_venues table
CREATE TABLE public.partner_venues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_name TEXT NOT NULL,
  city TEXT NOT NULL,
  category venue_category NOT NULL,
  status TEXT NOT NULL DEFAULT 'Target',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_checkins table
CREATE TABLE public.user_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_checkins ENABLE ROW LEVEL SECURITY;

-- RLS for partner_venues: everyone can view, admins can manage
CREATE POLICY "Everyone can view venues"
ON public.partner_venues FOR SELECT
USING (true);

CREATE POLICY "Admins can manage venues"
ON public.partner_venues FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- RLS for user_checkins: users manage their own, admins view all
CREATE POLICY "Users can view their own checkins"
ON public.user_checkins FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checkins"
ON public.user_checkins FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all checkins"
ON public.user_checkins FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Create indexes
CREATE INDEX idx_user_checkins_user_id ON public.user_checkins(user_id);
CREATE INDEX idx_user_checkins_venue_id ON public.user_checkins(venue_id);
CREATE INDEX idx_partner_venues_city ON public.partner_venues(city);

-- Create trigger for updated_at
CREATE TRIGGER update_partner_venues_updated_at
BEFORE UPDATE ON public.partner_venues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Pre-fill venue data
INSERT INTO public.partner_venues (venue_name, city, category) VALUES
  ('E11EVEN', 'Miami', 'Gentlemen'),
  ('Club Space', 'Miami', 'Nightlife'),
  ('Tootsie''s Cabaret', 'Miami', 'Gentlemen'),
  ('Scarlett''s Cabaret', 'Hallandale', 'Gentlemen'),
  ('LIV', 'Miami', 'Nightlife'),
  ('Rick''s Cabaret', 'New York', 'Gentlemen'),
  ('Sapphire', 'Las Vegas', 'Gentlemen'),
  ('Spearmint Rhino', 'Las Vegas', 'Gentlemen'),
  ('Avant Gardner', 'New York', 'Nightlife'),
  ('Trapeze', 'Fort Lauderdale', 'Lifestyle');