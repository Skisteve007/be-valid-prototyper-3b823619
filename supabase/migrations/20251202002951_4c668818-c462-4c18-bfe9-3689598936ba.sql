-- Create campaign analytics table
CREATE TABLE IF NOT EXISTS public.campaign_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.marketing_templates(id) ON DELETE CASCADE,
  sent_count INTEGER DEFAULT 0 NOT NULL,
  delivered_count INTEGER DEFAULT 0 NOT NULL,
  open_count INTEGER DEFAULT 0 NOT NULL,
  click_count INTEGER DEFAULT 0 NOT NULL,
  bounce_count INTEGER DEFAULT 0 NOT NULL,
  unsubscribe_count INTEGER DEFAULT 0 NOT NULL,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(campaign_id)
);

-- Create email tracking events table for detailed tracking
CREATE TABLE IF NOT EXISTS public.email_tracking_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_log_id UUID REFERENCES public.email_campaign_log(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed')),
  event_data JSONB DEFAULT '{}'::jsonb,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_campaign_analytics_campaign_id ON public.campaign_analytics(campaign_id);
CREATE INDEX idx_email_tracking_events_campaign_log_id ON public.email_tracking_events(campaign_log_id);
CREATE INDEX idx_email_tracking_events_type ON public.email_tracking_events(event_type);
CREATE INDEX idx_email_tracking_events_created_at ON public.email_tracking_events(created_at DESC);

-- Enable RLS
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_tracking_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for campaign_analytics
CREATE POLICY "Admins can view campaign analytics"
  ON public.campaign_analytics FOR SELECT
  USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Admins can manage campaign analytics"
  ON public.campaign_analytics FOR ALL
  USING (has_role(auth.uid(), 'administrator'::app_role))
  WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- RLS Policies for email_tracking_events
CREATE POLICY "Admins can view tracking events"
  ON public.email_tracking_events FOR SELECT
  USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "System can insert tracking events"
  ON public.email_tracking_events FOR INSERT
  WITH CHECK (true);

-- Trigger to update updated_at
CREATE TRIGGER update_campaign_analytics_updated_at
  BEFORE UPDATE ON public.campaign_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment campaign analytics
CREATE OR REPLACE FUNCTION public.increment_campaign_stat(
  _campaign_id UUID,
  _stat_type TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update campaign analytics
  INSERT INTO public.campaign_analytics (campaign_id, sent_count, delivered_count, open_count, click_count, bounce_count, unsubscribe_count)
  VALUES (_campaign_id, 
    CASE WHEN _stat_type = 'sent' THEN 1 ELSE 0 END,
    CASE WHEN _stat_type = 'delivered' THEN 1 ELSE 0 END,
    CASE WHEN _stat_type = 'opened' THEN 1 ELSE 0 END,
    CASE WHEN _stat_type = 'clicked' THEN 1 ELSE 0 END,
    CASE WHEN _stat_type = 'bounced' THEN 1 ELSE 0 END,
    CASE WHEN _stat_type = 'unsubscribed' THEN 1 ELSE 0 END
  )
  ON CONFLICT (campaign_id) DO UPDATE SET
    sent_count = public.campaign_analytics.sent_count + (CASE WHEN _stat_type = 'sent' THEN 1 ELSE 0 END),
    delivered_count = public.campaign_analytics.delivered_count + (CASE WHEN _stat_type = 'delivered' THEN 1 ELSE 0 END),
    open_count = public.campaign_analytics.open_count + (CASE WHEN _stat_type = 'opened' THEN 1 ELSE 0 END),
    click_count = public.campaign_analytics.click_count + (CASE WHEN _stat_type = 'clicked' THEN 1 ELSE 0 END),
    bounce_count = public.campaign_analytics.bounce_count + (CASE WHEN _stat_type = 'bounced' THEN 1 ELSE 0 END),
    unsubscribe_count = public.campaign_analytics.unsubscribe_count + (CASE WHEN _stat_type = 'unsubscribed' THEN 1 ELSE 0 END),
    last_sent_at = CASE WHEN _stat_type = 'sent' THEN now() ELSE public.campaign_analytics.last_sent_at END,
    updated_at = now();
END;
$$;