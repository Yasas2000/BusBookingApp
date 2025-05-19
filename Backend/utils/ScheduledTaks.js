
const cron = require('node-cron');
const Booking = require('../model/booking');

// Run every minute to check for expired bookings
const setupBookingExpirationTask = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      // Find and update all expired pending bookings
      const result = await Booking.updateMany(
        { 
          booking_status: 'pending',
          expires_at: { $lt: now }
        },
        { 
          $set: { booking_status: 'canceled' }
        }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`Auto-canceled ${result.modifiedCount} expired bookings`);
      }
    } catch (error) {
      console.error('Error in booking expiration task:', error);
    }
  });
};

module.exports = { setupBookingExpirationTask };
