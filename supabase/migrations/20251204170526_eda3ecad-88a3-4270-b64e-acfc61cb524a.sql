-- Update the handle_new_user trigger to also copy email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, member_id)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, generate_member_id());
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'guest');
  
  RETURN NEW;
END;
$$;

-- Sync existing users' emails from auth.users to profiles
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.user_id = u.id
AND p.email IS NULL;