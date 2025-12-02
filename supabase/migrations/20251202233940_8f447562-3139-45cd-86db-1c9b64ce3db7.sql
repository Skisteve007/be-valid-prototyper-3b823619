-- Add Resort and Lifestyle to venue_category enum
ALTER TYPE venue_category ADD VALUE IF NOT EXISTS 'Resort';
ALTER TYPE venue_category ADD VALUE IF NOT EXISTS 'Lifestyle';