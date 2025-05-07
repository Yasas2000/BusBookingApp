const express = require("express");
const { registerUser, loginUser, refreshToken, getUserByEmail } = require("../Controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh",refreshToken)
router.get("/whoami", getUserByEmail)

module.exports = router;