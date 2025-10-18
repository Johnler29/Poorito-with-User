const supabase = require('./config/database');

async function testBookingRetrieval() {
  try {
    console.log('🔍 Testing Booking Retrieval\n');
    
    // Step 1: Register a test user
    console.log('🔍 Step 1: Registering test user...');
    const testUser = {
      username: 'retrievaluser' + Date.now(),
      email: 'retrieval' + Date.now() + '@example.com',
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
      
      // Step 2: Create a booking
      console.log('\n🔍 Step 2: Creating a booking...');
      
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
      
      if (bookingResponse.status === 201) {
        console.log('✅ Booking created successfully');
        console.log('📅 Booking ID:', bookingData.booking?.id);
        
        // Step 3: Retrieve bookings
        console.log('\n🔍 Step 3: Retrieving bookings...');
        
        const getBookingsResponse = await fetch('http://localhost:5000/api/bookings/my-bookings', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${registerData.token}`,
            'Content-Type': 'application/json'
          }
        });

        const bookingsData = await getBookingsResponse.json();
        
        console.log('📊 Response status:', getBookingsResponse.status);
        console.log('📊 Response data:', JSON.stringify(bookingsData, null, 2));
        
        if (getBookingsResponse.status === 200) {
          console.log('✅ Bookings retrieval successful!');
          console.log('📊 Total bookings:', bookingsData.bookings?.length || 0);
          
          if (bookingsData.bookings && bookingsData.bookings.length > 0) {
            console.log('📅 Latest booking:', bookingsData.bookings[0].mountains?.name);
            console.log('📅 Booking date:', bookingsData.bookings[0].booking_date);
            console.log('📊 Status:', bookingsData.bookings[0].status);
          }
        } else {
          console.log('❌ Bookings retrieval failed');
          console.log('📝 Error:', bookingsData.error);
          if (bookingsData.details) {
            console.log('📝 Details:', bookingsData.details);
          }
        }
        
      } else {
        console.log('❌ Booking creation failed');
        console.log('📝 Error:', bookingData.error);
      }
      
    } else {
      console.log('❌ User registration failed:', registerData.error);
    }

    console.log('\n🎉 Booking Retrieval Test Complete!');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

async function main() {
  await testBookingRetrieval();
}

main().catch(console.error);
