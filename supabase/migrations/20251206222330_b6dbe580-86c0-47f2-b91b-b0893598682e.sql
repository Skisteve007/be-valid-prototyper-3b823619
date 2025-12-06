-- ============================================================
-- CRITICAL SECURITY FIX: Complete RLS policies (fixing remaining tables)
-- ============================================================

-- 2. wallet_transactions - Drop existing and recreate
DROP POLICY IF EXISTS "Users can view their own wallet transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Service role can insert wallet transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Admins can view all wallet transactions" ON public.wallet_transactions;

CREATE POLICY "Users can view own wallet transactions" ON public.wallet_transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert wallet transactions" ON public.wallet_transactions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all wallet txns" ON public.wallet_transactions
FOR SELECT USING (public.has_role(auth.uid(), 'administrator'));

-- 3. venue_payout_ledger - Protect venue payout data
ALTER TABLE public.venue_payout_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Venue operators can view their payouts" ON public.venue_payout_ledger;
DROP POLICY IF EXISTS "Admins can manage all payouts" ON public.venue_payout_ledger;
DROP POLICY IF EXISTS "Admins can manage all venue payouts" ON public.venue_payout_ledger;

CREATE POLICY "Venue ops can view their payouts" ON public.venue_payout_ledger
FOR SELECT USING (public.is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Admins can manage venue payouts" ON public.venue_payout_ledger
FOR ALL USING (public.has_role(auth.uid(), 'administrator'));

-- 4. user_agreements - Protect agreement/waiver data
ALTER TABLE public.user_agreements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own agreements" ON public.user_agreements;
DROP POLICY IF EXISTS "Users can insert their own agreements" ON public.user_agreements;
DROP POLICY IF EXISTS "Admins can view all agreements" ON public.user_agreements;

CREATE POLICY "Users view own agreements" ON public.user_agreements
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own agreements" ON public.user_agreements
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all agreements" ON public.user_agreements
FOR SELECT USING (public.has_role(auth.uid(), 'administrator'));

-- 5. venue_qr_scans - Protect scan tracking data
ALTER TABLE public.venue_qr_scans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Venue operators can view their scans" ON public.venue_qr_scans;
DROP POLICY IF EXISTS "Venue operators can insert scans" ON public.venue_qr_scans;
DROP POLICY IF EXISTS "Users can view scans of their profile" ON public.venue_qr_scans;
DROP POLICY IF EXISTS "Admins can view all scans" ON public.venue_qr_scans;
DROP POLICY IF EXISTS "Admins can view all venue scans" ON public.venue_qr_scans;

CREATE POLICY "Venue ops view their scans" ON public.venue_qr_scans
FOR SELECT USING (public.is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Venue ops insert scans" ON public.venue_qr_scans
FOR INSERT WITH CHECK (public.is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Users view own profile scans" ON public.venue_qr_scans
FOR SELECT USING (auth.uid() = scanned_user_id);

CREATE POLICY "Admins view all QR scans" ON public.venue_qr_scans
FOR SELECT USING (public.has_role(auth.uid(), 'administrator'));

-- 6. user_checkins - Protect location/checkin data
ALTER TABLE public.user_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own checkins" ON public.user_checkins;
DROP POLICY IF EXISTS "Users can insert their own checkins" ON public.user_checkins;
DROP POLICY IF EXISTS "Venue operators can view checkins" ON public.user_checkins;
DROP POLICY IF EXISTS "Venue operators can view their venue checkins" ON public.user_checkins;
DROP POLICY IF EXISTS "Admins can view all checkins" ON public.user_checkins;
DROP POLICY IF EXISTS "Admins can view all user checkins" ON public.user_checkins;

CREATE POLICY "Users view own checkins" ON public.user_checkins
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own checkins" ON public.user_checkins
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Venue ops view venue checkins" ON public.user_checkins
FOR SELECT USING (public.is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Admins view all checkins" ON public.user_checkins
FOR SELECT USING (public.has_role(auth.uid(), 'administrator'));

-- 7. workplace_roster - Protect employee roster data
ALTER TABLE public.workplace_roster ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Venue operators can manage their roster" ON public.workplace_roster;
DROP POLICY IF EXISTS "Users can view their own roster entries" ON public.workplace_roster;
DROP POLICY IF EXISTS "Admins can manage all rosters" ON public.workplace_roster;
DROP POLICY IF EXISTS "Admins can manage all workplace rosters" ON public.workplace_roster;

CREATE POLICY "Venue ops manage their roster" ON public.workplace_roster
FOR ALL USING (public.is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Users view own roster entries" ON public.workplace_roster
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all rosters" ON public.workplace_roster
FOR ALL USING (public.has_role(auth.uid(), 'administrator'));

-- 8. venue_gross_revenue_log - Protect venue revenue data
ALTER TABLE public.venue_gross_revenue_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Venue operators can view their revenue" ON public.venue_gross_revenue_log;
DROP POLICY IF EXISTS "Venue operators can view their revenue logs" ON public.venue_gross_revenue_log;
DROP POLICY IF EXISTS "Admins can manage all revenue logs" ON public.venue_gross_revenue_log;
DROP POLICY IF EXISTS "Admins can manage all venue revenue logs" ON public.venue_gross_revenue_log;
DROP POLICY IF EXISTS "Service role can insert revenue logs" ON public.venue_gross_revenue_log;
DROP POLICY IF EXISTS "Service role can insert venue revenue logs" ON public.venue_gross_revenue_log;

CREATE POLICY "Venue ops view revenue logs" ON public.venue_gross_revenue_log
FOR SELECT USING (public.is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Admins manage revenue logs" ON public.venue_gross_revenue_log
FOR ALL USING (public.has_role(auth.uid(), 'administrator'));

CREATE POLICY "System insert revenue logs" ON public.venue_gross_revenue_log
FOR INSERT WITH CHECK (true);

-- 9. venue_operators - Protect operator assignments
ALTER TABLE public.venue_operators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Operators can view their own assignments" ON public.venue_operators;
DROP POLICY IF EXISTS "Admins can manage all operators" ON public.venue_operators;
DROP POLICY IF EXISTS "Admins can manage all venue operators" ON public.venue_operators;

CREATE POLICY "Operators view own assignments" ON public.venue_operators
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all operators" ON public.venue_operators
FOR ALL USING (public.has_role(auth.uid(), 'administrator'));

-- 10. Fix partner_venues - Keep authenticated access but create safe function
DROP POLICY IF EXISTS "Everyone can view venues" ON public.partner_venues;
DROP POLICY IF EXISTS "Authenticated users can view basic venue info" ON public.partner_venues;
DROP POLICY IF EXISTS "Venue operators can view their venue details" ON public.partner_venues;

-- Create a security definer function for public venue access (no financial data)
CREATE OR REPLACE FUNCTION public.get_public_venues()
RETURNS TABLE (
  id uuid,
  venue_name text,
  city text,
  country text,
  category venue_category
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, venue_name, city, country, category
  FROM public.partner_venues
  WHERE status != 'Inactive'
  ORDER BY venue_name;
$$;

-- Authenticated users can view basic venue info
CREATE POLICY "Auth users view venue info" ON public.partner_venues
FOR SELECT TO authenticated
USING (true);

-- Venue operators can see full details of their venue
CREATE POLICY "Venue ops view their venue" ON public.partner_venues
FOR SELECT USING (public.is_venue_operator(auth.uid(), id));

-- 11. qr_code_views - Add admin access
CREATE POLICY "Admins view all QR views" ON public.qr_code_views
FOR SELECT USING (public.has_role(auth.uid(), 'administrator'));

-- 12. member_references - Add restrictive admin policy
CREATE POLICY "Admins manage references" ON public.member_references
FOR ALL USING (public.has_role(auth.uid(), 'administrator'));