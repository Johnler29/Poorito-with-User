const supabase = require('./config/database');

async function debugBookingError() {
  try {
    console.log('🔍 Debugging Booking Error\n');
    
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
      
      // Step 2: Try to create booking and capture detailed error
      console.log('\n🔍 Step 2: Attempting booking creation...');
      
      const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${registerData.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mountain_id: 15,
          booking_date: '2025-10-20'
        })
      });

      const bookingData = await bookingResponse.json();
      
      console.log('📊 Response status:', bookingResponse.status);
      console.log('📊 Response data:', JSON.stringify(bookingData, null, 2));
      
      if (bookingResponse.status === 500) {
        console.log('\n❌ Server Error Details:');
        console.log('📝 Error:', bookingData.error);
        if (bookingData.details) {
          console.log('📝 Details:', bookingData.details);
        }
        
        // Step 3: Check if it's an RLS issue by trying direct database insert
        console.log('\n🔍 Step 3: Testing direct database insert...');
        
        try {
          const { data, error } = await supabase
            .from('bookings')
            .insert([{
              user_id: registerData.user.id,
              mountain_id: 15,
              booking_date: '2025-10-20',
              status: 'confirmed'
            }])
            .select();

          if (error) {
            console.log('❌ Direct insert error:', error.message);
            console.log('📝 Error code:', error.code);
            console.log('📝 Error details:', error.details);
          } else {
            console.log('✅ Direct insert successful:', data);
          }
        } catch (dbError) {
          console.log('❌ Database error:', dbError.message);
        }
      }
      
    } else {
      console.log('❌ User registration failed:', registerData.error);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

async function main() {
  await debugBookingError();
}

main().catch(console.error);
