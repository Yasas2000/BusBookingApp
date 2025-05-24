const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/reviewController');
const { authenticateToken } = require('../JWT/authorization');

// Submit a review for a trip
router.post('/submit', authenticateToken, reviewController.submitReview);;

module.exports = router;
