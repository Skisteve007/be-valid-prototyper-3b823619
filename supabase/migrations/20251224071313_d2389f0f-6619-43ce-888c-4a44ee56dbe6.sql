-- Create senate_sessions table for audit logging
CREATE TABLE public.senate_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by_email text NOT NULL,
  prompt text NOT NULL,
  domain text DEFAULT 'general',
  status text NOT NULL DEFAULT 'queued',
  budget jsonb DEFAULT '{"max_rounds": 2, "max_total_tokens": 50000, "timeout_seconds_total": 120, "max_total_cost_usd_estimate": 1.0}'::jsonb,
  judge_output_json jsonb,
  confidence numeric,
  completed_at timestamp with time zone,
  error_message text,
  total_latency_ms integer,
  total_tokens_used integer,
  estimated_cost_usd numeric
);

-- Create senate_messages table for round-by-round outputs
CREATE TABLE public.senate_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id text NOT NULL REFERENCES public.senate_sessions(challenge_id) ON DELETE CASCADE,
  round integer NOT NULL DEFAULT 1,
  speaker text NOT NULL,
  provider text NOT NULL,
  model text NOT NULL,
  output_json jsonb NOT NULL,
  latency_ms integer,
  tokens_used integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create senate_conflicts table for contradiction detection
CREATE TABLE public.senate_conflicts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id text NOT NULL REFERENCES public.senate_sessions(challenge_id) ON DELETE CASCADE,
  conflict_question text NOT NULL,
  senators_involved text[] NOT NULL,
  topic text,
  resolved boolean DEFAULT false,
  resolution_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.senate_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.senate_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.senate_conflicts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for senate_sessions
CREATE POLICY "Admins can manage all senate sessions"
ON public.senate_sessions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'steve@bevalid.app'
  )
);

CREATE POLICY "Service role can insert senate sessions"
ON public.senate_sessions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can update senate sessions"
ON public.senate_sessions FOR UPDATE
USING (true);

-- RLS Policies for senate_messages
CREATE POLICY "Admins can view all senate messages"
ON public.senate_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'steve@bevalid.app'
  )
);

CREATE POLICY "Service role can insert senate messages"
ON public.senate_messages FOR INSERT
WITH CHECK (true);

-- RLS Policies for senate_conflicts
CREATE POLICY "Admins can view all senate conflicts"
ON public.senate_conflicts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'steve@bevalid.app'
  )
);

CREATE POLICY "Service role can manage senate conflicts"
ON public.senate_conflicts FOR ALL
USING (true)
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_senate_sessions_challenge_id ON public.senate_sessions(challenge_id);
CREATE INDEX idx_senate_sessions_status ON public.senate_sessions(status);
CREATE INDEX idx_senate_sessions_created_by ON public.senate_sessions(created_by_email);
CREATE INDEX idx_senate_messages_challenge_id ON public.senate_messages(challenge_id);
CREATE INDEX idx_senate_messages_round ON public.senate_messages(round);
CREATE INDEX idx_senate_conflicts_challenge_id ON public.senate_conflicts(challenge_id);