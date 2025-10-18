const supabase = require('./config/database');

async function testBookingWithAuth() {
  try {
    console.log('🚀 Testing Booking with Authentication\n');
    
    // Step 1: Test user registration
    console.log('🔍 Step 1: Testing user registration...');
    const testUser = {
      username: 'testuser' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      password: 'password123'
    };

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testUser)
      });

      const data = await response.json();
      
      if (response.status === 201) {
        console.log('✅ User registration successful');
        console.log('📧 User:', testUser.email);
        console.log('🔑 Token received:', data.token ? 'Yes' : 'No');
        
        // Step 2: Test booking creation with valid token
        console.log('\n🔍 Step 2: Testing booking creation...');
        
        const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${data.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mountain_id: 1,
            booking_date: '2025-10-20'
          })
        });

        const bookingData = await bookingResponse.json();
        
        if (bookingResponse.status === 201) {
          console.log('✅ Booking creation successful!');
          console.log('📅 Booking ID:', bookingData.booking?.id);
          console.log('📅 Booking Date:', bookingData.booking?.booking_date);
          console.log('📅 Status:', bookingData.booking?.status);
          
          // Step 3: Test retrieving bookings
          console.log('\n🔍 Step 3: Testing booking retrieval...');
          
          const getBookingsResponse = await fetch('http://localhost:5000/api/bookings/my-bookings', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${data.token}`,
              'Content-Type': 'application/json'
            }
          });

          const bookingsData = await getBookingsResponse.json();
          
          if (getBookingsResponse.status === 200) {
            console.log('✅ Bookings retrieval successful!');
            console.log('📊 Total bookings:', bookingsData.bookings?.length || 0);
            
            if (bookingsData.bookings && bookingsData.bookings.length > 0) {
              console.log('📅 Latest booking:', bookingsData.bookings[0].mountains?.name);
            }
          } else {
            console.log('❌ Bookings retrieval failed:', bookingsData.error);
          }
          
        } else {
          console.log('❌ Booking creation failed:', bookingData.error);
          console.log('📝 Status code:', bookingResponse.status);
        }
        
      } else {
        console.log('❌ User registration failed:', data.error);
        console.log('📝 Status code:', response.status);
      }
      
    } catch (err) {
      console.log('❌ Registration test failed:', err.message);
    }

    console.log('\n🎉 Booking System Test Complete!');
    console.log('📝 If booking creation failed, check:');
    console.log('1. Backend server is running on port 5000');
    console.log('2. Bookings table exists in Supabase');
    console.log('3. User authentication is working');
    console.log('4. Mountain with ID 1 exists in database');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

async function main() {
  await testBookingWithAuth();
}

main().catch(console.error);
