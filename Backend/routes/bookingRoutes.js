const express = require("express");
const router = express.Router();
const { bookSeat, getBookedSeats } = require("../Controllers/bookingController");
const authenticateToken = require("../JWT/authorization");

router.post("/book-seat", authenticateToken, bookSeat);
router.get('/booked-seats/:tripId/:tripDateStr', getBookedSeats);

module.exports = router;