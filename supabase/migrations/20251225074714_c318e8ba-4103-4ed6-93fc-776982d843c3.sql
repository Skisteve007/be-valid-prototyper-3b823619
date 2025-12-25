-- Create strategic_investors table to store complete investor information
CREATE TABLE public.strategic_investors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  
  -- Investment Details
  investment_amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  payment_handle TEXT,
  referral_code TEXT,
  
  -- Investor Qualification
  accredited_status TEXT NOT NULL,
  investment_experience TEXT NOT NULL,
  source_of_funds TEXT,
  investment_objective TEXT NOT NULL,
  risk_tolerance TEXT NOT NULL,
  referral_source TEXT,
  
  -- Payment Status
  payment_status TEXT DEFAULT 'pending',
  payment_completed_at TIMESTAMP WITH TIME ZONE,
  stripe_payment_intent TEXT,
  
  -- Confirmation
  confirmation_email_sent BOOLEAN DEFAULT false,
  admin_email_sent BOOLEAN DEFAULT false,
  
  -- Notes
  admin_notes TEXT
);

-- Enable RLS
ALTER TABLE public.strategic_investors ENABLE ROW LEVEL SECURITY;

-- Admin can view all investors (using has_role function with correct app_role)
CREATE POLICY "Admins can view all strategic investors"
ON public.strategic_investors
FOR SELECT
USING (public.has_role(auth.uid(), 'administrator'));

-- Admin can update investors
CREATE POLICY "Admins can update strategic investors"
ON public.strategic_investors
FOR UPDATE
USING (public.has_role(auth.uid(), 'administrator'));

-- Allow insert from service role (edge functions)
CREATE POLICY "Service role can insert strategic investors"
ON public.strategic_investors
FOR INSERT
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_strategic_investors_email ON public.strategic_investors(email);
CREATE INDEX idx_strategic_investors_referral_code ON public.strategic_investors(referral_code);
CREATE INDEX idx_strategic_investors_payment_status ON public.strategic_investors(payment_status);

-- Add trigger for updated_at
CREATE TRIGGER update_strategic_investors_updated_at
BEFORE UPDATE ON public.strategic_investors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();