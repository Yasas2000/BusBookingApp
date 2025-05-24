const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer token"

  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });

    req.user = user;
    next();
  });
};

exports.isAdmin = async (req, res, next) => {
  try {
    await exports.authenticateToken(req, res, () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

exports.isBusOperator = async (req, res, next) => {
  try {
    await exports.authenticateToken(req, res, () => {
      if (req.user.role !== "bus") {
        return res
          .status(403)
          .json({ message: "Bus operator access required" });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};
