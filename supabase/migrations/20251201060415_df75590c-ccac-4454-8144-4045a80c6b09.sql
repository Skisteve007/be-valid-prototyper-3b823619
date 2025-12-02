-- Create marketing videos table
CREATE TABLE public.marketing_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_name TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketing_videos ENABLE ROW LEVEL SECURITY;

-- Admins can manage marketing videos
CREATE POLICY "Admins can manage marketing videos"
ON public.marketing_videos
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_marketing_videos_updated_at
BEFORE UPDATE ON public.marketing_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert placeholder video
INSERT INTO public.marketing_videos (internal_name, youtube_id, is_active) VALUES
('Elegant Entry (Demo)', 'dQw4w9WgXcQ', true);