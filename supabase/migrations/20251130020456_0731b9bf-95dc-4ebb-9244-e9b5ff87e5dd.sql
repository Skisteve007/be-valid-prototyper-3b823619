-- Create interest_tags table
CREATE TABLE public.interest_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.interest_tags ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read interest tags
CREATE POLICY "Everyone can view interest tags"
ON public.interest_tags
FOR SELECT
USING (true);

-- Only admins can manage interest tags
CREATE POLICY "Admins can manage interest tags"
ON public.interest_tags
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Add selected_interests column to profiles table to store user selections
ALTER TABLE public.profiles
ADD COLUMN selected_interests UUID[] DEFAULT '{}';

-- Insert dummy data
INSERT INTO public.interest_tags (category, label) VALUES
  ('Social Style', 'Quiet'),
  ('Social Style', 'Loud'),
  ('Events', 'Indoor'),
  ('Events', 'Outdoor');