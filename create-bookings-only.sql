-- Poorito Bookings Table Creation (Standalone)
-- Run this in Supabase SQL Editor

-- Step 1: Create the bookings table
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

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mountain_id ON bookings(mountain_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies (only if they don't exist)
DO $$ 
BEGIN
    -- Users can view their own bookings
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Users can view their own bookings'
    ) THEN
        CREATE POLICY "Users can view their own bookings" ON bookings
            FOR SELECT USING (user_id::text = auth.uid()::text);
    END IF;

    -- Users can create their own bookings
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Users can create their own bookings'
    ) THEN
        CREATE POLICY "Users can create their own bookings" ON bookings
            FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);
    END IF;

    -- Users can update their own bookings
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Users can update their own bookings'
    ) THEN
        CREATE POLICY "Users can update their own bookings" ON bookings
            FOR UPDATE USING (user_id::text = auth.uid()::text);
    END IF;

    -- Admins can view all bookings
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Admins can view all bookings'
    ) THEN
        CREATE POLICY "Admins can view all bookings" ON bookings
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM users 
                    WHERE users.id::text = auth.uid()::text 
                    AND users.role = 'admin'
                )
            );
    END IF;
END $$;

-- Step 5: Verify table creation
SELECT 'Bookings table created successfully!' as message;
SELECT COUNT(*) as table_count FROM bookings;
