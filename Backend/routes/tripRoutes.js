const express = require("express");
const router = express.Router();
const { insertTrip, findMultiLegRoutes, getRoutesForBus } = require("../Controllers/tripController");
const { authenticateToken } = require("../JWT/authorization");

// Insert a new trip
router.post("/insert-trip", insertTrip);
// Find multi-leg routes based on origin, destination, and date
router.post("/find-trip", findMultiLegRoutes);
// Get routes for a specific bus on a given date
router.get("/find-bus-trip/:tripDateStr", authenticateToken, getRoutesForBus);

module.exports = router;