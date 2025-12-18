-- Create user_wallets table for tracking wallet balances and limits
CREATE TABLE IF NOT EXISTS public.user_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  daily_funded_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  daily_funded_date DATE DEFAULT CURRENT_DATE,
  monthly_funded_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  monthly_funded_month TEXT DEFAULT to_char(CURRENT_DATE, 'YYYY-MM'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wallet_funding_transactions table for tracking all funding events
CREATE TABLE IF NOT EXISTS public.wallet_funding_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  convenience_fee NUMERIC(12,2) NOT NULL,
  total_charged NUMERIC(12,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'card',
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  credited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_funding_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_wallets
CREATE POLICY "Users can view their own wallet"
  ON public.user_wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallet"
  ON public.user_wallets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet"
  ON public.user_wallets FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for wallet_funding_transactions
CREATE POLICY "Users can view their own funding transactions"
  ON public.wallet_funding_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own funding transactions"
  ON public.wallet_funding_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_user_wallets_user_id ON public.user_wallets(user_id);
CREATE INDEX idx_wallet_funding_transactions_user_id ON public.wallet_funding_transactions(user_id);
CREATE INDEX idx_wallet_funding_transactions_status ON public.wallet_funding_transactions(status);

-- Trigger for updated_at
CREATE TRIGGER update_user_wallets_updated_at
  BEFORE UPDATE ON public.user_wallets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallet_funding_transactions_updated_at
  BEFORE UPDATE ON public.wallet_funding_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get or create user wallet
CREATE OR REPLACE FUNCTION public.get_or_create_wallet(p_user_id UUID)
RETURNS public.user_wallets
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet public.user_wallets;
BEGIN
  -- Try to get existing wallet
  SELECT * INTO v_wallet FROM public.user_wallets WHERE user_id = p_user_id;
  
  -- If not found, create one
  IF NOT FOUND THEN
    INSERT INTO public.user_wallets (user_id)
    VALUES (p_user_id)
    RETURNING * INTO v_wallet;
  END IF;
  
  -- Reset daily/monthly counters if needed
  IF v_wallet.daily_funded_date != CURRENT_DATE THEN
    UPDATE public.user_wallets 
    SET daily_funded_amount = 0, daily_funded_date = CURRENT_DATE
    WHERE id = v_wallet.id
    RETURNING * INTO v_wallet;
  END IF;
  
  IF v_wallet.monthly_funded_month != to_char(CURRENT_DATE, 'YYYY-MM') THEN
    UPDATE public.user_wallets 
    SET monthly_funded_amount = 0, monthly_funded_month = to_char(CURRENT_DATE, 'YYYY-MM')
    WHERE id = v_wallet.id
    RETURNING * INTO v_wallet;
  END IF;
  
  RETURN v_wallet;
END;
$$;

-- Function to credit wallet after successful payment
CREATE OR REPLACE FUNCTION public.credit_wallet(
  p_user_id UUID,
  p_amount NUMERIC,
  p_fee NUMERIC,
  p_transaction_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet public.user_wallets;
BEGIN
  -- Get or create wallet
  SELECT * INTO v_wallet FROM public.get_or_create_wallet(p_user_id);
  
  -- Check daily limit ($5,000)
  IF v_wallet.daily_funded_amount + p_amount > 5000 THEN
    RAISE EXCEPTION 'Daily funding limit of $5,000 exceeded';
  END IF;
  
  -- Check monthly limit ($10,000)
  IF v_wallet.monthly_funded_amount + p_amount > 10000 THEN
    RAISE EXCEPTION 'Monthly funding limit of $10,000 exceeded';
  END IF;
  
  -- Update wallet balance and limits
  UPDATE public.user_wallets
  SET 
    balance = balance + p_amount,
    daily_funded_amount = daily_funded_amount + p_amount,
    monthly_funded_amount = monthly_funded_amount + p_amount,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Update transaction status
  UPDATE public.wallet_funding_transactions
  SET 
    status = 'completed',
    credited_at = now(),
    updated_at = now()
  WHERE id = p_transaction_id;
  
  RETURN TRUE;
END;
$$;