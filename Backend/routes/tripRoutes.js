const express = require("express");
const router = express.Router();
const { insertTrip,findMultiLegRoutes, getRoutesForBus } = require("../Controllers/tripController");
const {authenticateToken} = require("../JWT/authorization");

router.post("/insert-trip", insertTrip);
router.post("/find-trip", findMultiLegRoutes);
router.get("/find-bus-trip/:tripDateStr", authenticateToken, getRoutesForBus);

module.exports = router;