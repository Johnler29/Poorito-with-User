-- Migration: Add cancelled_at column to bookings table
-- Run this in your Supabase SQL Editor

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;

-- Optional: backfill cancelled_at for existing cancelled bookings that don't have it
UPDATE bookings
SET cancelled_at = updated_at
WHERE status = 'cancelled' AND cancelled_at IS NULL;


