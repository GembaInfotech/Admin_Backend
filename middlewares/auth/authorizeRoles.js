const jwt = require('jsonwebtoken');
const adminUserModel = require('../../model/adminUserModel');

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      // Extract the token from the Authorization header
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      // Verify the token and decode user information
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;

      // Find the user by the ID embedded in the token
      const user = await adminUserModel.findById(req.user.id);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check if the user's role is authorized
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied. Unauthorized role." });
      }

      // Proceed to the next middleware if authorized
      next();
    } catch (err) {
      // Handle JWT errors or any other unexpected errors
      if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  };
};

module.exports = authorizeRoles;
