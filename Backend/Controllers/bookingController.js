const moment = require("moment-timezone");
const Booking = require('../model/booking');
const Trip = require('../model/trip');

exports.bookSeat = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { bus_id, trip_id, departure_date, seatNumbers, price } = req.body;

    if (!user_id || !bus_id || !trip_id || !departure_date || !seatNumbers || seatNumbers.length === 0 || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const tripDate = moment.utc(departure_date, "YYYY-MM-DD");

    const trip = await Trip.findById(trip_id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if the selected seats are already booked
    const existingBookings = await Booking.find({
      trip_id,
      departure_date: tripDate.toDate(),
      booking_status: { $ne: 'canceled' },
      seatNumbers: { $in: seatNumbers }
    });

    if (existingBookings.length > 0) {
      const bookedSeats = existingBookings.flatMap(booking => booking.seatNumbers);
      const conflictingSeats = seatNumbers.filter(seat => bookedSeats.includes(seat));

      return res.status(409).json({
        message: `Seats ${conflictingSeats.join(', ')} are already booked`
      });
    }

    // Set expiration time to 1 hour from now
    const expiresAt = moment.utc().add(1, 'hour').toDate();

    const booking = new Booking({
      user_id,
      bus_id,
      trip_id,
      departure_date: tripDate.toDate(),
      seatNumbers,
      price,
      booking_status: 'pending',
      expires_at: expiresAt
    });

    await booking.save();

    return res.status(201).json({
      message: 'Booking created successfully',
      bookingId: booking._id,
      status: booking.booking_status,
      expires_at: expiresAt
    });

  } catch (error) {
    console.error('Error in bookSeat:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getBookedSeats = async (req, res) => {
  const { tripId, tripDateStr } = req.params;
  const tripDate = moment.utc(tripDateStr, "YYYY-MM-DD"); // e.g., "2025-05-01"

  try {
    const bookings = await Booking.find({
      trip_id: tripId,
      departure_date: tripDate.toDate(), // Use the parsed date
      booking_status: { $in: ["confirmed", "pending"] }
    }).select("seatNumbers");

    const booked = bookings.flatMap(b => b.seatNumbers);
    res.json(booked);
  } catch (err) {
    res.status(500).json({ error: "Failed to load booked seats." });
  }
};

exports.getPendingBookings = async (req, res) => {
  try {
    const user_id = req.user.userId;

    const bookings = await Booking.find({
      user_id,
      booking_status: 'pending'
    }).populate('trip_id');

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching pending bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getBookings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await Booking.find({
      user_id: userId,
    }).populate('trip_id', 'from to departure');

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching  bookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPendingBookingCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const count = await Booking.countDocuments({
      user_id: userId,
      booking_status: 'pending'
    });

    res.json({ count });
  } catch (error) {
    console.error('Error fetching pending booking count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user.userId;

    const booking = await Booking.findOne({
      _id: bookingId,
      user_id: userId
    });

    if (!booking) {
      console.error('Booking not found or does not belong to user:', bookingId);
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.booking_status = 'canceled';
    await booking.save();

    res.json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};