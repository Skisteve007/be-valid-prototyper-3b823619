-- Add new validity fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_valid boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS validity_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS employer_id uuid;

-- Create organizations table for workforce management
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  compliance_interval_days integer DEFAULT 60,
  contact_email text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Admins can manage organizations" ON public.organizations
FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Organization members can view their organization" ON public.organizations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.employer_id = organizations.id 
    AND profiles.user_id = auth.uid()
  )
);

-- Add foreign key for employer_id
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_employer_id_fkey 
FOREIGN KEY (employer_id) REFERENCES public.organizations(id) ON DELETE SET NULL;

-- Create index for validity expiration checks
CREATE INDEX IF NOT EXISTS idx_profiles_validity_expires_at ON public.profiles(validity_expires_at);
CREATE INDEX IF NOT EXISTS idx_profiles_is_valid ON public.profiles(is_valid);
CREATE INDEX IF NOT EXISTS idx_profiles_employer_id ON public.profiles(employer_id);