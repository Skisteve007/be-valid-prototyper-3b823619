-- Create stripe_webhook_events table for logging Stripe webhooks
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  response_status integer,
  response_body text,
  error_message text,
  processed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_created_at ON public.stripe_webhook_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_event_type ON public.stripe_webhook_events(event_type);

-- Enable RLS
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- Admin-only access to webhook events
CREATE POLICY "Admins can view stripe webhook events" 
ON public.stripe_webhook_events 
FOR SELECT 
USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Service role can insert stripe webhook events" 
ON public.stripe_webhook_events 
FOR INSERT 
WITH CHECK (true);