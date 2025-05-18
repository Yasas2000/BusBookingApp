// routes/busRoutes.js
const express = require('express');
const router = express.Router();
const busController = require('../Controllers/busController');
const { isAdmin, authenticateToken } = require('../JWT/authorization');

// Register a new bus operator (admin only)
router.post('/register', authenticateToken, busController.registerBusOperator);

// Get all buses
router.get('/', authenticateToken, busController.getAllBuses);

// Get bus by ID
router.get('/:id', authenticateToken, busController.getBusById);

// Get trips by bus ID
router.get('/:busId/trips', authenticateToken, busController.getTripsByBusId);

module.exports = router;
