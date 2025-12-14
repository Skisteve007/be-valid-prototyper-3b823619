-- Create page_views table for tracking visitor analytics
CREATE TABLE public.page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  page_path text NOT NULL DEFAULT '/',
  referrer text,
  user_agent text,
  country text,
  city text,
  region text,
  session_id text,
  device_type text,
  browser text,
  os text
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views (anonymous tracking)
CREATE POLICY "Anyone can log page views"
ON public.page_views
FOR INSERT
WITH CHECK (true);

-- Only admins can view analytics
CREATE POLICY "Admins can view page analytics"
ON public.page_views
FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Create index for faster counting and date filtering
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX idx_page_views_page_path ON public.page_views(page_path);
CREATE INDEX idx_page_views_country ON public.page_views(country);

-- Add to realtime for live counter updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;