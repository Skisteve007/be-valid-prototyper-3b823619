-- Create table for Ghost Pass Event Intake submissions
CREATE TABLE public.ghost_pass_event_intakes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Link to vendor/partner if registered
  vendor_id UUID REFERENCES public.partner_venues(id) ON DELETE SET NULL,
  submitter_email TEXT,
  
  -- SECTION 1: Event Basics
  event_name TEXT NOT NULL,
  event_start_date DATE NOT NULL,
  event_end_date DATE,
  venue_name TEXT,
  venue_address TEXT,
  estimated_attendance TEXT,
  
  -- SECTION 2: Entry Structure
  entry_types TEXT[] DEFAULT '{}',
  num_exterior_ga_entry_points INTEGER DEFAULT 0,
  num_exterior_vip_entry_points INTEGER DEFAULT 0,
  num_interior_reentry_points INTEGER DEFAULT 0,
  reentry_allowed BOOLEAN DEFAULT false,
  
  -- SECTION 3: Pass Types & Pricing (stored as JSONB array)
  pass_types JSONB DEFAULT '[]',
  
  -- SECTION 4: Wallet & Payment Rules
  accepted_wallet_methods TEXT[] DEFAULT '{}',
  platform_fee_enabled BOOLEAN DEFAULT false,
  platform_fee_amount NUMERIC(10,2),
  
  -- SECTION 5: Payout & Settlement Details
  legal_business_name TEXT,
  entity_type TEXT,
  bank_account_country TEXT,
  settlement_currency TEXT,
  stripe_connect_exists BOOLEAN DEFAULT false,
  payout_timing TEXT,
  
  -- SECTION 6: Promoter/Account Manager Splits (stored as JSONB array)
  has_promoter BOOLEAN DEFAULT false,
  promoter_splits JSONB DEFAULT '[]',
  
  -- SECTION 7: Vendors & Concessions (stored as JSONB array)
  vendors JSONB DEFAULT '[]',
  
  -- SECTION 8: ID & Sensory Requirements
  id_required_for TEXT[] DEFAULT '{}',
  id_mandatory_at_entry BOOLEAN DEFAULT false,
  additional_attributes TEXT[] DEFAULT '{}',
  
  -- SECTION 9: Operations & Experience
  interaction_method TEXT DEFAULT 'both',
  enable_realtime_dashboard BOOLEAN DEFAULT true,
  estimated_staff_at_peak INTEGER,
  
  -- SECTION 10: Compliance & Notes
  jurisdiction_notes TEXT,
  special_instructions TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'submitted',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);

-- Enable RLS
ALTER TABLE public.ghost_pass_event_intakes ENABLE ROW LEVEL SECURITY;

-- Policy for steve/admin to view all
CREATE POLICY "Steve can view all event intakes"
ON public.ghost_pass_event_intakes
FOR SELECT
USING (public.is_steve_owner());

-- Policy for steve/admin to manage all
CREATE POLICY "Steve can manage all event intakes"
ON public.ghost_pass_event_intakes
FOR ALL
USING (public.is_steve_owner());

-- Policy for anyone to insert (public intake form)
CREATE POLICY "Anyone can submit event intakes"
ON public.ghost_pass_event_intakes
FOR INSERT
WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_ghost_pass_event_intakes_updated_at
BEFORE UPDATE ON public.ghost_pass_event_intakes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();