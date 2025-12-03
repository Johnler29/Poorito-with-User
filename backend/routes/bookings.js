const express = require('express');
const supabase = require('../config/database');
const { createUserClient } = require('../config/user-database');
const { authenticateToken } = require('../middleware/auth');
const { sendBookingConfirmation } = require('../services/emailService');

const router = express.Router();

// Get all bookings for a user
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;
    
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        mountain_id,
        booking_date,
        status,
        number_of_participants,
        created_at,
        mountains (
          id,
          name,
          location,
          difficulty,
          elevation,
          image_url
        )
      `)
      .eq('user_id', user_id)
      .order('booking_date', { ascending: true });

    if (error) {
      console.error('Get bookings error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch bookings',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }

    res.json({ bookings: bookings || [] });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Create a new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { mountain_id, booking_date, number_of_participants } = req.body;
    const user_id = req.user.userId;

    if (!mountain_id || !booking_date) {
      return res.status(400).json({ error: 'Mountain ID and booking date are required' });
    }

    // Validate number of participants (default to 1 if not provided)
    const participants = number_of_participants ? parseInt(number_of_participants) : 1;
    if (participants < 1 || participants > 20) {
      return res.status(400).json({ error: 'Number of participants must be between 1 and 20' });
    }

    // Create user-scoped client
    const userSupabase = createUserClient(req.headers.authorization?.split(' ')[1]);

    // Check if mountain exists (use regular supabase for public data)
    const { data: mountain, error: mountainError } = await supabase
      .from('mountains')
      .select('id, name')
      .eq('id', mountain_id)
      .single();

    if (mountainError || !mountain) {
      return res.status(404).json({ error: 'Mountain not found' });
    }

    // Check if user already has a booking for this mountain on this date
    const { data: existingBooking, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', user_id)
      .eq('mountain_id', mountain_id)
      .eq('booking_date', booking_date);

    if (checkError) {
      console.error('Check booking error:', checkError);
      console.error('Check booking error details:', {
        message: checkError.message,
        code: checkError.code,
        details: checkError.details,
        hint: checkError.hint
      });
      return res.status(500).json({ 
        error: 'Failed to check existing bookings',
        details: process.env.NODE_ENV !== 'production' ? checkError.message : undefined
      });
    }

    if (existingBooking && existingBooking.length > 0) {
      return res.status(400).json({ error: 'You already have a booking for this mountain on this date' });
    }

    // Create booking using service role client (bypasses RLS)
    const bookingData = {
      user_id,
      mountain_id,
      booking_date,
      status: 'confirmed',
      number_of_participants: participants
    };

    const { data: newBooking, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select(`
        id,
        mountain_id,
        booking_date,
        status,
        number_of_participants,
        created_at,
        mountains (
          id,
          name,
          location,
          difficulty,
          elevation,
          image_url
        )
      `)
      .single();

    if (error) {
      console.error('Create booking error:', error);
      return res.status(500).json({ 
        error: 'Failed to create booking',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }

    // Get user details for email notification
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email')
      .eq('id', user_id)
      .single();

    // Send email notification (non-blocking - don't fail booking if email fails)
    if (user && !userError && newBooking && newBooking.mountains) {
      sendBookingConfirmation(
        user.email,
        user.username,
        newBooking,
        newBooking.mountains
      ).catch((emailError) => {
        // Log error but don't throw - booking was successful
        console.error('Failed to send booking confirmation email:', emailError);
      });
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking status (cancel booking)
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;

    // Check if booking exists and belongs to user
    const { data: booking, error: checkError } = await supabase
      .from('bookings')
      .select('id, status')
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (checkError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    // Update booking status
    const now = new Date().toISOString();
    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        updated_at: now,
        cancelled_at: now
      })
      .eq('id', id)
      .eq('user_id', user_id)
      .select(`
        id,
        mountain_id,
        booking_date,
        status,
        number_of_participants,
        updated_at,
        mountains (
          id,
          name,
          location,
          difficulty,
          elevation,
          image_url
        )
      `)
      .single();

    if (error) {
      console.error('Cancel booking error:', error);
      return res.status(500).json({ 
        error: 'Failed to cancel booking',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Get booking receipt (must be before /:id route)
router.get('/:id/receipt', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;

    // Get booking with mountain details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        id,
        mountain_id,
        booking_date,
        status,
        number_of_participants,
        created_at,
        updated_at,
        mountains (
          id,
          name,
          location,
          difficulty,
          elevation,
          description,
          image_url
        )
      `)
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email, created_at')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Format receipt data
    const receipt = {
      receipt_number: `POOR-${String(booking.id).padStart(6, '0')}`,
      booking_id: booking.id,
      issued_date: new Date().toISOString(),
      user: {
        username: user.username,
        email: user.email
      },
      booking: {
        booking_date: booking.booking_date,
        status: booking.status,
        number_of_participants: booking.number_of_participants || 1,
        created_at: booking.created_at,
        updated_at: booking.updated_at
      },
      mountain: booking.mountains
    };

    res.json({ receipt });
  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({ error: 'Failed to fetch receipt' });
  }
});

// Get booking details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;

    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        id,
        mountain_id,
        booking_date,
        status,
        number_of_participants,
        created_at,
        updated_at,
        mountains (
          id,
          name,
          location,
          difficulty,
          elevation,
          description,
          image_url
        )
      `)
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (error) {
      console.error('Get booking error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch booking',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

module.exports = router;
