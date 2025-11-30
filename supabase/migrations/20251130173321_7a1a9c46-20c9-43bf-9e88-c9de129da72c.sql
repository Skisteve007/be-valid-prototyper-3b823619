-- Add section column to sponsors table to designate which section the sponsor appears in
ALTER TABLE public.sponsors 
ADD COLUMN section integer DEFAULT 1 CHECK (section >= 1 AND section <= 3);

-- Add comment to explain the column
COMMENT ON COLUMN public.sponsors.section IS 'Designates which sponsor section this logo appears in (1, 2, or 3)';

-- Update existing sponsors to have default section if needed
UPDATE public.sponsors 
SET section = 1 
WHERE section IS NULL;