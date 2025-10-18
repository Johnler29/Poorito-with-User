const { createUserClient } = require('./config/user-database');

async function debugUserClient() {
  try {
    console.log('🔍 Debugging User Client\n');
    
    // Step 1: Register a test user
    console.log('🔍 Step 1: Registering test user...');
    const testUser = {
      username: 'debuguser' + Date.now(),
      email: 'debug' + Date.now() + '@example.com',
      password: 'password123'
    };

    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json();
    
    if (registerResponse.status === 201) {
      console.log('✅ User registration successful');
      console.log('📧 User:', testUser.email);
      console.log('🔑 Token:', registerData.token.substring(0, 20) + '...');
      
      // Step 2: Test user client creation
      console.log('\n🔍 Step 2: Testing user client...');
      
      try {
        const userSupabase = createUserClient(registerData.token);
        console.log('✅ User client created successfully');
        
        // Step 3: Test querying bookings
        console.log('\n🔍 Step 3: Testing bookings query...');
        
        const { data: bookings, error } = await userSupabase
          .from('bookings')
          .select('*')
          .limit(1);
        
        if (error) {
          console.log('❌ Bookings query error:', error.message);
          console.log('📝 Error code:', error.code);
          console.log('📝 Error details:', error.details);
        } else {
          console.log('✅ Bookings query successful');
          console.log('📊 Found bookings:', bookings.length);
        }
        
        // Step 4: Test checking existing booking
        console.log('\n🔍 Step 4: Testing existing booking check...');
        
        const { data: existingBooking, error: checkError } = await userSupabase
          .from('bookings')
          .select('id')
          .eq('mountain_id', 15)
          .eq('booking_date', '2025-10-20');
        
        if (checkError) {
          console.log('❌ Existing booking check error:', checkError.message);
          console.log('📝 Error code:', checkError.code);
          console.log('📝 Error details:', checkError.details);
        } else {
          console.log('✅ Existing booking check successful');
          console.log('📊 Found existing bookings:', existingBooking.length);
        }
        
      } catch (clientError) {
        console.log('❌ User client error:', clientError.message);
      }
      
    } else {
      console.log('❌ User registration failed:', registerData.error);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

async function main() {
  await debugUserClient();
}

main().catch(console.error);
