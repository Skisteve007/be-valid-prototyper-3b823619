-- Add sports venue categories to the enum
ALTER TYPE venue_category ADD VALUE IF NOT EXISTS 'NFL Stadium';
ALTER TYPE venue_category ADD VALUE IF NOT EXISTS 'NBA Arena';
ALTER TYPE venue_category ADD VALUE IF NOT EXISTS 'MLB Stadium';
ALTER TYPE venue_category ADD VALUE IF NOT EXISTS 'NHL Arena';
ALTER TYPE venue_category ADD VALUE IF NOT EXISTS 'NCAA Stadium';
ALTER TYPE venue_category ADD VALUE IF NOT EXISTS 'MLS Stadium';