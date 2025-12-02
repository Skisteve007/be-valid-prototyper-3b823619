-- First, let's manually create the missing profile for the existing admin user
INSERT INTO public.profiles (user_id, full_name, member_id)
SELECT '88603f17-fc3a-4bcd-a267-1e2b2b5d9adb'::uuid, 'Administrator', generate_member_id()
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE user_id = '88603f17-fc3a-4bcd-a267-1e2b2b5d9adb'::uuid
);

-- Ensure the trigger function exists and is correct
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, member_id)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', generate_member_id());
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'guest');
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger to ensure it's properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();