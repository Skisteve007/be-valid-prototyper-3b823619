-- VALID Payment System Tables

-- Venue Gas Fee Configuration (admin-configured or auto-tier)
CREATE TABLE public.venue_gas_fee_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id) ON DELETE CASCADE,
  use_auto_tier BOOLEAN NOT NULL DEFAULT true,
  manual_gas_fee NUMERIC(6,4) DEFAULT NULL, -- e.g., 0.2500 for $0.25
  minimum_monthly_enabled BOOLEAN NOT NULL DEFAULT false,
  minimum_monthly_amount NUMERIC(10,2) DEFAULT 50.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(venue_id)
);

-- Main Transactions Table (Model A & B)
CREATE TABLE public.valid_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id),
  user_id UUID NOT NULL,
  staff_user_id UUID,
  
  -- Model identifier: 'ghost_pass' or 'direct_payment'
  payment_model TEXT NOT NULL CHECK (payment_model IN ('ghost_pass', 'direct_payment')),
  
  -- Sub-types
  ghost_pass_tier TEXT CHECK (ghost_pass_tier IN ('bronze', 'silver', 'gold')),
  direct_payment_type TEXT CHECK (direct_payment_type IN ('cover', 'bar_tab', 'food_beverage', 'bottle_service', 'merch', 'event_ticket', 'vip_upgrade', 'other')),
  
  -- Amounts
  gross_amount NUMERIC(10,2) NOT NULL,
  gas_fee_applied NUMERIC(10,4) NOT NULL DEFAULT 0,
  transaction_fee_applied NUMERIC(10,4) NOT NULL DEFAULT 0,
  
  -- Splits (for Ghost Pass Model A)
  venue_share NUMERIC(10,2) DEFAULT 0,
  promoter_share NUMERIC(10,2) DEFAULT 0,
  community_pool_share NUMERIC(10,2) DEFAULT 0,
  valid_share NUMERIC(10,2) DEFAULT 0,
  
  -- Net amounts
  venue_net NUMERIC(10,2) NOT NULL DEFAULT 0,
  valid_net NUMERIC(10,2) NOT NULL DEFAULT 0,
  
  -- Promoter tracking
  promoter_id UUID REFERENCES public.affiliates(id),
  promoter_code TEXT,
  
  -- Payment reference
  payment_reference TEXT,
  payment_method TEXT DEFAULT 'ghost_wallet',
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Venue Monthly Scan Counts (for tier calculation)
CREATE TABLE public.venue_scan_counts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL, -- e.g., '2025-12'
  scan_count INTEGER NOT NULL DEFAULT 0,
  gas_fees_collected NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(venue_id, month_year)
);

-- Enable RLS
ALTER TABLE public.venue_gas_fee_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valid_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_scan_counts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for venue_gas_fee_config
CREATE POLICY "Admins can manage venue gas fee config"
ON public.venue_gas_fee_config FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Venue operators can view their gas fee config"
ON public.venue_gas_fee_config FOR SELECT
USING (is_venue_operator(auth.uid(), venue_id));

-- RLS Policies for valid_transactions
CREATE POLICY "Admins can view all transactions"
ON public.valid_transactions FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Users can view their own transactions"
ON public.valid_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Venue operators can view their venue transactions"
ON public.valid_transactions FOR SELECT
USING (is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Service role can insert transactions"
ON public.valid_transactions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can update transactions"
ON public.valid_transactions FOR UPDATE
USING (true);

-- RLS Policies for venue_scan_counts
CREATE POLICY "Admins can manage scan counts"
ON public.venue_scan_counts FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Venue operators can view their scan counts"
ON public.venue_scan_counts FOR SELECT
USING (is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Service role can insert/update scan counts"
ON public.venue_scan_counts FOR ALL
USING (true)
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_valid_transactions_venue_id ON public.valid_transactions(venue_id);
CREATE INDEX idx_valid_transactions_user_id ON public.valid_transactions(user_id);
CREATE INDEX idx_valid_transactions_created_at ON public.valid_transactions(created_at);
CREATE INDEX idx_valid_transactions_status ON public.valid_transactions(status);
CREATE INDEX idx_venue_scan_counts_venue_month ON public.venue_scan_counts(venue_id, month_year);

-- Function to get current gas fee tier for a venue
CREATE OR REPLACE FUNCTION public.get_venue_gas_fee(p_venue_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_config venue_gas_fee_config%ROWTYPE;
  v_scan_count INTEGER;
  v_gas_fee NUMERIC;
  v_month_year TEXT;
BEGIN
  -- Get venue config
  SELECT * INTO v_config FROM venue_gas_fee_config WHERE venue_id = p_venue_id;
  
  -- If manual fee configured and not using auto-tier
  IF v_config.id IS NOT NULL AND NOT v_config.use_auto_tier AND v_config.manual_gas_fee IS NOT NULL THEN
    RETURN v_config.manual_gas_fee;
  END IF;
  
  -- Auto-tier calculation based on trailing 30 days
  v_month_year := to_char(now(), 'YYYY-MM');
  
  SELECT COALESCE(scan_count, 0) INTO v_scan_count
  FROM venue_scan_counts
  WHERE venue_id = p_venue_id AND month_year = v_month_year;
  
  -- Tier logic (using midpoint of ranges)
  IF v_scan_count >= 100000 THEN
    v_gas_fee := 0.075; -- $0.05-$0.10 midpoint
  ELSIF v_scan_count >= 10000 THEN
    v_gas_fee := 0.125; -- $0.10-$0.15 midpoint
  ELSIF v_scan_count >= 1000 THEN
    v_gas_fee := 0.20; -- $0.15-$0.25 midpoint
  ELSE
    v_gas_fee := 0.375; -- $0.25-$0.50 midpoint
  END IF;
  
  RETURN v_gas_fee;
END;
$$;

-- Trigger for updating timestamps
CREATE TRIGGER update_venue_gas_fee_config_updated_at
BEFORE UPDATE ON public.venue_gas_fee_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_valid_transactions_updated_at
BEFORE UPDATE ON public.valid_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_venue_scan_counts_updated_at
BEFORE UPDATE ON public.venue_scan_counts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();