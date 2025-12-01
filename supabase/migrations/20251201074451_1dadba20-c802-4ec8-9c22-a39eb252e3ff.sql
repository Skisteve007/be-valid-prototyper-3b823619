-- Drop the existing check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_status_color_check;

-- Add new check constraint that includes 'gray'
ALTER TABLE profiles ADD CONSTRAINT profiles_status_color_check 
CHECK (status_color IN ('green', 'yellow', 'red', 'gray'));