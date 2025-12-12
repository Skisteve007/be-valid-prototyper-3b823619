-- Create staff_shifts table for venue staff management
CREATE TABLE public.staff_shifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id) ON DELETE CASCADE,
  staff_user_id UUID NOT NULL,
  staff_name TEXT NOT NULL,
  staff_role TEXT NOT NULL DEFAULT 'bartender',
  shift_start TIMESTAMP WITH TIME ZONE NOT NULL,
  shift_end TIMESTAMP WITH TIME ZONE,
  qr_token TEXT UNIQUE,
  qr_token_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create POS transaction confirmation table
CREATE TABLE public.pos_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id),
  staff_shift_id UUID REFERENCES public.staff_shifts(id),
  affiliate_id UUID REFERENCES public.affiliates(id),
  base_amount NUMERIC NOT NULL,
  tip_percentage INTEGER,
  tip_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL DEFAULT 'bar_charge',
  status TEXT NOT NULL DEFAULT 'pending',
  member_confirmed_at TIMESTAMP WITH TIME ZONE,
  pos_confirmed_at TIMESTAMP WITH TIME ZONE,
  fbo_account_id TEXT,
  wallet_transaction_id UUID REFERENCES public.wallet_transactions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create member active sessions table to track venue check-ins with Ghost Pass
CREATE TABLE public.member_active_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  venue_id UUID NOT NULL REFERENCES public.partner_venues(id),
  check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  check_out_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  ghost_pass_activated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add affiliate commission rate columns to partner_venues if not exists
ALTER TABLE public.partner_venues 
ADD COLUMN IF NOT EXISTS door_commission_rate NUMERIC DEFAULT 0.10,
ADD COLUMN IF NOT EXISTS bar_commission_rate NUMERIC DEFAULT 0.05;

-- Enable RLS on new tables
ALTER TABLE public.staff_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_active_sessions ENABLE ROW LEVEL SECURITY;

-- RLS for staff_shifts
CREATE POLICY "Admins can manage all staff shifts" ON public.staff_shifts
FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Venue operators can manage their venue staff" ON public.staff_shifts
FOR ALL USING (is_venue_operator(auth.uid(), venue_id));

-- RLS for pos_transactions
CREATE POLICY "Admins can view all POS transactions" ON public.pos_transactions
FOR SELECT USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Users can view their own POS transactions" ON public.pos_transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert POS transactions" ON public.pos_transactions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update POS transactions" ON public.pos_transactions
FOR UPDATE USING (true);

-- RLS for member_active_sessions
CREATE POLICY "Admins can view all member sessions" ON public.member_active_sessions
FOR SELECT USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Users can manage their own sessions" ON public.member_active_sessions
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Venue operators can view their venue sessions" ON public.member_active_sessions
FOR SELECT USING (is_venue_operator(auth.uid(), venue_id));

-- Create trigger for updating updated_at
CREATE TRIGGER update_staff_shifts_updated_at
BEFORE UPDATE ON public.staff_shifts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pos_transactions_updated_at
BEFORE UPDATE ON public.pos_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for POS transactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.pos_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.member_active_sessions;