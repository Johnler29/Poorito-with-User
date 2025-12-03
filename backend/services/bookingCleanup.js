const supabase = require('../config/database');

const DAYS_BEFORE_DELETE = 7;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

async function cleanupCancelledBookings() {
  const cutoffDate = new Date(Date.now() - DAYS_BEFORE_DELETE * ONE_DAY_MS).toISOString();

  try {
    const { data, error } = await supabase
      .from('bookings')
      .delete()
      .eq('status', 'cancelled')
      .lt('cancelled_at', cutoffDate)
      .select('id');

    if (error) {
      console.error('🧹 Booking cleanup error:', error);
      return;
    }

    const deletedCount = Array.isArray(data) ? data.length : 0;
    if (deletedCount > 0) {
      console.log(`🧹 Booking cleanup: deleted ${deletedCount} cancelled bookings older than ${DAYS_BEFORE_DELETE} days.`);
    } else {
      console.log('🧹 Booking cleanup: no old cancelled bookings to delete.');
    }
  } catch (err) {
    console.error('🧹 Booking cleanup unexpected error:', err);
  }
}

function scheduleBookingCleanup() {
  // Allow opting out via env if needed
  if (process.env.BOOKING_CLEANUP_DISABLED === 'true') {
    console.log('🧹 Booking cleanup job is disabled via BOOKING_CLEANUP_DISABLED env variable.');
    return;
  }

  console.log(`🧹 Booking cleanup job scheduled: runs once per day, deleting cancelled bookings older than ${DAYS_BEFORE_DELETE} days.`);

  // Run once shortly after startup
  setTimeout(() => {
    cleanupCancelledBookings();
  }, 10 * 1000);

  // Schedule daily run
  setInterval(cleanupCancelledBookings, ONE_DAY_MS);
}

module.exports = {
  cleanupCancelledBookings,
  scheduleBookingCleanup,
};


