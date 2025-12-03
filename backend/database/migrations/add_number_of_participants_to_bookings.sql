    -- Migration: Add number_of_participants column to bookings table
    -- Run this in your Supabase SQL Editor

    ALTER TABLE bookings 
    ADD COLUMN IF NOT EXISTS number_of_participants INTEGER DEFAULT 1 CHECK (number_of_participants >= 1 AND number_of_participants <= 20);

    -- Update existing bookings to have default value of 1
    UPDATE bookings 
    SET number_of_participants = 1 
    WHERE number_of_participants IS NULL;

