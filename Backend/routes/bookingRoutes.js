const express = require("express");
const router = express.Router();
const { bookSeat } = require("../Controllers/bookingController");
const authenticateToken = require("../JWT/authorization");

router.post("/book-seat", authenticateToken, bookSeat);

module.exports = router;