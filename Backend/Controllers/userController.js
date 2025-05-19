const User = require("../model/user")
const bycrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config();

exports.registerUser = async (req,res) =>{
    const { userType, name, email, mobile, password, busId } = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(401).json({message: "User already have a account"});
    }
    const hashedPassword = await bycrypt.hash(password,10);
    
    const userData = { name, email, mobile, password: hashedPassword, userType };

    if (userType === "CONDUCTOR") {
      userData.busId = busId;
    }

    const user = new User(userData);
    await user.save();

    res.json({message:"User Registered"})
}

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

      if(user.role === "bus"){
        payload.busId = user.bus_id;
      }
  
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
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
      // Get refresh token from body
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) return res.status(401).json({ message: "No refresh token found" });
  
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      
      // Fetch user data from database
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Create full payload with user data
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
        const {email} = req.query;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user  = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({user});
    } catch (error) {
        
    }
}