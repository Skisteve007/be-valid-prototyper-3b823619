-- Drop existing check constraint and add new one with Sports
ALTER TABLE partner_venues DROP CONSTRAINT IF EXISTS valid_industry_type;

ALTER TABLE partner_venues ADD CONSTRAINT valid_industry_type 
CHECK (industry_type IN ('Nightlife', 'Adult', 'Workforce', 'Transportation', 'Rentals', 'Sports'));