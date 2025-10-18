-- Add mountain_details table for dynamic content
CREATE TABLE IF NOT EXISTS mountain_details (
    id BIGSERIAL PRIMARY KEY,
    mountain_id BIGINT REFERENCES mountains(id) ON DELETE CASCADE,
    section_type TEXT CHECK (section_type IN ('what_to_bring', 'budgeting', 'itinerary', 'how_to_get_there')) NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    item_description TEXT,
    item_icon VARCHAR(10), -- For emojis
    item_amount DECIMAL(10,2), -- For pricing
    item_unit VARCHAR(50), -- For pricing units
    item_time VARCHAR(50), -- For itinerary times
    item_duration VARCHAR(50), -- For itinerary durations
    item_transport_type VARCHAR(50), -- For how to get there (private, public)
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mountain_details_mountain_id ON mountain_details(mountain_id);
CREATE INDEX IF NOT EXISTS idx_mountain_details_section_type ON mountain_details(section_type);
CREATE INDEX IF NOT EXISTS idx_mountain_details_sort_order ON mountain_details(sort_order);

-- Enable Row Level Security (RLS)
ALTER TABLE mountain_details ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mountain_details table
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