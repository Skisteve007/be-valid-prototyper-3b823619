-- Create lab_partners table for managing authorized lab integrations
CREATE TABLE public.lab_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_email TEXT,
  api_key TEXT UNIQUE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.lab_partners ENABLE ROW LEVEL SECURITY;

-- Only admins can manage lab partners
CREATE POLICY "Admins can manage lab partners"
ON public.lab_partners
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_lab_partners_updated_at
BEFORE UPDATE ON public.lab_partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster API key lookups
CREATE INDEX idx_lab_partners_api_key ON public.lab_partners(api_key);

-- Add legal disclaimer acceptance tracking
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS lab_disclaimer_accepted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS lab_disclaimer_accepted_at TIMESTAMP WITH TIME ZONE;