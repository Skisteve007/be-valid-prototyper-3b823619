-- Add foreign key constraints to member_references table
ALTER TABLE public.member_references
ADD CONSTRAINT member_references_referrer_user_id_fkey 
FOREIGN KEY (referrer_user_id) 
REFERENCES public.profiles(user_id) 
ON DELETE CASCADE;

ALTER TABLE public.member_references
ADD CONSTRAINT member_references_referee_user_id_fkey 
FOREIGN KEY (referee_user_id) 
REFERENCES public.profiles(user_id) 
ON DELETE CASCADE;