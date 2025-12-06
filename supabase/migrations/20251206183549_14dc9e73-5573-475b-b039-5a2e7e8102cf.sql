-- Create social embed analytics table for tracking embed events
CREATE TABLE public.social_embed_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'embed_copy',
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_embed_analytics ENABLE ROW LEVEL SECURITY;

-- Users can view their own analytics
CREATE POLICY "Users can view their own embed analytics"
ON public.social_embed_analytics
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own embed events
CREATE POLICY "Users can insert their own embed events"
ON public.social_embed_analytics
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Service role can insert/update (for edge function)
CREATE POLICY "Service role can manage all embed analytics"
ON public.social_embed_analytics
FOR ALL
USING (true)
WITH CHECK (true);

-- Admins can view all analytics
CREATE POLICY "Admins can view all embed analytics"
ON public.social_embed_analytics
FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Create index for faster queries
CREATE INDEX idx_social_embed_analytics_user_id ON public.social_embed_analytics(user_id);
CREATE INDEX idx_social_embed_analytics_platform ON public.social_embed_analytics(platform);
CREATE INDEX idx_social_embed_analytics_created_at ON public.social_embed_analytics(created_at);

-- Add trigger for updated_at
CREATE TRIGGER update_social_embed_analytics_updated_at
BEFORE UPDATE ON public.social_embed_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();