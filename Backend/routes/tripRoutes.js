const express = require("express");
const router = express.Router();
const { insertTrip,findMultiLegRoutes } = require("../Controllers/tripController");

router.post("/insert-trip", insertTrip);
router.post("/find-trip", findMultiLegRoutes);

module.exports = router;