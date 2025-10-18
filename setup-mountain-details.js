// Setup script for mountain details database integration
// Run this script to set up the mountain_details table

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupMountainDetails() {
  console.log('🚀 Setting up mountain details table...');

  try {
    // Read the SQL file
    const fs = require('fs');
    const sqlContent = fs.readFileSync('add-mountain-details-table.sql', 'utf8');

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });

    if (error) {
      console.error('❌ Error executing SQL:', error);
      return;
    }

    console.log('✅ Mountain details table created successfully!');
    console.log('📋 Next steps:');
    console.log('1. Start your backend server: npm start (in backend folder)');
    console.log('2. Start your frontend: npm start (in Website folder)');
    console.log('3. Go to Admin panel and add mountain details');
    console.log('4. Visit mountain detail pages to see the data');

  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    console.log('\n📝 Manual setup required:');
    console.log('1. Copy the contents of add-mountain-details-table.sql');
    console.log('2. Run it in your Supabase SQL Editor');
    console.log('3. Then start your servers as mentioned above');
  }
}

setupMountainDetails();
