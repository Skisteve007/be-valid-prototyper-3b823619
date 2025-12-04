-- Create table for storing user payment methods
CREATE TABLE public.user_payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('paypal', 'card', 'zelle')),
  payment_identifier TEXT NOT NULL, -- PayPal email, last 4 digits, or Zelle phone
  is_default BOOLEAN DEFAULT false,
  token_reference TEXT, -- Encrypted token/billing agreement ID for PayPal/Stripe
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, payment_type, payment_identifier)
);

-- Create incognito transactions ledger
CREATE TABLE public.incognito_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  venue_id UUID REFERENCES public.partner_venues(id),
  promoter_id UUID REFERENCES public.affiliates(id),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 5.00,
  venue_share DECIMAL(10,2) NOT NULL DEFAULT 2.00,
  cleancheck_share DECIMAL(10,2) NOT NULL DEFAULT 2.00,
  promoter_share DECIMAL(10,2) NOT NULL DEFAULT 1.00,
  payment_method_id UUID REFERENCES public.user_payment_methods(id),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed')),
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create promoter payout ledger for batch payouts
CREATE TABLE public.promoter_payout_ledger (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  promoter_id UUID NOT NULL REFERENCES public.affiliates(id),
  transaction_id UUID REFERENCES public.incognito_transactions(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incognito_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promoter_payout_ledger ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_payment_methods (users manage their own)
CREATE POLICY "Users can view their own payment methods" ON public.user_payment_methods
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own payment methods" ON public.user_payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own payment methods" ON public.user_payment_methods
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own payment methods" ON public.user_payment_methods
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for incognito_transactions (users see their own, admins see all)
CREATE POLICY "Users can view their own transactions" ON public.incognito_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON public.incognito_transactions
  FOR SELECT USING (public.has_role(auth.uid(), 'administrator'));
CREATE POLICY "Service role can insert transactions" ON public.incognito_transactions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update transactions" ON public.incognito_transactions
  FOR UPDATE USING (true);

-- RLS policies for promoter_payout_ledger
CREATE POLICY "Promoters can view their own ledger" ON public.promoter_payout_ledger
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.affiliates WHERE id = promoter_id AND user_id = auth.uid())
  );
CREATE POLICY "Admins can manage all ledger entries" ON public.promoter_payout_ledger
  FOR ALL USING (public.has_role(auth.uid(), 'administrator'));

-- Triggers for updated_at
CREATE TRIGGER update_user_payment_methods_updated_at
  BEFORE UPDATE ON public.user_payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
