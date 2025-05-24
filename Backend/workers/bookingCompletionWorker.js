const mongoose = require('mongoose');
const Booking = require('../model/booking');
const Trip = require('../model/trip');
const moment = require('moment');
require('dotenv').config();

// Connect to MongoDB in the worker
mongoose.connect(process.env.MONGO_URI, {
  dbName: "bus_booking"
})
  .then(() => processCompletedBookings())
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.send({ success: false, error: err.message });
    process.exit(1);
  });

async function processCompletedBookings() {
  try {
    const now = new Date();
    console.log(`Processing completed bookings at ${now.toISOString()}`);

    let completedCount = 0;

    const trips = await Trip.find({});
    console.log(`Found ${trips.length} trips to process`);

    for (const trip of trips) {
      const bookings = await Booking.find({
        trip_id: trip._id,
        booking_status: 'confirmed'
      });

      console.log(`Processing ${bookings.length} confirmed bookings for trip ${trip._id}`);

      for (const booking of bookings) {
        const departureDate = moment(booking.departure_date);
        const tripDeparture = moment.utc(trip.departure);
        const tripArrival = moment.utc(trip.arrival);

        const tripEndDateTime = departureDate.clone()
          .hour(tripArrival.hour())
          .minute(tripArrival.minute())
          .second(0);

        // If arrival time is earlier than departure time, it's likely the next day
        if (tripArrival.hour() < tripDeparture.hour() ||
          (tripArrival.hour() === tripDeparture.hour() && tripArrival.minute() < tripDeparture.minute())) {
          tripEndDateTime.add(1, 'day');
        }

        // If current time is past the trip end time, mark as completed
        if (moment(now).isAfter(tripEndDateTime)) {
          await Booking.updateOne(
            { _id: booking._id },
            { $set: { booking_status: 'completed' } }
          );
          completedCount++;
          console.log(`Marked booking ${booking._id} as completed`);
        }
      }
    }

    console.log(`Total bookings marked as completed: ${completedCount}`);

    process.send({
      success: true,
      count: completedCount
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error processing completed bookings:', error);
    process.send({ success: false, error: error.message });
    process.exit(1);
  }
}
