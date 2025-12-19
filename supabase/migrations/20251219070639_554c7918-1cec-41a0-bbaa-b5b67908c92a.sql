-- Create venue_ledger_entries table for tracking payable amounts
CREATE TABLE IF NOT EXISTS public.venue_ledger_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id uuid NOT NULL REFERENCES public.partner_venues(id),
  transaction_id uuid,
  entry_type text NOT NULL,
  amount numeric NOT NULL,
  description text,
  stripe_transfer_id text,
  paid_at timestamp with time zone,
  idempotency_key text UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS only if not already enabled
ALTER TABLE public.venue_ledger_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage ledger entries" ON public.venue_ledger_entries;
DROP POLICY IF EXISTS "Venue operators can view their ledger" ON public.venue_ledger_entries;
DROP POLICY IF EXISTS "Service role can insert ledger entries" ON public.venue_ledger_entries;
DROP POLICY IF EXISTS "Service role can update ledger entries" ON public.venue_ledger_entries;

-- Recreate policies
CREATE POLICY "Admins can manage ledger entries" 
ON public.venue_ledger_entries 
FOR ALL 
USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Venue operators can view their ledger" 
ON public.venue_ledger_entries 
FOR SELECT 
USING (is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Service role can insert ledger entries" 
ON public.venue_ledger_entries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can update ledger entries" 
ON public.venue_ledger_entries 
FOR UPDATE 
USING (true);