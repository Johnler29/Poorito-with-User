const supabase = require('./config/database');

async function addBookingsTable() {
  try {
    console.log('🚀 Adding bookings table to Supabase...');
    
    // First, let's check if the table already exists
    console.log('🔍 Checking if bookings table exists...');
    const { data: existingTable, error: checkError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);

    if (!checkError) {
      console.log('✅ Bookings table already exists!');
      return true;
    }

    if (checkError && !checkError.message.includes('relation "bookings" does not exist')) {
      console.error('❌ Error checking table:', checkError.message);
      return false;
    }

    console.log('📝 Bookings table does not exist. Creating it...');
    
    // Since we can't execute raw SQL directly, we'll use a different approach
    // Let's try to create the table by attempting to insert a test record
    // This will fail but might trigger table creation in some setups
    
    console.log('⚠️  Cannot create table programmatically.');
    console.log('📝 Please run this SQL in Supabase SQL Editor:');
    console.log('');
    console.log('-- Copy and paste this into Supabase SQL Editor:');
    console.log('');
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
    console.log('-- Create indexes:');
    console.log('CREATE INDEX idx_bookings_user_id ON bookings(user_id);');
    console.log('CREATE INDEX idx_bookings_mountain_id ON bookings(mountain_id);');
    console.log('CREATE INDEX idx_bookings_date ON bookings(booking_date);');
    console.log('CREATE INDEX idx_bookings_status ON bookings(status);');
    console.log('');
    console.log('-- Enable RLS:');
    console.log('ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;');
    console.log('');
    console.log('-- Add policies:');
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
    console.log('✨ After running the SQL, restart your backend server!');
    
    return false;
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

async function testAfterCreation() {
  try {
    console.log('🧪 Testing bookings table after creation...');
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Table still not accessible:', error.message);
      return false;
    }

    console.log('✅ Bookings table is now accessible!');
    console.log(`📊 Found ${data.length} existing bookings`);
    return true;
  } catch (err) {
    console.error('❌ Error testing table:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Poorito Bookings Table Setup\n');
  
  const tableExists = await addBookingsTable();
  
  if (tableExists) {
    await testAfterCreation();
  }
  
  console.log('\n✨ Setup instructions complete!');
  console.log('📝 Next steps:');
  console.log('1. Go to Supabase Dashboard → SQL Editor');
  console.log('2. Copy and paste the SQL commands above');
  console.log('3. Click "Run" to execute');
  console.log('4. Restart your backend server');
  console.log('5. Test booking functionality');
}

main().catch(console.error);
