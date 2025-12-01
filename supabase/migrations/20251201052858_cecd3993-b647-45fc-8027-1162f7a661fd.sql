-- Create marketing_templates table
CREATE TABLE public.marketing_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_name TEXT NOT NULL,
  subject_line TEXT NOT NULL,
  body_content TEXT NOT NULL,
  target_segment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on marketing_templates
ALTER TABLE public.marketing_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage templates
CREATE POLICY "Admins can manage marketing templates"
ON public.marketing_templates
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Add email tracking columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_marketing_email_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_campaign_received TEXT;

-- Create email_campaign_log table to track all sends
CREATE TABLE public.email_campaign_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  campaign_name TEXT NOT NULL,
  template_id UUID REFERENCES public.marketing_templates(id),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_address TEXT NOT NULL
);

-- Enable RLS on email_campaign_log
ALTER TABLE public.email_campaign_log ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view campaign logs
CREATE POLICY "Admins can view campaign logs"
ON public.email_campaign_log
FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Create policy for system to insert campaign logs
CREATE POLICY "System can insert campaign logs"
ON public.email_campaign_log
FOR INSERT
WITH CHECK (true);

-- Create trigger to update updated_at on marketing_templates
CREATE TRIGGER update_marketing_templates_updated_at
BEFORE UPDATE ON public.marketing_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();