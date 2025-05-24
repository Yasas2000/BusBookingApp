const express = require("express");
const { registerUser, loginUser, refreshToken, getUserByEmail } = require("../Controllers/userController");
const router = express.Router();

// Register a new user
router.post("/register", registerUser);
// Login an existing user
router.post("/login", loginUser);
// Refresh token for user session
router.post("/refresh", refreshToken)
// Get user details by email (for the authenticated user)
router.get("/whoami", getUserByEmail)

module.exports = router;