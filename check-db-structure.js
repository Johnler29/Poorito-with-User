// Check the actual database structure
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStructure() {
  console.log('🔍 Checking database structure...\n');

  try {
    // Try to select the new columns directly
    const { data, error } = await supabase
      .from('mountains')
      .select('id, name, what_to_bring, budgeting, itinerary, how_to_get_there')
      .limit(1);

    if (error) {
      console.log('❌ Error:', error.message);
      
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('\n🚨 PROBLEM FOUND!');
        console.log('The JSONB columns were not added to the mountains table.');
        console.log('\nThe migration script may have failed silently.');
        console.log('\nSOLUTION:');
        console.log('1. Go to Supabase SQL Editor');
        console.log('2. Run this simple command:');
        console.log(`
ALTER TABLE mountains ADD COLUMN IF NOT EXISTS what_to_bring JSONB DEFAULT '[]'::jsonb;
ALTER TABLE mountains ADD COLUMN IF NOT EXISTS budgeting JSONB DEFAULT '[]'::jsonb;
ALTER TABLE mountains ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb;
ALTER TABLE mountains ADD COLUMN IF NOT EXISTS how_to_get_there JSONB DEFAULT '[]'::jsonb;
        `);
        console.log('3. Click RUN');
        console.log('4. Test again');
        return;
      }
    }

    console.log('✅ Columns exist!');
    console.log('Sample data:', data[0]);
    
    // Check if the columns have the right structure
    const sample = data[0];
    const checks = {
      what_to_bring: Array.isArray(sample.what_to_bring),
      budgeting: Array.isArray(sample.budgeting),
      itinerary: Array.isArray(sample.itinerary),
      how_to_get_there: Array.isArray(sample.how_to_get_there)
    };
    
    console.log('\nColumn structure check:');
    Object.entries(checks).forEach(([col, isArray]) => {
      console.log(`  ${col}: ${isArray ? '✅' : '❌'} ${isArray ? 'Array' : 'Not array'}`);
    });
    
    if (Object.values(checks).every(Boolean)) {
      console.log('\n✅ Database structure looks correct!');
      console.log('The issue might be elsewhere...');
    } else {
      console.log('\n❌ Some columns are not arrays');
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

checkStructure();
