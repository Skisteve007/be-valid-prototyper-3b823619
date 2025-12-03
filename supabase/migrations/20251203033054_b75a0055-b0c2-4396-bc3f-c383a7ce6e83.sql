-- Add industry_type column to partner_venues table
ALTER TABLE public.partner_venues 
ADD COLUMN industry_type text DEFAULT 'Nightlife';

-- Add a check constraint for valid industry types
ALTER TABLE public.partner_venues 
ADD CONSTRAINT valid_industry_type 
CHECK (industry_type IN ('Nightlife', 'Adult', 'Workforce', 'Transportation', 'Rentals'));