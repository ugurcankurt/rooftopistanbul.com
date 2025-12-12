-- Create a type for package categories
DO $$ BEGIN
    CREATE TYPE package_category AS ENUM ('outdoor', 'studio');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add category column to packages table
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS category package_category DEFAULT 'outdoor';

-- Update existing packages to be 'outdoor' by default
UPDATE packages SET category = 'outdoor' WHERE category IS NULL;
