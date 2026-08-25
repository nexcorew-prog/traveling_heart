-- Add optional items that are not included in a tour price.
ALTER TABLE tours
ADD COLUMN IF NOT EXISTS excludes jsonb NOT NULL DEFAULT '[]'::jsonb;