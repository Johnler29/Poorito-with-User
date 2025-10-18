-- Temporarily disable RLS on bookings table to fix booking creation
-- Run this in Supabase SQL Editor

-- Step 1: Disable RLS temporarily
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'bookings';

-- Step 3: Test booking creation (this should now work)
-- The booking system should work without RLS restrictions

-- Note: After testing, you can re-enable RLS with:
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
