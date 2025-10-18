// Check if the database has been migrated to the new schema
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 Checking database schema...\n');

  try {
    // Check if mountains table has the new JSONB columns
    const { data: mountains, error } = await supabase
      .from('mountains')
      .select('id, name, what_to_bring, budgeting, itinerary, how_to_get_there')
      .limit(1);

    if (error) {
      console.log('❌ Error checking mountains table:', error.message);
      
      if (error.message.includes('column "what_to_bring" does not exist')) {
        console.log('\n🚨 MIGRATION NEEDED!');
        console.log('The database has not been migrated yet.');
        console.log('You need to run the migration script in Supabase SQL Editor.');
        console.log('\nSteps:');
        console.log('1. Go to Supabase Dashboard');
        console.log('2. Click SQL Editor');
        console.log('3. Create New Query');
        console.log('4. Copy contents of: backend/migrate-to-integrated-schema.sql');
        console.log('5. Paste and click RUN');
        return;
      }
      
      return;
    }

    console.log('✅ Mountains table structure looks good');
    console.log('✅ JSONB columns exist:', {
      what_to_bring: mountains[0]?.what_to_bring !== undefined ? '✅' : '❌',
      budgeting: mountains[0]?.budgeting !== undefined ? '✅' : '❌',
      itinerary: mountains[0]?.itinerary !== undefined ? '✅' : '❌',
      how_to_get_there: mountains[0]?.how_to_get_there !== undefined ? '✅' : '❌'
    });

    // Check if there's any data in the JSONB columns
    const { data: allMountains, error: allError } = await supabase
      .from('mountains')
      .select('id, name, what_to_bring, budgeting, itinerary, how_to_get_there');

    if (allError) {
      console.log('❌ Error fetching all mountains:', allError.message);
      return;
    }

    console.log('\n📊 Data Summary:');
    allMountains.forEach(mountain => {
      const counts = {
        what_to_bring: Array.isArray(mountain.what_to_bring) ? mountain.what_to_bring.length : 0,
        budgeting: Array.isArray(mountain.budgeting) ? mountain.budgeting.length : 0,
        itinerary: Array.isArray(mountain.itinerary) ? mountain.itinerary.length : 0,
        how_to_get_there: Array.isArray(mountain.how_to_get_there) ? mountain.how_to_get_there.length : 0
      };
      
      const total = counts.what_to_bring + counts.budgeting + counts.itinerary + counts.how_to_get_there;
      
      if (total > 0) {
        console.log(`  ${mountain.name}: ${total} items total`);
        console.log(`    - What to Bring: ${counts.what_to_bring}`);
        console.log(`    - Budgeting: ${counts.budgeting}`);
        console.log(`    - Itinerary: ${counts.itinerary}`);
        console.log(`    - How to Get There: ${counts.how_to_get_there}`);
      }
    });

    // Check if mountain_details table still exists
    const { data: details, error: detailsError } = await supabase
      .from('mountain_details')
      .select('count')
      .limit(1);

    if (detailsError && detailsError.message.includes('relation "mountain_details" does not exist')) {
      console.log('\n✅ mountain_details table has been removed (good!)');
    } else if (!detailsError) {
      console.log('\n⚠️  mountain_details table still exists');
      console.log('   You may want to drop it after confirming migration worked');
    }

    console.log('\n🎉 Database schema check complete!');
    console.log('\nNext steps:');
    console.log('1. If migration is needed, run it in Supabase');
    console.log('2. Restart your backend server');
    console.log('3. Test the form in the admin panel');

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

checkSchema();
