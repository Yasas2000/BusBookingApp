const express = require("express");
const { registerUser, loginUser, refreshToken } = require("../Controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh",refreshToken)

module.exports = router;