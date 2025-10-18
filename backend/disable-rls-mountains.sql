-- Disable RLS on mountains table to allow updates without authentication
-- Run this in your Supabase SQL Editor

ALTER TABLE mountains DISABLE ROW LEVEL SECURITY;

-- Verify the change
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
