-- Migration: Integrate mountain_details into mountains table
-- This script adds JSONB columns to store mountain details directly in the mountains table

-- Step 1: Add new columns to mountains table if they don't exist
ALTER TABLE mountains ADD COLUMN IF NOT EXISTS what_to_bring JSONB DEFAULT '[]'::jsonb;
ALTER TABLE mountains ADD COLUMN IF NOT EXISTS budgeting JSONB DEFAULT '[]'::jsonb;
ALTER TABLE mountains ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb;
ALTER TABLE mountains ADD COLUMN IF NOT EXISTS how_to_get_there JSONB DEFAULT '[]'::jsonb;

-- Step 2: Migrate existing data from mountain_details to mountains (if mountain_details table exists)
-- This will combine all details for each mountain into the respective JSON columns
DO $$
BEGIN
  -- Check if mountain_details table exists and migrate data
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'mountain_details'
  ) THEN
    -- Migrate what_to_bring items
    UPDATE mountains
    SET what_to_bring = COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', md.id,
          'item_name', md.item_name,
          'item_description', md.item_description,
          'item_icon', md.item_icon,
          'sort_order', md.sort_order
        ) ORDER BY md.sort_order, md.id
      ) FROM mountain_details md 
      WHERE md.mountain_id = mountains.id 
      AND md.section_type = 'what_to_bring'),
      '[]'::jsonb
    );

    -- Migrate budgeting items
    UPDATE mountains
    SET budgeting = COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', md.id,
          'item_name', md.item_name,
          'item_description', md.item_description,
          'item_amount', md.item_amount,
          'item_unit', md.item_unit,
          'sort_order', md.sort_order
        ) ORDER BY md.sort_order, md.id
      ) FROM mountain_details md 
      WHERE md.mountain_id = mountains.id 
      AND md.section_type = 'budgeting'),
      '[]'::jsonb
    );

    -- Migrate itinerary items
    UPDATE mountains
    SET itinerary = COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', md.id,
          'item_name', md.item_name,
          'item_description', md.item_description,
          'item_time', md.item_time,
          'item_duration', md.item_duration,
          'sort_order', md.sort_order
        ) ORDER BY md.sort_order, md.id
      ) FROM mountain_details md 
      WHERE md.mountain_id = mountains.id 
      AND md.section_type = 'itinerary'),
      '[]'::jsonb
    );

    -- Migrate how_to_get_there items
    UPDATE mountains
    SET how_to_get_there = COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', md.id,
          'item_name', md.item_name,
          'item_description', md.item_description,
          'item_transport_type', md.item_transport_type,
          'sort_order', md.sort_order
        ) ORDER BY md.sort_order, md.id
      ) FROM mountain_details md 
      WHERE md.mountain_id = mountains.id 
      AND md.section_type = 'how_to_get_there'),
      '[]'::jsonb
    );

    RAISE NOTICE 'Migration complete: mountain_details data has been migrated to mountains table';
  ELSE
    RAISE NOTICE 'mountain_details table does not exist, skipping migration';
  END IF;
END $$;

-- Step 3: Optional - Drop old mountain_details table and its RLS policies
-- UNCOMMENT THESE LINES ONLY AFTER CONFIRMING DATA MIGRATION WAS SUCCESSFUL
-- DROP POLICY IF EXISTS "Mountain details are viewable by everyone" ON mountain_details;
-- DROP POLICY IF EXISTS "Only admins can manage mountain details" ON mountain_details;
-- DROP TABLE IF EXISTS mountain_details;

-- Step 4: Verify migration was successful
SELECT 
  id,
  name,
  jsonb_array_length(what_to_bring) as what_to_bring_count,
  jsonb_array_length(budgeting) as budgeting_count,
  jsonb_array_length(itinerary) as itinerary_count,
  jsonb_array_length(how_to_get_there) as how_to_get_there_count
FROM mountains
WHERE what_to_bring != '[]'::jsonb 
   OR budgeting != '[]'::jsonb 
   OR itinerary != '[]'::jsonb 
   OR how_to_get_there != '[]'::jsonb;

COMMIT;
