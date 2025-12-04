-- Create venue payout ledger for tracking venue earnings
CREATE TABLE public.venue_payout_ledger (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id),
  transaction_id UUID REFERENCES public.incognito_transactions(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
  payout_reference TEXT,
  bank_endpoint TEXT, -- Venue's verified bank/payment endpoint
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add bank endpoint tracking to partner_venues
ALTER TABLE public.partner_venues 
ADD COLUMN IF NOT EXISTS bank_endpoint TEXT,
ADD COLUMN IF NOT EXISTS paypal_email TEXT,
ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pending_earnings DECIMAL(10,2) DEFAULT 0;

-- Enable RLS on venue_payout_ledger
ALTER TABLE public.venue_payout_ledger ENABLE ROW LEVEL SECURITY;

-- RLS policies for venue_payout_ledger
CREATE POLICY "Venue operators can view their venue payouts" ON public.venue_payout_ledger
  FOR SELECT USING (is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Admins can manage all venue payouts" ON public.venue_payout_ledger
  FOR ALL USING (public.has_role(auth.uid(), 'administrator'));

CREATE POLICY "Service role can insert venue payouts" ON public.venue_payout_ledger
  FOR INSERT WITH CHECK (true);

-- Function to update venue earnings
CREATE OR REPLACE FUNCTION public.update_venue_earnings(_venue_id uuid, _amount numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.partner_venues 
  SET 
    pending_earnings = COALESCE(pending_earnings, 0) + _amount,
    total_earnings = COALESCE(total_earnings, 0) + _amount,
    updated_at = now()
  WHERE id = _venue_id;
END;
$$;