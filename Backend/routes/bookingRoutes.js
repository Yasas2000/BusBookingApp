const express = require("express");
const router = express.Router();
const { bookSeat, getBookedSeats, getPendingBookings, cancelBooking, getPendingBookingCount, getBookings } = require("../Controllers/bookingController");
const { authenticateToken } = require("../JWT/authorization");

//Book a seat on a trip
router.post("/book-seat", authenticateToken, bookSeat);
// Get booked seats for a specific trip
router.get('/booked-seats/:tripId/:tripDateStr', getBookedSeats);
// Get all pending bookings for the user
router.get('/pending', authenticateToken, getPendingBookings);
// Cancel a booking by booking ID
router.delete('/cancel/:bookingId', authenticateToken, cancelBooking);
// Get the count of pending bookings for the user
router.get('/pending-count', authenticateToken, getPendingBookingCount);
// Get all bookings for the user
router.get('/user-bookings', authenticateToken, getBookings);

module.exports = router;