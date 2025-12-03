-- Add status_expiry column to profiles for time-limited verifications (like 14-day driver passes)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status_expiry timestamp with time zone DEFAULT NULL;

-- Add comment explaining the column
COMMENT ON COLUMN public.profiles.status_expiry IS 'Expiration timestamp for time-limited verification passes (e.g., 14-day driver pass)';

-- Create a function to check if a user status has expired
CREATE OR REPLACE FUNCTION public.check_status_expiry()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update expired statuses to grey (expired)
  UPDATE public.profiles 
  SET status_color = 'grey'
  WHERE status_expiry IS NOT NULL 
    AND status_expiry < NOW() 
    AND status_color != 'grey';
END;
$$;