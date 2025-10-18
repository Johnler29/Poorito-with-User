const supabase = require('./config/database');

async function finalBookingTest() {
  try {
    console.log('🚀 Final Booking Test\n');
    
    // Step 1: Register a test user
    console.log('🔍 Step 1: Registering test user...');
    const testUser = {
      username: 'finaluser' + Date.now(),
      email: 'final' + Date.now() + '@example.com',
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
      
      // Step 2: Test booking creation with detailed error capture
      console.log('\n🔍 Step 2: Testing booking creation...');
      
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
        
        // Step 3: Test retrieving bookings
        console.log('\n🔍 Step 3: Testing booking retrieval...');
        
        const getBookingsResponse = await fetch('http://localhost:5000/api/bookings/my-bookings', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${registerData.token}`,
            'Content-Type': 'application/json'
          }
        });

        const bookingsData = await getBookingsResponse.json();
        
        console.log('📊 Bookings response status:', getBookingsResponse.status);
        console.log('📊 Bookings data:', JSON.stringify(bookingsData, null, 2));
        
        if (getBookingsResponse.status === 200) {
          console.log('✅ Bookings retrieval successful!');
          console.log('📊 Total bookings:', bookingsData.bookings?.length || 0);
        } else {
          console.log('❌ Bookings retrieval failed:', bookingsData.error);
        }
        
      } else {
        console.log('❌ Booking creation failed');
        console.log('📝 Error:', bookingData.error);
        if (bookingData.details) {
          console.log('📝 Details:', bookingData.details);
        }
        
        // Step 4: Test direct database insert to see exact error
        console.log('\n🔍 Step 4: Testing direct database insert...');
        
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
            console.log('📝 Error hint:', error.hint);
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

    console.log('\n🎉 Final Booking Test Complete!');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

async function main() {
  await finalBookingTest();
}

main().catch(console.error);
