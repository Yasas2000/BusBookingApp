const express = require("express");
const router = express.Router();
const { insertBus } = require("../Controllers/busController");

router.post("/insert-bus", insertBus);

module.exports = router;