-- Fix the search_path warning on cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_qr_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM qr_access_tokens
  WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$;