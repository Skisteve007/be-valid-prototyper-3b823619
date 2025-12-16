-- Audit logs table to store historical audit results
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL, -- 'HEALTHY', 'WARNING', 'CRITICAL'
  passed INT DEFAULT 0,
  failed INT DEFAULT 0,
  warned INT DEFAULT 0,
  details JSONB,
  trigger_type TEXT DEFAULT 'manual', -- 'manual', 'scheduled', 'deploy'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_status ON public.audit_logs(status);

-- Enable Row-Level Security
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'administrator'::app_role));

-- Policy: Service role can insert (for edge functions)
CREATE POLICY "Service role can insert audit logs" ON public.audit_logs
  FOR INSERT
  WITH CHECK (true);

-- Policy: Admins can manage all audit logs
CREATE POLICY "Admins can manage audit logs" ON public.audit_logs
  FOR ALL
  USING (has_role(auth.uid(), 'administrator'::app_role))
  WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));