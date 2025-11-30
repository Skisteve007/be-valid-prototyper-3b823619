-- Create member_references table to track reference relationships
CREATE TABLE public.member_references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_user_id UUID NOT NULL,
  referee_user_id UUID NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(referrer_user_id, referee_user_id)
);

-- Enable RLS
ALTER TABLE public.member_references ENABLE ROW LEVEL SECURITY;

-- Users can view references where they are the referrer
CREATE POLICY "Users can view their own references"
ON public.member_references
FOR SELECT
USING (auth.uid() = referrer_user_id);

-- Users can view references where they are the referee
CREATE POLICY "Users can view references to them"
ON public.member_references
FOR SELECT
USING (auth.uid() = referee_user_id);

-- Users can create references
CREATE POLICY "Users can create references"
ON public.member_references
FOR INSERT
WITH CHECK (auth.uid() = referrer_user_id);

-- Users can delete their own references
CREATE POLICY "Users can delete their own references"
ON public.member_references
FOR DELETE
USING (auth.uid() = referrer_user_id);

-- Referees can update verification status
CREATE POLICY "Referees can verify references"
ON public.member_references
FOR UPDATE
USING (auth.uid() = referee_user_id)
WITH CHECK (auth.uid() = referee_user_id);

-- Admins can view all references
CREATE POLICY "Admins can view all references"
ON public.member_references
FOR SELECT
USING (has_role(auth.uid(), 'administrator'));

-- Create index for performance
CREATE INDEX idx_member_references_referrer ON public.member_references(referrer_user_id);
CREATE INDEX idx_member_references_referee ON public.member_references(referee_user_id);