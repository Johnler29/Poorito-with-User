// Simple script to check and create mountain_details table using Supabase
const supabase = require('./backend/config/database.js');

async function checkDatabase() {
  try {
    console.log('🔍 Checking mountain_details table...');
    
    // Try to query the mountain_details table
    const { data, error } = await supabase
      .from('mountain_details')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation "mountain_details" does not exist')) {
        console.log('❌ Mountain details table does not exist');
        console.log('📝 Please run the SQL script in your Supabase dashboard:');
        console.log('   1. Go to https://supabase.com/dashboard');
        console.log('   2. Select your project');
        console.log('   3. Go to SQL Editor');
        console.log('   4. Run the contents of add-mountain-details-table.sql');
        return;
      } else {
        throw error;
      }
    }
    
    console.log('✅ Mountain details table exists');
    
    // Check if there are any mountains
    const { data: mountains, error: mountainsError } = await supabase
      .from('mountains')
      .select('id, name')
      .limit(5);
    
    if (mountainsError) {
      throw mountainsError;
    }
    
    console.log('Available mountains:', mountains);
    
    // Check if there are any mountain details
    const { data: details, error: detailsError } = await supabase
      .from('mountain_details')
      .select('id, mountain_id, section_type, item_name')
      .limit(5);
    
    if (detailsError) {
      throw detailsError;
    }
    
    console.log('Mountain details count:', details.length);
    if (details.length > 0) {
      console.log('Sample details:', details);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDatabase();
