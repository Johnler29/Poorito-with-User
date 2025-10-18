const supabase = require('./config/database');

async function checkBookingsTable() {
  try {
    console.log('🔍 Checking if bookings table exists...');
    
    // Try to query the bookings table
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "bookings" does not exist')) {
        console.log('❌ Bookings table does not exist');
        console.log('📝 Please run the SQL in add-bookings-table.sql in Supabase SQL Editor');
        return false;
      } else {
        console.error('❌ Error checking bookings table:', error.message);
        return false;
      }
    } else {
      console.log('✅ Bookings table exists');
      console.log(`📊 Found ${data.length} bookings`);
      return true;
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

async function testBookingFunctionality() {
  try {
    console.log('🧪 Testing booking functionality...');
    
    // Test creating a booking (this will fail without proper auth, but we can see if the table structure is correct)
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        user_id: 1,
        mountain_id: 1,
        booking_date: '2025-10-20',
        status: 'confirmed'
      }])
      .select();

    if (error) {
      if (error.message.includes('permission denied') || error.message.includes('RLS')) {
        console.log('✅ Table structure is correct (RLS is working)');
        return true;
      } else {
        console.error('❌ Error testing booking:', error.message);
        return false;
      }
    } else {
      console.log('✅ Booking test successful');
      // Clean up test data
      await supabase.from('bookings').delete().eq('id', data[0].id);
      return true;
    }
  } catch (err) {
    console.error('❌ Error testing booking:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Checking Poorito database setup...\n');
  
  const tableExists = await checkBookingsTable();
  if (tableExists) {
    await testBookingFunctionality();
  }
  
  console.log('\n✨ Database check complete!');
  console.log('📝 If the bookings table is missing, run the SQL in add-bookings-table.sql in Supabase SQL Editor');
}

main().catch(console.error);
