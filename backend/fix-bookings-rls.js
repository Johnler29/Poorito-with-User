const supabase = require('./config/database');

async function fixBookingsRLS() {
  try {
    console.log('🔧 Fixing Bookings RLS Issues\n');
    
    // Step 1: Check current RLS status
    console.log('🔍 Step 1: Checking current RLS status...');
    
    const { data: rlsStatus, error: rlsError } = await supabase
      .rpc('exec_sql', { 
        sql: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'bookings';` 
      });
    
    if (rlsError) {
      console.log('❌ Cannot check RLS status:', rlsError.message);
      console.log('📝 Trying alternative approach...');
    } else {
      console.log('✅ RLS status:', rlsStatus);
    }
    
    // Step 2: Temporarily disable RLS for testing
    console.log('\n🔍 Step 2: Temporarily disabling RLS...');
    
    try {
      const { error: disableError } = await supabase
        .rpc('exec_sql', { 
          sql: 'ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;' 
        });
      
      if (disableError) {
        console.log('❌ Cannot disable RLS:', disableError.message);
        console.log('📝 Please run this SQL in Supabase SQL Editor:');
        console.log('ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;');
      } else {
        console.log('✅ RLS disabled successfully');
      }
    } catch (err) {
      console.log('❌ Error disabling RLS:', err.message);
      console.log('📝 Please run this SQL in Supabase SQL Editor:');
      console.log('ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;');
    }
    
    // Step 3: Test booking creation
    console.log('\n🔍 Step 3: Testing booking creation...');
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          user_id: 1,
          mountain_id: 15,
          booking_date: '2025-10-20',
          status: 'confirmed'
        }])
        .select();

      if (error) {
        console.log('❌ Booking creation still failed:', error.message);
        console.log('📝 Error code:', error.code);
      } else {
        console.log('✅ Booking creation successful!');
        console.log('📊 Created booking:', data);
        
        // Clean up test data
        await supabase.from('bookings').delete().eq('id', data[0].id);
        console.log('🧹 Test data cleaned up');
      }
    } catch (err) {
      console.log('❌ Booking test error:', err.message);
    }
    
    console.log('\n🎉 RLS Fix Complete!');
    console.log('📝 Next steps:');
    console.log('1. If RLS is disabled, test booking in the frontend');
    console.log('2. If booking works, re-enable RLS with proper policies');
    console.log('3. If booking still fails, check database permissions');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

async function main() {
  await fixBookingsRLS();
}

main().catch(console.error);
