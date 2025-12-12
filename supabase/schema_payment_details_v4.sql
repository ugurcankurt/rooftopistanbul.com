-- Add payment_details JSONB column to bookings table
-- This column will store structured billing information like:
-- {
--   "base_price": 100,
--   "people_count": 2,
--   "discount_rate": 0.20,
--   "discount_amount": 20,
--   "extras": [
--     { "name": "VIP Transfer", "price": 100 },
--     { "name": "Makeup", "price": 50 }
--   ],
--   "final_total": 230
-- }

DO $$
BEGIN
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_details JSONB DEFAULT '{}'::jsonb;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'Column payment_details already exists in bookings.';
END $$;
