-- Create venue_billing_config table
CREATE TABLE IF NOT EXISTS public.venue_billing_config (
  venue_id uuid PRIMARY KEY REFERENCES public.partner_venues(id) ON DELETE CASCADE,
  per_scan_fee_cents integer NOT NULL DEFAULT 50,
  free_scan_credits_remaining integer NOT NULL DEFAULT 0,
  venue_share_bps integer NOT NULL DEFAULT 10000,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.venue_billing_config ENABLE ROW LEVEL SECURITY;

-- RLS policies for venue_billing_config
CREATE POLICY "Admins can manage billing config" ON public.venue_billing_config
  FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Venue operators can view their billing config" ON public.venue_billing_config
  FOR SELECT USING (is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Service role can manage billing config" ON public.venue_billing_config
  FOR ALL USING (true) WITH CHECK (true);

-- Create pos_charges table
CREATE TABLE IF NOT EXISTS public.pos_charges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES public.partner_venues(id) ON DELETE CASCADE,
  staff_user_id uuid NOT NULL,
  member_id text NOT NULL,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  charge_type text NOT NULL,
  amount_cents integer NOT NULL,
  platform_fee_cents integer NOT NULL,
  venue_net_cents integer NOT NULL,
  used_free_credit boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pos_charges ENABLE ROW LEVEL SECURITY;

-- RLS policies for pos_charges
CREATE POLICY "Admins can manage pos_charges" ON public.pos_charges
  FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Venue operators can view their charges" ON public.pos_charges
  FOR SELECT USING (is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Service role can insert pos_charges" ON public.pos_charges
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can view their own charges" ON public.pos_charges
  FOR SELECT USING (auth.uid() = staff_user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pos_charges_venue_id ON public.pos_charges(venue_id);
CREATE INDEX IF NOT EXISTS idx_pos_charges_created_at ON public.pos_charges(created_at DESC);