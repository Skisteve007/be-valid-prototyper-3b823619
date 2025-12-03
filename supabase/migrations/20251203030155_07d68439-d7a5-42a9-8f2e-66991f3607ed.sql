-- Create marketing_leads table for cold outreach
CREATE TABLE public.marketing_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Exotic Rental',
  status TEXT NOT NULL DEFAULT 'New',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add constraint for category values
ALTER TABLE public.marketing_leads ADD CONSTRAINT marketing_leads_category_check 
  CHECK (category IN ('Exotic Rental', 'Corporate Fleet', 'Rideshare Boss'));

-- Add constraint for status values
ALTER TABLE public.marketing_leads ADD CONSTRAINT marketing_leads_status_check 
  CHECK (status IN ('New', 'Contacted', 'Interested', 'Not Interested'));

-- Enable RLS
ALTER TABLE public.marketing_leads ENABLE ROW LEVEL SECURITY;

-- Only admins can manage marketing leads
CREATE POLICY "Admins can manage marketing leads"
ON public.marketing_leads
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_marketing_leads_updated_at
BEFORE UPDATE ON public.marketing_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();