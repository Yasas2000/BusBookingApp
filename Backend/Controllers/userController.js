const User = require("../model/user")
const Bus = require("../model/bus")
const bycrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config();

exports.registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password, userType, busId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already has an account" });
    }

    // Determine role based on userType
    const role = userType === "CONDUCTOR" ? "bus" : "user";

    const hashedPassword = await bycrypt.hash(password, 10);

    const userData = {
      name,
      email,
      mobile,
      password: hashedPassword,
      role
    };

    // Add busId if the user is a conductor
    if (userType === "CONDUCTOR" && busId) {
      try {
        // Find the bus with the provided ID
        const busDocument = await Bus.findOne({ bus_id: busId });

        // Validate if the bus exists
        if (!busDocument) {
          return res.status(404).json({ message: "Bus not found with the provided ID" });
        }

        userData.bus_id = busDocument._id;
      } catch (error) {
        console.error("Error finding bus:", error);
        return res.status(500).json({ message: "Error validating bus ID" });
      }
    }

    const user = new User(userData);
    await user.save();

    res.json({ message: "User Registered" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bycrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid Email or Credentials" });
    }

    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (user.role === "bus") {
      payload.busId = user.bus_id;
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '50m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token found" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
    };

    // Generate new access token with full payload
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken: newAccessToken });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(403).json({ message: "Refresh token expired" });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(403).json({ message: "Invalid refresh token" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {

  }
}