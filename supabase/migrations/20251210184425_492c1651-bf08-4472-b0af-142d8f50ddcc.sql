-- Add originator_id to profiles (links user to their recruiting promoter/account manager)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS originator_id uuid REFERENCES public.affiliates(id);

-- Add promoter spend commission rate to partner_venues
ALTER TABLE public.partner_venues 
ADD COLUMN IF NOT EXISTS promoter_spend_commission_rate numeric DEFAULT 0 CHECK (promoter_spend_commission_rate >= 0 AND promoter_spend_commission_rate <= 0.20);

-- Add transaction_type to incognito_transactions to distinguish ACCESS_PASS vs POS_SPEND
ALTER TABLE public.incognito_transactions 
ADD COLUMN IF NOT EXISTS transaction_type text DEFAULT 'ACCESS_PASS' CHECK (transaction_type IN ('ACCESS_PASS', 'POS_SPEND'));

-- Add daily_venue_pool tracking table for the waterfall distribution
CREATE TABLE IF NOT EXISTS public.venue_pool_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES public.incognito_transactions(id),
  pass_start_date date NOT NULL,
  pass_end_date date NOT NULL,
  total_pool_amount numeric NOT NULL DEFAULT 0,
  distributed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Track unique venue visits for pool distribution
CREATE TABLE IF NOT EXISTS public.venue_visit_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_distribution_id uuid REFERENCES public.venue_pool_distributions(id),
  venue_id uuid REFERENCES public.partner_venues(id),
  user_id uuid NOT NULL,
  visited_at timestamp with time zone DEFAULT now(),
  share_amount numeric DEFAULT 0,
  UNIQUE(pool_distribution_id, venue_id)
);

-- Enable RLS on new tables
ALTER TABLE public.venue_pool_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_visit_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for venue_pool_distributions
CREATE POLICY "Admins can manage pool distributions" ON public.venue_pool_distributions
FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Service role can insert pool distributions" ON public.venue_pool_distributions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update pool distributions" ON public.venue_pool_distributions
FOR UPDATE USING (true);

-- RLS policies for venue_visit_tracking
CREATE POLICY "Admins can manage venue visits" ON public.venue_visit_tracking
FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Service role can insert venue visits" ON public.venue_visit_tracking
FOR INSERT WITH CHECK (true);

CREATE POLICY "Venues can view their own visits" ON public.venue_visit_tracking
FOR SELECT USING (is_venue_operator(auth.uid(), venue_id));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_originator ON public.profiles(originator_id);
CREATE INDEX IF NOT EXISTS idx_venue_visits_pool ON public.venue_visit_tracking(pool_distribution_id);
CREATE INDEX IF NOT EXISTS idx_venue_visits_venue ON public.venue_visit_tracking(venue_id);