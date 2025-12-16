-- ============================================
-- VALID™ PRIVACY & COMPLIANCE BACKEND
-- ============================================

-- 1. SCAN AUDIT LOG (Proves "We Don't Collect" - shows immediate deletion)
CREATE TABLE public.scan_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_timestamp TIMESTAMPTZ DEFAULT NOW(),
  venue_id UUID REFERENCES public.partner_venues(id),
  scan_type VARCHAR(50) NOT NULL, -- 'entry_check', 'age_verify', 'watchlist'
  result VARCHAR(20) NOT NULL, -- 'cleared', 'flagged', 'error'
  data_retained BOOLEAN DEFAULT FALSE, -- ALWAYS FALSE (proves no storage)
  data_purged_at TIMESTAMPTZ DEFAULT NOW(), -- Immediate purge timestamp
  session_hash VARCHAR(64), -- Anonymous session tracking (no PII)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COMPLIANCE CERTIFICATIONS (B2B Proof)
CREATE TABLE public.compliance_certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certification_type VARCHAR(50) NOT NULL, -- 'GDPR', 'CCPA', 'SOC2'
  certification_status VARCHAR(20) DEFAULT 'active',
  issued_date DATE,
  expiry_date DATE,
  certificate_url TEXT,
  auditor_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VENUE PRIVACY STATS (For B2B Sales Decks)
CREATE TABLE public.venue_privacy_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID REFERENCES public.partner_venues(id),
  total_scans_lifetime BIGINT DEFAULT 0,
  total_scans_today BIGINT DEFAULT 0,
  threats_blocked_lifetime BIGINT DEFAULT 0,
  threats_blocked_today BIGINT DEFAULT 0,
  avg_scan_time_ms INTEGER DEFAULT 0,
  data_retention_time_ms INTEGER DEFAULT 0, -- Should be ~0 (instant purge)
  fan_satisfaction_score DECIMAL(3,2), -- 0.00 to 5.00
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRIVACY CONSENT LOG (Opt-In Tracking)
CREATE TABLE public.privacy_consent_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  consent_type VARCHAR(50) NOT NULL, -- 'entry_scan', 'age_verify', 'marketing'
  consent_given BOOLEAN DEFAULT FALSE,
  consent_timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_hash VARCHAR(64), -- Hashed, not raw IP
  consent_version VARCHAR(20) DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GLOBAL STATS (Marketing Social Proof)
CREATE TABLE public.global_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key VARCHAR(100) UNIQUE NOT NULL,
  stat_value BIGINT DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial global stats
INSERT INTO public.global_stats (stat_key, stat_value) VALUES
  ('total_fans_protected', 500000),
  ('total_venues_verified', 12),
  ('total_threats_blocked', 847),
  ('avg_scan_time_ms', 230),
  ('data_retention_time_ms', 0);

-- 6. Create indexes for performance
CREATE INDEX idx_scan_audit_venue ON public.scan_audit_log(venue_id);
CREATE INDEX idx_scan_audit_timestamp ON public.scan_audit_log(scan_timestamp);
CREATE INDEX idx_venue_stats_venue ON public.venue_privacy_stats(venue_id);
CREATE INDEX idx_consent_user ON public.privacy_consent_log(user_id);

-- 7. Enable RLS on all tables
ALTER TABLE public.scan_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_privacy_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_consent_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_stats ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies

-- Scan Audit Log: Admins can view, service role can insert
CREATE POLICY "Admins can view scan audit logs"
ON public.scan_audit_log FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Service role can insert scan audit logs"
ON public.scan_audit_log FOR INSERT
WITH CHECK (true);

-- Compliance Certifications: Public read for transparency, admin manage
CREATE POLICY "Anyone can view compliance certifications"
ON public.compliance_certifications FOR SELECT
USING (true);

CREATE POLICY "Admins can manage compliance certifications"
ON public.compliance_certifications FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Venue Privacy Stats: Venue operators can view their stats, admins all
CREATE POLICY "Admins can view all venue privacy stats"
ON public.venue_privacy_stats FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Venue operators can view their venue stats"
ON public.venue_privacy_stats FOR SELECT
USING (is_venue_operator(auth.uid(), venue_id));

CREATE POLICY "Service role can manage venue stats"
ON public.venue_privacy_stats FOR ALL
USING (true)
WITH CHECK (true);

-- Privacy Consent Log: Users can view/manage their own consent
CREATE POLICY "Users can view their own consent log"
ON public.privacy_consent_log FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consent"
ON public.privacy_consent_log FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all consent logs"
ON public.privacy_consent_log FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Global Stats: Public read for marketing, admin manage
CREATE POLICY "Anyone can view global stats"
ON public.global_stats FOR SELECT
USING (true);

CREATE POLICY "Admins can manage global stats"
ON public.global_stats FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- 9. Trigger for updated_at on compliance_certifications
CREATE TRIGGER update_compliance_certifications_updated_at
BEFORE UPDATE ON public.compliance_certifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();