-- Function to update affiliate pending earnings
CREATE OR REPLACE FUNCTION public.update_affiliate_pending_earnings(_affiliate_id uuid, _amount numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.affiliates 
  SET pending_earnings = pending_earnings + _amount, updated_at = now()
  WHERE id = _affiliate_id;
END;
$$;