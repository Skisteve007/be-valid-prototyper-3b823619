-- Billable scan events table with idempotency
CREATE TABLE public.billable_scan_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES partner_venues(id),
  user_id UUID, -- nullable for failed scans
  event_type TEXT NOT NULL CHECK (event_type IN ('door_entry', 'purchase', 'vip_access')),
  fee_amount NUMERIC NOT NULL DEFAULT 0.20,
  idempotency_key TEXT NOT NULL,
  scan_log_id UUID REFERENCES door_scan_log(id),
  pos_transaction_id UUID REFERENCES pos_transactions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  settled_at TIMESTAMPTZ,
  settlement_ledger_id UUID REFERENCES venue_ledger_entries(id),
  
  -- Unique constraint for idempotency
  CONSTRAINT unique_scan_event UNIQUE (idempotency_key)
);

-- Index for settlement queries
CREATE INDEX idx_billable_scan_events_venue_unsettled 
  ON billable_scan_events(venue_id, settled_at) 
  WHERE settled_at IS NULL;

-- Index for grace window lookups
CREATE INDEX idx_billable_scan_events_grace_window 
  ON billable_scan_events(venue_id, user_id, event_type, created_at DESC);

-- Enable RLS
ALTER TABLE public.billable_scan_events ENABLE ROW LEVEL SECURITY;

-- Policy for venue operators to view their venue's scan events
CREATE POLICY "Venue operators can view scan events"
  ON public.billable_scan_events
  FOR SELECT
  USING (is_venue_operator(auth.uid(), venue_id));

-- Function to check if a scan event is within the grace window (prevents double-billing)
CREATE OR REPLACE FUNCTION public.is_within_scan_grace_window(
  p_venue_id UUID,
  p_user_id UUID,
  p_event_type TEXT,
  p_grace_seconds INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM billable_scan_events
    WHERE venue_id = p_venue_id
      AND user_id = p_user_id
      AND event_type = p_event_type
      AND created_at > now() - (p_grace_seconds || ' seconds')::interval
  );
END;
$$;

-- Function to record a billable scan event (idempotent)
CREATE OR REPLACE FUNCTION public.record_billable_scan_event(
  p_venue_id UUID,
  p_user_id UUID,
  p_event_type TEXT,
  p_idempotency_key TEXT,
  p_scan_log_id UUID DEFAULT NULL,
  p_pos_transaction_id UUID DEFAULT NULL,
  p_fee_amount NUMERIC DEFAULT 0.20
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id UUID;
BEGIN
  -- Try to insert, return existing id if idempotency key exists
  INSERT INTO billable_scan_events (
    venue_id, user_id, event_type, idempotency_key, 
    scan_log_id, pos_transaction_id, fee_amount
  )
  VALUES (
    p_venue_id, p_user_id, p_event_type, p_idempotency_key,
    p_scan_log_id, p_pos_transaction_id, p_fee_amount
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id INTO v_event_id;
  
  -- If insert succeeded, also update venue_scan_counts for tracking
  IF v_event_id IS NOT NULL THEN
    INSERT INTO venue_scan_counts (venue_id, month_year, scan_count, gas_fees_collected)
    VALUES (p_venue_id, to_char(now(), 'YYYY-MM'), 1, p_fee_amount)
    ON CONFLICT (venue_id, month_year) DO UPDATE
    SET scan_count = venue_scan_counts.scan_count + 1,
        gas_fees_collected = venue_scan_counts.gas_fees_collected + p_fee_amount,
        updated_at = now();
  ELSE
    -- Get existing event id for return
    SELECT id INTO v_event_id FROM billable_scan_events WHERE idempotency_key = p_idempotency_key;
  END IF;
  
  RETURN v_event_id;
END;
$$;