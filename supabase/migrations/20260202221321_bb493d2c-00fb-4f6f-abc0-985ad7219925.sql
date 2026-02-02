-- ============================================
-- VALID / GHOST PASS CANON SCHEMA MIGRATION
-- ============================================

-- 1. UPDATE organizations TABLE (add missing columns)
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS org_type TEXT DEFAULT 'VENUE' CHECK (org_type IN ('VALID', 'VENUE', 'PROMOTER', 'VENDOR')),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended'));

-- 2. CREATE events TABLE (anchor object)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id),
  venue_id UUID REFERENCES public.partner_venues(id),
  event_name TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  timezone TEXT DEFAULT 'America/New_York',
  currency TEXT DEFAULT 'USD',
  reentry_allowed BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. CREATE event_configuration TABLE (all pricing/rules)
CREATE TABLE IF NOT EXISTS public.event_configuration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  initial_entry_fee NUMERIC(10,2) DEFAULT 0,
  venue_reentry_fee NUMERIC(10,2) DEFAULT 0,
  valid_reentry_scan_fee NUMERIC(10,2) DEFAULT 0.20,
  reentry_max_count INTEGER,
  pass_required BOOLEAN DEFAULT false,
  pass_price_1_day NUMERIC(10,2),
  pass_price_3_day NUMERIC(10,2),
  pass_price_7_day NUMERIC(10,2),
  custom_pass_rules JSONB DEFAULT '{}',
  id_verification_tier TEXT CHECK (id_verification_tier IN ('tier_1', 'tier_2')),
  id_verification_fee NUMERIC(10,2),
  venue_split_percent NUMERIC(5,2) DEFAULT 30,
  promoter_split_percent NUMERIC(5,2) DEFAULT 30,
  pool_split_percent NUMERIC(5,2) DEFAULT 10,
  valid_split_percent NUMERIC(5,2) DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id)
);

-- 4. CREATE access_points TABLE (replaces/extends venue_devices for events)
CREATE TABLE IF NOT EXISTS public.access_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES public.partner_venues(id),
  device_id UUID REFERENCES public.venue_devices(id),
  name TEXT NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('ENTRY', 'CONCESSION', 'MERCH', 'BAR', 'VIP')),
  interaction_mode TEXT DEFAULT 'BOTH' CHECK (interaction_mode IN ('QR', 'NFC', 'BOTH')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. CREATE entry_logs TABLE (every entry and re-entry)
CREATE TABLE IF NOT EXISTS public.entry_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES public.user_wallets(id),
  user_id UUID,
  event_id UUID REFERENCES public.events(id),
  access_point_id UUID REFERENCES public.access_points(id),
  venue_id UUID REFERENCES public.partner_venues(id),
  entry_number INTEGER DEFAULT 1,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('INITIAL', 'REENTRY')),
  venue_reentry_fee_charged NUMERIC(10,2) DEFAULT 0,
  valid_scan_fee_charged NUMERIC(10,2) DEFAULT 0,
  scan_source TEXT CHECK (scan_source IN ('QR', 'NFC')),
  scan_result TEXT DEFAULT 'allowed' CHECK (scan_result IN ('allowed', 'denied', 'flagged')),
  deny_reason TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- 6. UPDATE user_wallets TABLE (add missing columns)
ALTER TABLE public.user_wallets
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'locked', 'suspended'));

-- 7. CREATE receipts TABLE (user-visible receipts)
CREATE TABLE IF NOT EXISTS public.receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.valid_transactions(id),
  wallet_id UUID REFERENCES public.user_wallets(id),
  user_id UUID,
  event_id UUID REFERENCES public.events(id),
  receipt_payload JSONB NOT NULL DEFAULT '{}',
  venue_fee NUMERIC(10,2),
  valid_fee NUMERIC(10,2),
  total_charged NUMERIC(10,2),
  delivered BOOLEAN DEFAULT false,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. ADD event linkage to valid_transactions
ALTER TABLE public.valid_transactions
ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id),
ADD COLUMN IF NOT EXISTS access_point_id UUID REFERENCES public.access_points(id),
ADD COLUMN IF NOT EXISTS transaction_type TEXT CHECK (transaction_type IN ('ENTRY', 'REENTRY', 'CONCESSION', 'PASS_PURCHASE', 'BAR', 'MERCH'));

-- 9. UPDATE audit_logs to match canon spec
ALTER TABLE public.audit_logs
ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id),
ADD COLUMN IF NOT EXISTS wallet_id UUID,
ADD COLUMN IF NOT EXISTS action_type TEXT,
ADD COLUMN IF NOT EXISTS source TEXT CHECK (source IN ('QR', 'NFC', 'MANUAL', 'SYSTEM')),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 10. CREATE INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_events_organization ON public.events(organization_id);
CREATE INDEX IF NOT EXISTS idx_events_venue ON public.events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_entry_logs_event ON public.entry_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_entry_logs_wallet ON public.entry_logs(wallet_id);
CREATE INDEX IF NOT EXISTS idx_entry_logs_timestamp ON public.entry_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_access_points_event ON public.access_points(event_id);
CREATE INDEX IF NOT EXISTS idx_receipts_wallet ON public.receipts(wallet_id);
CREATE INDEX IF NOT EXISTS idx_receipts_event ON public.receipts(event_id);
CREATE INDEX IF NOT EXISTS idx_valid_transactions_event ON public.valid_transactions(event_id);

-- 11. ENABLE RLS on new tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- 12. RLS POLICIES for events
CREATE POLICY "VALID admins can view all events" ON public.events
  FOR SELECT USING (public.is_steve_owner());

CREATE POLICY "Venue operators can view their events" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.venue_operators vo
      WHERE vo.user_id = auth.uid() AND vo.venue_id = events.venue_id
    )
  );

CREATE POLICY "Venue operators can manage their events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.venue_operators vo
      WHERE vo.user_id = auth.uid() AND vo.venue_id = events.venue_id
    )
  );

-- 13. RLS POLICIES for event_configuration
CREATE POLICY "VALID admins can view all configs" ON public.event_configuration
  FOR SELECT USING (public.is_steve_owner());

CREATE POLICY "Venue operators can manage event configs" ON public.event_configuration
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events e
      JOIN public.venue_operators vo ON vo.venue_id = e.venue_id
      WHERE e.id = event_configuration.event_id AND vo.user_id = auth.uid()
    )
  );

-- 14. RLS POLICIES for access_points
CREATE POLICY "VALID admins can view all access points" ON public.access_points
  FOR SELECT USING (public.is_steve_owner());

CREATE POLICY "Venue operators can manage access points" ON public.access_points
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.venue_operators vo
      WHERE vo.user_id = auth.uid() AND vo.venue_id = access_points.venue_id
    )
  );

-- 15. RLS POLICIES for entry_logs
CREATE POLICY "VALID admins can view all entry logs" ON public.entry_logs
  FOR SELECT USING (public.is_steve_owner());

CREATE POLICY "Venue operators can view their entry logs" ON public.entry_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.venue_operators vo
      WHERE vo.user_id = auth.uid() AND vo.venue_id = entry_logs.venue_id
    )
  );

CREATE POLICY "Users can view their own entries" ON public.entry_logs
  FOR SELECT USING (auth.uid() = user_id);

-- 16. RLS POLICIES for receipts
CREATE POLICY "VALID admins can view all receipts" ON public.receipts
  FOR SELECT USING (public.is_steve_owner());

CREATE POLICY "Users can view their own receipts" ON public.receipts
  FOR SELECT USING (auth.uid() = user_id);

-- 17. UPDATE TRIGGER for events
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 18. UPDATE TRIGGER for event_configuration
CREATE TRIGGER update_event_configuration_updated_at
  BEFORE UPDATE ON public.event_configuration
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();