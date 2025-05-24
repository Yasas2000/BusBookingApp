const express = require("express");
const router = express.Router();
const {
  processPayment,
  createCheckoutSession,
} = require("../Controllers/paymentController");
const { authenticateToken } = require("../JWT/authorization");

// Process payment for booking
router.post("/book-and-pay", authenticateToken, processPayment);

// Create a checkout session for payment
router.post(
  "/create-checkout-session",
  authenticateToken,
  createCheckoutSession
);

module.exports = router;
