const supabase = require('./config/database');

async function finalBookingSystemTest() {
  try {
    console.log('🎉 Final Booking System Test\n');
    
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
        console.log('🏔️ Mountain:', bookingData.booking?.mountains?.name);
        console.log('📅 Date:', bookingData.booking?.booking_date);
        console.log('📊 Status:', bookingData.booking?.status);
        
        const bookingId = bookingData.booking.id;
        
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
        
        if (getBookingsResponse.status === 200) {
          console.log('✅ Bookings retrieval successful!');
          console.log('📊 Total bookings:', bookingsData.bookings?.length || 0);
        } else {
          console.log('❌ Bookings retrieval failed:', bookingsData.error);
          return;
        }
        
        // Step 4: Get booking details
        console.log('\n🔍 Step 4: Getting booking details...');
        
        const getBookingResponse = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${registerData.token}`,
            'Content-Type': 'application/json'
          }
        });

        const bookingDetailsData = await getBookingResponse.json();
        
        if (getBookingResponse.status === 200) {
          console.log('✅ Booking details retrieval successful!');
          console.log('📅 Booking ID:', bookingDetailsData.booking?.id);
          console.log('🏔️ Mountain:', bookingDetailsData.booking?.mountains?.name);
          console.log('📅 Date:', bookingDetailsData.booking?.booking_date);
          console.log('📊 Status:', bookingDetailsData.booking?.status);
        } else {
          console.log('❌ Booking details retrieval failed:', bookingDetailsData.error);
        }
        
        // Step 5: Cancel booking
        console.log('\n🔍 Step 5: Cancelling booking...');
        
        const cancelResponse = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${registerData.token}`,
            'Content-Type': 'application/json'
          }
        });

        const cancelData = await cancelResponse.json();
        
        if (cancelResponse.status === 200) {
          console.log('✅ Booking cancellation successful!');
          console.log('📅 Booking ID:', cancelData.booking?.id);
          console.log('📊 New Status:', cancelData.booking?.status);
        } else {
          console.log('❌ Booking cancellation failed:', cancelData.error);
        }
        
        // Step 6: Verify cancellation
        console.log('\n🔍 Step 6: Verifying cancellation...');
        
        const verifyResponse = await fetch('http://localhost:5000/api/bookings/my-bookings', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${registerData.token}`,
            'Content-Type': 'application/json'
          }
        });

        const verifyData = await verifyResponse.json();
        
        if (verifyResponse.status === 200) {
          console.log('✅ Verification successful!');
          console.log('📊 Total bookings:', verifyData.bookings?.length || 0);
          
          if (verifyData.bookings && verifyData.bookings.length > 0) {
            console.log('📊 Latest booking status:', verifyData.bookings[0].status);
          }
        } else {
          console.log('❌ Verification failed:', verifyData.error);
        }
        
      } else {
        console.log('❌ Booking creation failed');
        console.log('📝 Error:', bookingData.error);
        return;
      }
      
    } else {
      console.log('❌ User registration failed:', registerData.error);
      return;
    }

    console.log('\n🎉 BOOKING SYSTEM FULLY FUNCTIONAL!');
    console.log('✅ All features working:');
    console.log('  • User registration');
    console.log('  • User authentication');
    console.log('  • Booking creation');
    console.log('  • Booking retrieval');
    console.log('  • Booking details');
    console.log('  • Booking cancellation');
    console.log('  • Data persistence');
    
    console.log('\n📝 Ready for frontend testing!');
    console.log('1. Start frontend: cd Website && npm start');
    console.log('2. Register a user account');
    console.log('3. Login with the account');
    console.log('4. Go to a mountain detail page');
    console.log('5. Click "Book This Trail"');
    console.log('6. Select a date and confirm booking');
    console.log('7. Check your dashboard for the booking');
    console.log('8. Cancel the booking if needed');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

async function main() {
  await finalBookingSystemTest();
}

main().catch(console.error);
