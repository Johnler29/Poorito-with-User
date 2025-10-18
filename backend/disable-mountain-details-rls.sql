-- Disable RLS on mountains table to allow updates without authentication
-- This is a temporary measure for development

ALTER TABLE mountains DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS but allow public updates:
-- ALTER TABLE mountains ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Only admins can update mountains" ON mountains;
-- CREATE POLICY "Anyone can update mountains" ON mountains
--     FOR UPDATE USING (true);
