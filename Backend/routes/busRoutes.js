const express = require('express');
const router = express.Router();
const busController = require('../Controllers/busController');
const { isAdmin, authenticateToken } = require('../JWT/authorization');

// Register a new bus operator (admin only)
router.post('/register', isAdmin, busController.registerBusOperator);
// Get all buses
router.get('/', isAdmin, busController.getAllBuses);

module.exports = router;
