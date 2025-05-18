const express = require("express");
const router = express.Router();
const { processPayment } = require("../Controllers/paymentController");
const {authenticateToken} = require("../JWT/authorization");

router.post("/book-and-pay", authenticateToken, processPayment);

module.exports = router;
