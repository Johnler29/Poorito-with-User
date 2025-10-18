const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('Please check your .env file for SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
        console.log('📝 Creating bookings table...');
        await createBookingsTable();
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

async function createBookingsTable() {
  try {
    const createTableSQL = `
      -- Bookings table (for trail bookings)
      CREATE TABLE IF NOT EXISTS bookings (
          id BIGSERIAL PRIMARY KEY,
          user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
          mountain_id BIGINT REFERENCES mountains(id) ON DELETE CASCADE,
          booking_date DATE NOT NULL,
          status TEXT CHECK (status IN ('confirmed', 'cancelled', 'completed')) DEFAULT 'confirmed',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, mountain_id, booking_date)
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_mountain_id ON bookings(mountain_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

      -- Enable Row Level Security (RLS)
      ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

      -- RLS Policies for bookings table
      CREATE POLICY "Users can view their own bookings" ON bookings
          FOR SELECT USING (user_id::text = auth.uid()::text);

      CREATE POLICY "Users can create their own bookings" ON bookings
          FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

      CREATE POLICY "Users can update their own bookings" ON bookings
          FOR UPDATE USING (user_id::text = auth.uid()::text);

      CREATE POLICY "Admins can view all bookings" ON bookings
          FOR SELECT USING (
              EXISTS (
                  SELECT 1 FROM users 
                  WHERE users.id::text = auth.uid()::text 
                  AND users.role = 'admin'
              )
          );
    `;

    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) {
      console.error('❌ Error creating bookings table:', error.message);
      console.log('📝 Please run the SQL manually in Supabase SQL Editor:');
      console.log(createTableSQL);
      return false;
    } else {
      console.log('✅ Bookings table created successfully');
      return true;
    }
  } catch (err) {
    console.error('❌ Error creating table:', err.message);
    console.log('📝 Please run the SQL manually in Supabase SQL Editor:');
    console.log(createTableSQL);
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
}

main().catch(console.error);
