const jwt = require("jsonwebtoken");

const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  try {
    // Check token exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Get user details
      req.user = await User.findById(decoded.id).select(
        "-password"
      );

      next();
    } else {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Access denied. Unauthorized role",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};