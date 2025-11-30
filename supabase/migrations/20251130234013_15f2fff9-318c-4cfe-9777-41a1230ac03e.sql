-- Add lock state for STD acknowledgement privacy control
ALTER TABLE public.profiles
ADD COLUMN std_acknowledgment_locked boolean DEFAULT true;