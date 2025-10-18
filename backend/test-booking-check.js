const supabase = require('./config/database');

async function testBookingCheck() {
  try {
    console.log('🔍 Testing Booking Check Logic\n');
    
    // Step 1: Register a test user
    console.log('🔍 Step 1: Registering test user...');
    const testUser = {
      username: 'checkuser' + Date.now(),
      email: 'check' + Date.now() + '@example.com',
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
      console.log('🆔 User ID:', registerData.user.id);
      
      const userId = registerData.user.id;
      
      // Step 2: Test the existing booking check
      console.log('\n🔍 Step 2: Testing existing booking check...');
      
      try {
        const { data: existingBooking, error: checkError } = await supabase
          .from('bookings')
          .select('id')
          .eq('user_id', userId)
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
        
        // Step 3: Test booking creation
        console.log('\n🔍 Step 3: Testing booking creation...');
        
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
        
        if (bookingResponse.status === 201) {
          console.log('🎉 BOOKING CREATION SUCCESSFUL!');
          console.log('📅 Booking ID:', bookingData.booking?.id);
          console.log('🏔️ Mountain:', bookingData.booking?.mountains?.name);
          console.log('📅 Date:', bookingData.booking?.booking_date);
          console.log('📊 Status:', bookingData.booking?.status);
        } else {
          console.log('❌ Booking creation failed');
          console.log('📝 Error:', bookingData.error);
          if (bookingData.details) {
            console.log('📝 Details:', bookingData.details);
          }
        }
        
      } catch (err) {
        console.log('❌ Error:', err.message);
      }
      
    } else {
      console.log('❌ User registration failed:', registerData.error);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

async function main() {
  await testBookingCheck();
}

main().catch(console.error);
