const mongoose = require('mongoose');
const Booking = require('../model/booking');
require('dotenv').config();

// Connect to MongoDB in the worker
mongoose.connect(process.env.MONGO_URI, {
  dbName: "bus_booking"
})
  .then(() => processExpiredBookings())
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.send({ success: false, error: err.message });
    process.exit(1);
  });

async function processExpiredBookings() {
  try {
    const now = new Date();
    console.log(`Processing expired bookings at ${now.toISOString()}`);

    const result = await Booking.updateMany(
      {
        booking_status: 'pending',
        expires_at: { $lt: now }
      },
      {
        $set: { booking_status: 'canceled' }
      }
    );

    console.log(`Found ${result.matchedCount} expired bookings, updated ${result.modifiedCount}`);

    process.send({
      success: true,
      count: result.modifiedCount
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error processing expired bookings:', error);
    process.send({ success: false, error: error.message });
    process.exit(1);
  }
}
