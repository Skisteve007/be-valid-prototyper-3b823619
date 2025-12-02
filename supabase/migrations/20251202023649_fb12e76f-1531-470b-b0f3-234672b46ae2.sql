-- Create a manual profile entry for the pitbossent@gmail.com user
-- Note: This assumes the auth.users account exists or will be created via signup

-- First, let's prepare a function to safely insert the profile when the user signs up
CREATE OR REPLACE FUNCTION public.restore_stevieg_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Find the user ID for pitbossent@gmail.com from auth.users
  -- This will work after they sign up
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'pitbossent@gmail.com'
  LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Insert or update the profile with all the saved data
    INSERT INTO public.profiles (
      user_id,
      full_name,
      member_id,
      birthday,
      gender_identity,
      sexual_orientation,
      email_shareable,
      where_from,
      current_home_city,
      relationship_status,
      sexual_preferences,
      lab_certified,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      'Stevie G.',
      'CC-64839958',
      (CURRENT_DATE - INTERVAL '52 years')::date, -- Age 52
      'Male',
      'Straight',
      false, -- Email Private
      'Long Island, New York',
      'Boca Raton, FL',
      'Single',
      'Casual',
      false, -- Not Certified
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      member_id = EXCLUDED.member_id,
      birthday = EXCLUDED.birthday,
      gender_identity = EXCLUDED.gender_identity,
      sexual_orientation = EXCLUDED.sexual_orientation,
      email_shareable = EXCLUDED.email_shareable,
      where_from = EXCLUDED.where_from,
      current_home_city = EXCLUDED.current_home_city,
      relationship_status = EXCLUDED.relationship_status,
      sexual_preferences = EXCLUDED.sexual_preferences,
      lab_certified = EXCLUDED.lab_certified,
      updated_at = NOW();
      
    -- Ensure user has proper role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'paid')
    ON CONFLICT (user_id, role) DO NOTHING;
    
  END IF;
END;
$$;