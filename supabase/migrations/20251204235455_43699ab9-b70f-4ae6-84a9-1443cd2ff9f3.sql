-- Create promoter sessions table to track gross revenue attribution
CREATE TABLE public.promoter_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES public.incognito_transactions(id),
  promoter_id UUID NOT NULL REFERENCES public.affiliates(id),
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id),
  user_id UUID NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  gross_revenue_tracked NUMERIC DEFAULT 0,
  commission_rate NUMERIC DEFAULT 0.05,
  commission_earned NUMERIC DEFAULT 0,
  commission_status TEXT DEFAULT 'tracking',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create venue gross revenue log for tracking purchases within sessions
CREATE TABLE public.venue_gross_revenue_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.promoter_sessions(id),
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id),
  amount NUMERIC NOT NULL,
  revenue_type TEXT NOT NULL DEFAULT 'bar',
  pos_reference TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promoter_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_gross_revenue_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for promoter_sessions
CREATE POLICY "Admins can manage all sessions"
ON public.promoter_sessions FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Promoters can view their own sessions"
ON public.promoter_sessions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM affiliates 
  WHERE affiliates.id = promoter_sessions.promoter_id 
  AND affiliates.user_id = auth.uid()
));

CREATE POLICY "Service role can insert sessions"
ON public.promoter_sessions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can update sessions"
ON public.promoter_sessions FOR UPDATE
USING (true);

-- RLS policies for venue_gross_revenue_log
CREATE POLICY "Admins can manage all revenue logs"
ON public.venue_gross_revenue_log FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Venue operators can view their venue logs"
ON public.venue_gross_revenue_log FOR SELECT
USING (is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Venue operators can insert revenue logs"
ON public.venue_gross_revenue_log FOR INSERT
WITH CHECK (is_venue_operator(auth.uid(), venue_id));

-- Index for efficient session lookups
CREATE INDEX idx_promoter_sessions_active ON public.promoter_sessions(user_id, venue_id, session_start) 
WHERE session_end IS NULL;

CREATE INDEX idx_gross_revenue_session ON public.venue_gross_revenue_log(session_id);