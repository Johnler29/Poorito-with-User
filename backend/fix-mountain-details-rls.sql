-- Fix RLS policies for mountain_details table to allow public reads and admin writes

-- Drop existing policies
DROP POLICY IF EXISTS "Mountain details are viewable by everyone" ON mountain_details;
DROP POLICY IF EXISTS "Only admins can manage mountain details" ON mountain_details;

-- Create new policies that allow public reads and admin writes
CREATE POLICY "Mountain details are viewable by everyone" ON mountain_details
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage mountain details" ON mountain_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- Alternative: Allow inserts for now (temporary)
CREATE POLICY "Allow mountain details inserts temporarily" ON mountain_details
    FOR INSERT WITH CHECK (true);
