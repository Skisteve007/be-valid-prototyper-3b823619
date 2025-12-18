-- Create verifications table for Footprint webhook results
CREATE TABLE public.verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  validation_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own verifications"
ON public.verifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert verifications"
ON public.verifications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can update verifications"
ON public.verifications FOR UPDATE
USING (true);

CREATE POLICY "Admins can view all verifications"
ON public.verifications FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.verifications;

-- Create updated_at trigger
CREATE TRIGGER update_verifications_updated_at
BEFORE UPDATE ON public.verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();