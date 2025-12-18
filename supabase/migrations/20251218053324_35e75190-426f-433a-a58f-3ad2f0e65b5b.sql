-- Create driver_profiles table
CREATE TABLE public.driver_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phone_number TEXT NOT NULL,
  full_name TEXT,
  license_number TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  footprint_session_id TEXT,
  footprint_user_id TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.driver_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own driver profile"
ON public.driver_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own driver profile"
ON public.driver_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own driver profile"
ON public.driver_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all driver profiles"
ON public.driver_profiles
FOR SELECT
USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Admins can update all driver profiles"
ON public.driver_profiles
FOR UPDATE
USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Service role can update driver profiles"
ON public.driver_profiles
FOR UPDATE
USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.driver_profiles;

-- Create updated_at trigger
CREATE TRIGGER update_driver_profiles_updated_at
BEFORE UPDATE ON public.driver_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();