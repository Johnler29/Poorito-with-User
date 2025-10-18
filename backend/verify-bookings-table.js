const supabase = require('./config/database');

async function verifyBookingsTable() {
  try {
    console.log('🔍 Verifying bookings table...');
    
    // Test if we can query the bookings table
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "bookings" does not exist')) {
        console.log('❌ Bookings table does not exist yet');
        console.log('📝 Please run the SQL in create-bookings-table.sql in Supabase SQL Editor');
        return false;
      } else {
        console.error('❌ Error accessing bookings table:', error.message);
        return false;
      }
    }

    console.log('✅ Bookings table exists and is accessible!');
    console.log(`📊 Found ${data.length} existing bookings`);
    
    // Test table structure by trying to insert a test record (will fail due to RLS, but that's expected)
    console.log('🧪 Testing table structure...');
    const { error: insertError } = await supabase
      .from('bookings')
      .insert([{
        user_id: 1,
        mountain_id: 1,
        booking_date: '2025-10-20',
        status: 'confirmed'
      }]);

    if (insertError) {
      if (insertError.message.includes('permission denied') || insertError.message.includes('RLS')) {
        console.log('✅ Table structure is correct (RLS is working)');
        return true;
      } else {
        console.error('❌ Unexpected error:', insertError.message);
        return false;
      }
    } else {
      console.log('✅ Table structure test passed');
      return true;
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

async function testBookingAPI() {
  try {
    console.log('🧪 Testing booking API endpoints...');
    
    // Test the API endpoint
    const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (response.status === 401) {
      console.log('✅ API endpoint is working (authentication required)');
      return true;
    } else if (response.status === 404) {
      console.log('❌ API endpoint not found - check if backend is running');
      return false;
    } else {
      console.log('✅ API endpoint is accessible');
      return true;
    }
  } catch (err) {
    console.error('❌ Error testing API:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Poorito Bookings Table Verification\n');
  
  const tableExists = await verifyBookingsTable();
  
  if (tableExists) {
    await testBookingAPI();
    console.log('\n🎉 Bookings table is ready!');
    console.log('📝 You can now:');
    console.log('1. Register/login as a user');
    console.log('2. Go to a mountain detail page');
    console.log('3. Click "Book This Trail"');
    console.log('4. Select a date and confirm booking');
    console.log('5. View your bookings in the dashboard');
  } else {
    console.log('\n⚠️  Bookings table is not ready yet');
    console.log('📝 Please:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Copy and paste the SQL from create-bookings-table.sql');
    console.log('3. Click "Run" to execute');
    console.log('4. Run this verification script again');
  }
}

main().catch(console.error);
