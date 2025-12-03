-- Create shadow_leads table for enterprise inquiries
CREATE TABLE public.shadow_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  city TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  inquiry_subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shadow_leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert leads (public form)
CREATE POLICY "Anyone can submit leads" 
ON public.shadow_leads 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Admins can view all leads" 
ON public.shadow_leads 
FOR SELECT 
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Only admins can manage leads
CREATE POLICY "Admins can manage leads" 
ON public.shadow_leads 
FOR ALL 
USING (has_role(auth.uid(), 'administrator'::app_role));