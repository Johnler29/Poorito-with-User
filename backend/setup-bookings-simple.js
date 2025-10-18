const supabase = require('./config/database');

async function setupBookingsTable() {
  try {
    console.log('🚀 Setting up bookings table...');
    
    // Step 1: Create the table
    console.log('📝 Creating bookings table...');
    const { error: createError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);

    if (createError && createError.message.includes('relation "bookings" does not exist')) {
      console.log('❌ Bookings table does not exist');
      console.log('📝 Please run this SQL in Supabase SQL Editor:');
      console.log('');
      console.log('-- Copy and paste this into Supabase SQL Editor:');
      console.log('CREATE TABLE bookings (');
      console.log('    id BIGSERIAL PRIMARY KEY,');
      console.log('    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,');
      console.log('    mountain_id BIGINT REFERENCES mountains(id) ON DELETE CASCADE,');
      console.log('    booking_date DATE NOT NULL,');
      console.log('    status TEXT CHECK (status IN (\'confirmed\', \'cancelled\', \'completed\')) DEFAULT \'confirmed\',');
      console.log('    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
      console.log('    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
      console.log('    UNIQUE(user_id, mountain_id, booking_date)');
      console.log(');');
      console.log('');
      console.log('-- Then run:');
      console.log('ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;');
      console.log('');
      console.log('-- And the policies:');
      console.log('CREATE POLICY "Users can view their own bookings" ON bookings');
      console.log('    FOR SELECT USING (user_id::text = auth.uid()::text);');
      console.log('');
      console.log('CREATE POLICY "Users can create their own bookings" ON bookings');
      console.log('    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);');
      console.log('');
      console.log('CREATE POLICY "Users can update their own bookings" ON bookings');
      console.log('    FOR UPDATE USING (user_id::text = auth.uid()::text);');
      console.log('');
      console.log('CREATE POLICY "Admins can view all bookings" ON bookings');
      console.log('    FOR SELECT USING (');
      console.log('        EXISTS (');
      console.log('            SELECT 1 FROM users');
      console.log('            WHERE users.id::text = auth.uid()::text');
      console.log('            AND users.role = \'admin\'');
      console.log('        )');
      console.log('    );');
      console.log('');
      console.log('✨ After running the SQL, restart your backend server and try booking again!');
      return false;
    } else if (createError) {
      console.error('❌ Error:', createError.message);
      return false;
    } else {
      console.log('✅ Bookings table already exists!');
      return true;
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

async function main() {
  await setupBookingsTable();
}

main().catch(console.error);
