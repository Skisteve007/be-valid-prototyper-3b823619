-- Create wallet transactions table to track refills and pass purchases
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('refill', 'pass_purchase', 'bar_charge')),
  amount NUMERIC NOT NULL,
  balance_after NUMERIC NOT NULL,
  payment_method TEXT,
  payment_reference TEXT,
  pass_label TEXT,
  pass_duration_hrs INTEGER,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view their own wallet transactions"
ON public.wallet_transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own transactions
CREATE POLICY "Users can insert their own wallet transactions"
ON public.wallet_transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "Admins can view all wallet transactions"
ON public.wallet_transactions
FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Service role can manage all transactions
CREATE POLICY "Service role can manage wallet transactions"
ON public.wallet_transactions
FOR ALL
USING (true)
WITH CHECK (true);

-- Add index for faster queries
CREATE INDEX idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_created_at ON public.wallet_transactions(created_at DESC);