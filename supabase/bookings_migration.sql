-- 1. Create table if it doesn't exist (with all columns for fresh installs)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  photoshoot_date TIMESTAMP WITH TIME ZONE NOT NULL,
  package_id UUID REFERENCES packages(id),
  package_name TEXT NOT NULL,
  people_count INTEGER DEFAULT 1 NOT NULL,
  child_count INTEGER DEFAULT 0,
  child_dress_count INTEGER DEFAULT 0,
  extra_offer_request TEXT,
  notes TEXT,
  vip_transfer BOOLEAN DEFAULT FALSE,
  basic_makeup BOOLEAN DEFAULT FALSE,
  total_amount NUMERIC(10, 2),
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add columns if table already existed but was missing them (Idempotent updates)
DO $$
BEGIN
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2);
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT;
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS extra_offer_request TEXT;
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS people_count INTEGER DEFAULT 1;
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS child_count INTEGER DEFAULT 0;
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS child_dress_count INTEGER DEFAULT 0;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'Column already exists in bookings.';
END $$;

-- 3. Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 4. Create policy safely (Drop if exists to avoid error, then create)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable insert for all users" ON bookings;
    CREATE POLICY "Enable insert for all users" ON bookings FOR INSERT WITH CHECK (true);
END $$;
