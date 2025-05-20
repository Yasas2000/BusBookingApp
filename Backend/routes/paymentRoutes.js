const express = require("express");
const router = express.Router();
const {
  processPayment,
  createCheckoutSession,
} = require("../Controllers/paymentController");
const { authenticateToken } = require("../JWT/authorization");

router.post("/book-and-pay", authenticateToken, processPayment);

router.post(
  "/create-checkout-session",
  authenticateToken,
  createCheckoutSession
);

module.exports = router;
