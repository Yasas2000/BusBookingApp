const moment = require("moment-timezone");
const Booking = require('../model/booking');
const Trip = require('../model/trip');

exports.bookSeat = async (req, res) => {
  try {
    const user_id = req.user.userId; // Assuming user ID is obtained from JWT token
    const {bus_id, trip_id, departure_date, seatNumbers } = req.body;

    // Validate input
    if (!user_id || !bus_id || !trip_id || !departure_date || !seatNumbers || seatNumbers.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    console.log("Booking request:", req.body);
     
    const tripDate = moment(departure_date, "YYYY-MM-DD"); 
    
    // Check if seats are available
    const trip = await Trip.findById(trip_id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // Check if the selected seats are already booked
    const existingBookings = await Booking.find({
      trip_id,
      departure_date: tripDate.toDate(), // Use the parsed date
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
    
    // Create new booking
    const booking = new Booking({
      user_id,
      bus_id,
      trip_id,
      departure_date: tripDate.toDate(),
      seatNumbers,
      booking_status: 'pending'
    });
    
    await booking.save();
    
    return res.status(201).json({
      message: 'Booking created successfully',
      bookingId: booking._id,
      status: booking.booking_status
    });
    
  } catch (error) {
    console.error('Error in bookSeat:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getBookedSeats = async (req, res) => {
    const { tripId, tripDateStr  } = req.params;
    const tripDate = moment(tripDateStr, "YYYY-MM-DD"); // e.g., "2025-05-01"

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