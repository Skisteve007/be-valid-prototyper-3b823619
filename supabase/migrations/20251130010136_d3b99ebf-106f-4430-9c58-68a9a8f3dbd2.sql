-- Add status color field to profiles table
ALTER TABLE public.profiles
ADD COLUMN status_color text DEFAULT 'green' CHECK (status_color IN ('green', 'yellow', 'red'));

-- Add comment explaining the field
COMMENT ON COLUMN public.profiles.status_color IS 'QR code border color: green (Clean), yellow (Proceed with Caution), red (Be Aware)';