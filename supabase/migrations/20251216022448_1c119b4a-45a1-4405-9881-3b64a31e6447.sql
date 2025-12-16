-- Create function to increment global stats
CREATE OR REPLACE FUNCTION public.increment_global_stat(stat_name TEXT, increment_by BIGINT DEFAULT 1)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.global_stats 
  SET stat_value = stat_value + increment_by,
      last_updated = NOW()
  WHERE stat_key = stat_name;
END;
$$;