-- Add approval status columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS investor_access_approved boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS partner_access_approved boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS investor_access_requested_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS partner_access_requested_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS investor_access_approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS partner_access_approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS access_approved_by uuid REFERENCES auth.users(id);

-- Create index for quick lookup of pending approvals
CREATE INDEX IF NOT EXISTS idx_profiles_pending_investor ON public.profiles(investor_access_approved) 
WHERE investor_access_requested_at IS NOT NULL AND investor_access_approved = false;

CREATE INDEX IF NOT EXISTS idx_profiles_pending_partner ON public.profiles(partner_access_approved) 
WHERE partner_access_requested_at IS NOT NULL AND partner_access_approved = false;