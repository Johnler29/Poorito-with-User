-- Add bookings table to existing Poorito database
-- Run this in your Supabase SQL Editor

-- Bookings table (for trail bookings)
CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    mountain_id BIGINT REFERENCES mountains(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    status TEXT CHECK (status IN ('confirmed', 'cancelled', 'completed')) DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, mountain_id, booking_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mountain_id ON bookings(mountain_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings table
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can create their own bookings" ON bookings
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own bookings" ON bookings
    FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can view all bookings" ON bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );
