const express = require("express");
const router = express.Router();
const { bookSeat, getBookedSeats, getPendingBookings , cancelBooking, getPendingBookingCount, getBookings  } = require("../Controllers/bookingController");
const {authenticateToken} = require("../JWT/authorization");

router.post("/book-seat", authenticateToken, bookSeat);
router.get('/booked-seats/:tripId/:tripDateStr', getBookedSeats);
router.get('/pending', authenticateToken, getPendingBookings);
router.delete('/cancel/:bookingId', authenticateToken, cancelBooking);
router.get('/pending-count', authenticateToken, getPendingBookingCount);
router.get('/user-bookings', authenticateToken, getBookings);

module.exports = router;