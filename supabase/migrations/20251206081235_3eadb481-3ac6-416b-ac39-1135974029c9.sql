-- Add spending limit and current spend tracking to incognito_transactions
ALTER TABLE public.incognito_transactions 
ADD COLUMN IF NOT EXISTS spending_limit numeric DEFAULT 500,
ADD COLUMN IF NOT EXISTS current_spend numeric DEFAULT 0;

-- Create table to track individual bar tab charges
CREATE TABLE IF NOT EXISTS public.bar_tab_charges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id uuid NOT NULL REFERENCES public.incognito_transactions(id) ON DELETE CASCADE,
  venue_id uuid REFERENCES public.partner_venues(id),
  amount numeric NOT NULL,
  description text,
  pos_reference text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bar_tab_charges ENABLE ROW LEVEL SECURITY;

-- RLS policies for bar_tab_charges
CREATE POLICY "Users can view their own charges" 
ON public.bar_tab_charges 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.incognito_transactions t 
    WHERE t.id = bar_tab_charges.transaction_id 
    AND t.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all charges" 
ON public.bar_tab_charges 
FOR SELECT 
USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Service role can insert charges" 
ON public.bar_tab_charges 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can update charges" 
ON public.bar_tab_charges 
FOR UPDATE 
USING (true);

-- Enable realtime for bar_tab_charges and incognito_transactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.bar_tab_charges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.incognito_transactions;

-- Create function to update current_spend when a charge is added
CREATE OR REPLACE FUNCTION public.update_transaction_spend()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.incognito_transactions 
  SET current_spend = COALESCE(current_spend, 0) + NEW.amount
  WHERE id = NEW.transaction_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-update spend
CREATE TRIGGER on_bar_tab_charge_insert
AFTER INSERT ON public.bar_tab_charges
FOR EACH ROW
EXECUTE FUNCTION public.update_transaction_spend();