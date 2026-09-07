DROP POLICY IF EXISTS "Auth users view venue info" ON public.partner_venues;
CREATE POLICY "Venue operators and admins view venue info"
ON public.partner_venues FOR SELECT TO authenticated
USING (public.is_venue_operator(auth.uid(), id) OR public.has_role(auth.uid(), 'administrator'::app_role));

DROP POLICY IF EXISTS "Profiles viewable with valid QR token" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can mark token as used" ON public.qr_access_tokens;
CREATE POLICY "Users can update their own profile tokens"
ON public.qr_access_tokens FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = qr_access_tokens.profile_id AND p.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = qr_access_tokens.profile_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can upload sponsor logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update sponsor logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete sponsor logos" ON storage.objects;
CREATE POLICY "Admins can upload sponsor logos" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'sponsor-logos' AND public.has_role(auth.uid(), 'administrator'::app_role));
CREATE POLICY "Admins can update sponsor logos" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'sponsor-logos' AND public.has_role(auth.uid(), 'administrator'::app_role));
CREATE POLICY "Admins can delete sponsor logos" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'sponsor-logos' AND public.has_role(auth.uid(), 'administrator'::app_role));

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT CASE WHEN _user_id IS NULL OR _role IS NULL THEN false ELSE EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  ) END
$$;

CREATE OR REPLACE FUNCTION public.is_venue_operator(_user_id uuid, _venue_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT CASE WHEN _user_id IS NULL OR _venue_id IS NULL THEN false ELSE EXISTS (
    SELECT 1 FROM public.venue_operators WHERE user_id = _user_id AND venue_id = _venue_id
  ) END
$$;

CREATE OR REPLACE FUNCTION public.has_valid_qr_token(_profile_id uuid, _token text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT CASE WHEN _profile_id IS NULL OR _token IS NULL OR length(_token) < 8 THEN false ELSE EXISTS (
    SELECT 1 FROM public.qr_access_tokens
    WHERE profile_id = _profile_id AND token = _token AND expires_at > now()
  ) END
$$;

DO $$
DECLARE r RECORD;
  keep_auth text[] := ARRAY[
    'generate_synth_codename','get_or_create_synth_entitlement','get_or_create_wallet',
    'get_public_venues','has_role','increment_affiliate_clicks'
  ];
  keep_anon text[] := ARRAY['get_public_venues','increment_affiliate_clicks'];
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig, p.proname
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef AND p.prokind = 'f'
  LOOP
    IF NOT (r.proname = ANY(keep_anon)) THEN
      EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon', r.sig);
    END IF;
    IF NOT (r.proname = ANY(keep_auth)) THEN
      EXECUTE format('REVOKE ALL ON FUNCTION %s FROM authenticated', r.sig);
    END IF;
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.sig);
  END LOOP;
END $$;
