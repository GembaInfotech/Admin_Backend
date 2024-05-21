const jwt = require('jsonwebtoken');
const adminUserModel = require('../../model/adminUserModel');

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;

      adminUserModel.findById(req.user.id, (err, user) => {
        if (err || !user) {
          return res.status(401).json({ message: "User not found" });
        }

        if (!roles.includes(user.role)) {
          return res.status(403).json({ message: "Access denied" });
        }

        next();
      });
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = authorizeRoles;
