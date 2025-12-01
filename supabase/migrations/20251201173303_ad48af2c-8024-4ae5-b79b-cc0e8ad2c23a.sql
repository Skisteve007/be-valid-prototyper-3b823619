-- Add category column to sponsors table to distinguish sponsor types
ALTER TABLE sponsors ADD COLUMN category text DEFAULT 'general';

-- Add check constraint for valid categories
ALTER TABLE sponsors ADD CONSTRAINT sponsors_category_check 
CHECK (category IN ('general', 'lab_certified', 'toxicology'));

-- Create index for faster category queries
CREATE INDEX idx_sponsors_category ON sponsors(category);