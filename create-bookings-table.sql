-- Poorito Bookings Table Creation
-- Run this in Supabase SQL Editor

-- Step 1: Create the bookings table
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    mountain_id BIGINT REFERENCES mountains(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    status TEXT CHECK (status IN ('confirmed', 'cancelled', 'completed')) DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, mountain_id, booking_date)
);

-- Step 2: Create indexes for better performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_mountain_id ON bookings(mountain_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (user_id::text = auth.uid()::text);

-- Users can create their own bookings
CREATE POLICY "Users can create their own bookings" ON bookings
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

-- Users can update their own bookings
CREATE POLICY "Users can update their own bookings" ON bookings
    FOR UPDATE USING (user_id::text = auth.uid()::text);

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings" ON bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- Step 5: Verify table creation
SELECT 'Bookings table created successfully!' as message;
SELECT COUNT(*) as table_count FROM bookings;
