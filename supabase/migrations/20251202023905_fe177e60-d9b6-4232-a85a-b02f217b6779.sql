-- Update the profile restoration function with complete profile data
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
      instagram_handle,
      tiktok_handle,
      facebook_handle,
      onlyfans_handle,
      vices,
      partner_preferences,
      covid_vaccinated,
      circumcised,
      smoker,
      status_color,
      user_interests,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      'Stevie G.',
      'CC-64839958',
      '1973-01-01'::date, -- January 1, 1973 (Age 52)
      'Male',
      'Straight',
      false, -- Email Private
      'long Island, New York',
      'Boca Raton ,Fl',
      'Single',
      'Casual',
      false, -- Not Certified
      '@dj_steveng',
      '@username',
      'Profile URL or username',
      '@username',
      ARRAY['Drinking', 'Party enhancers']::text[],
      '[]'::jsonb,
      false,
      false,
      false,
      'green', -- Default status color
      '{"Social Dynamic": ["Couples", "Singles", "Groups", "One-on-One", "Observing", "Full Swap", "Soft Swap", "Throuple"]}'::jsonb,
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
      instagram_handle = EXCLUDED.instagram_handle,
      tiktok_handle = EXCLUDED.tiktok_handle,
      facebook_handle = EXCLUDED.facebook_handle,
      onlyfans_handle = EXCLUDED.onlyfans_handle,
      vices = EXCLUDED.vices,
      partner_preferences = EXCLUDED.partner_preferences,
      covid_vaccinated = EXCLUDED.covid_vaccinated,
      circumcised = EXCLUDED.circumcised,
      smoker = EXCLUDED.smoker,
      status_color = EXCLUDED.status_color,
      user_interests = EXCLUDED.user_interests,
      updated_at = NOW();
      
    -- Ensure user has proper role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'paid')
    ON CONFLICT (user_id, role) DO NOTHING;
    
  END IF;
END;
$$;