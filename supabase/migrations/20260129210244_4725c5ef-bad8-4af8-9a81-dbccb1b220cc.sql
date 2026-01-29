-- Create table for AI Governance Intake submissions
CREATE TABLE public.ai_governance_intakes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Required fields
  full_name TEXT NOT NULL,
  work_email TEXT NOT NULL,
  organization TEXT NOT NULL,
  system_name TEXT NOT NULL,
  
  -- Section 0 - Contact (optional)
  role_team TEXT,
  preferred_followup TEXT[] DEFAULT '{}',
  
  -- Section 1 - System Context
  primary_use_case TEXT[] DEFAULT '{}',
  prompting_pattern TEXT[] DEFAULT '{}',
  system_description TEXT,
  
  -- Section 2 - Risk
  primary_risk TEXT[] DEFAULT '{}',
  potential_impact TEXT[] DEFAULT '{}',
  applicable_policies TEXT[] DEFAULT '{}',
  
  -- Section 3 - Model Inventory
  ai_providers TEXT[] DEFAULT '{}',
  models_tested TEXT,
  runtime_environment TEXT[] DEFAULT '{}',
  
  -- Section 4 - Evaluation Goals
  evaluation_focus TEXT[] DEFAULT '{}',
  metrics_used TEXT[] DEFAULT '{}',
  
  -- Section 5 - Datasets
  ground_truth_available TEXT,
  dataset_type TEXT[] DEFAULT '{}',
  dataset_versioning BOOLEAN DEFAULT false,
  
  -- Section 6 - Pipelines
  evaluation_frameworks TEXT[] DEFAULT '{}',
  automation_level TEXT,
  
  -- Section 7 - Outputs
  success_30_days TEXT,
  preferred_reporting TEXT[] DEFAULT '{}',
  
  -- Section 8 - Constraints
  budget_sensitivity TEXT,
  update_cadence TEXT
);

-- Enable RLS
ALTER TABLE public.ai_governance_intakes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public intake form)
CREATE POLICY "Anyone can submit intake" 
ON public.ai_governance_intakes 
FOR INSERT 
WITH CHECK (true);

-- Only steve owner can view intakes
CREATE POLICY "Steve owner can view intakes" 
ON public.ai_governance_intakes 
FOR SELECT 
USING (public.is_steve_owner());