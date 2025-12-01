-- Create webhook events table for API interaction logging
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  response_status integer NOT NULL,
  response_body jsonb,
  error_message text,
  lab_partner_id uuid REFERENCES public.lab_partners(id) ON DELETE SET NULL,
  related_order_id uuid REFERENCES public.lab_orders(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create exception queue table for automated handling
CREATE TABLE IF NOT EXISTS public.exception_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.lab_orders(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  exception_type text NOT NULL,
  exception_reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notified_at timestamp with time zone,
  resolved_at timestamp with time zone,
  resolved_by uuid,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exception_queue ENABLE ROW LEVEL SECURITY;

-- Webhook events policies (admins only)
CREATE POLICY "Admins can view webhook events"
  ON public.webhook_events
  FOR SELECT
  USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "System can insert webhook events"
  ON public.webhook_events
  FOR INSERT
  WITH CHECK (true);

-- Exception queue policies
CREATE POLICY "Admins can view all exceptions"
  ON public.exception_queue
  FOR SELECT
  USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Admins can update exceptions"
  ON public.exception_queue
  FOR UPDATE
  USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Users can view their own exceptions"
  ON public.exception_queue
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert exceptions"
  ON public.exception_queue
  FOR INSERT
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_webhook_events_created_at ON public.webhook_events(created_at DESC);
CREATE INDEX idx_webhook_events_event_type ON public.webhook_events(event_type);
CREATE INDEX idx_webhook_events_lab_partner ON public.webhook_events(lab_partner_id);
CREATE INDEX idx_exception_queue_status ON public.exception_queue(status);
CREATE INDEX idx_exception_queue_user_id ON public.exception_queue(user_id);
CREATE INDEX idx_exception_queue_created_at ON public.exception_queue(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_exception_queue_updated_at
  BEFORE UPDATE ON public.exception_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();