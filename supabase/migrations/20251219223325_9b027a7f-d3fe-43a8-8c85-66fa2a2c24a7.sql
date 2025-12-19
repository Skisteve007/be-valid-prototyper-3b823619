-- Create enum for Think Tank categories
CREATE TYPE public.think_tank_category AS ENUM (
  'synth_standards',
  'playbooks',
  'decision_log',
  'templates'
);

-- Create Think Tank entries table
CREATE TABLE public.think_tank_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category think_tank_category NOT NULL,
  tags TEXT[] DEFAULT '{}',
  content TEXT NOT NULL,
  excerpt TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.think_tank_entries ENABLE ROW LEVEL SECURITY;

-- Public can read published entries
CREATE POLICY "Anyone can view published Think Tank entries"
ON public.think_tank_entries
FOR SELECT
USING (is_published = true);

-- Admins can do everything
CREATE POLICY "Admins can manage Think Tank entries"
ON public.think_tank_entries
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'administrator'))
WITH CHECK (public.has_role(auth.uid(), 'administrator'));

-- Create updated_at trigger
CREATE TRIGGER update_think_tank_entries_updated_at
BEFORE UPDATE ON public.think_tank_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for search
CREATE INDEX idx_think_tank_entries_search ON public.think_tank_entries 
USING GIN (to_tsvector('english', title || ' ' || content));

CREATE INDEX idx_think_tank_entries_category ON public.think_tank_entries(category);
CREATE INDEX idx_think_tank_entries_featured ON public.think_tank_entries(is_featured) WHERE is_featured = true;