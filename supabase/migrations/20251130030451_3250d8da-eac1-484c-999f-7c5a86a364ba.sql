-- Add tier column to sponsors table
ALTER TABLE public.sponsors 
ADD COLUMN tier TEXT DEFAULT 'silver' CHECK (tier IN ('platinum', 'gold', 'silver'));

-- Create sponsor analytics table
CREATE TABLE public.sponsor_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click')),
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_ip TEXT,
  page_url TEXT
);

-- Enable RLS on sponsor_analytics
ALTER TABLE public.sponsor_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics events
CREATE POLICY "Anyone can insert analytics events"
ON public.sponsor_analytics
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can view analytics
CREATE POLICY "Admins can view all analytics"
ON public.sponsor_analytics
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'administrator'
  )
);

-- Create index for better query performance
CREATE INDEX idx_sponsor_analytics_sponsor_id ON public.sponsor_analytics(sponsor_id);
CREATE INDEX idx_sponsor_analytics_event_type ON public.sponsor_analytics(event_type);
CREATE INDEX idx_sponsor_analytics_viewed_at ON public.sponsor_analytics(viewed_at DESC);