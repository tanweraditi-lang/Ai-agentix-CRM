const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes & verify JWT token from Authorization Bearer header
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'super-secret-jwt-key-agentix-crm-2026';
      
      // Verify JWT token signature and expiration
      const decoded = jwt.verify(token, secret);

      // Attempt to fetch fresh user details from database using User model
      let dbUser = await User.findById(decoded.id);

      if (dbUser) {
        req.user = {
          id: dbUser.id,
          first_name: dbUser.first_name,
          last_name: dbUser.last_name,
          email: dbUser.email,
          role: dbUser.role,
        };
      } else {
        // Fallback to decoded payload data if user record is unavailable
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
        };
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired token',
        error: error.message,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

// Role-Based Access Control (RBAC) middleware for Admin & Sales Rep roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied, missing user authentication role',
      });
    }

    // Normalize roles for comparison (e.g., 'admin', 'sales_rep')
    const userRole = req.user.role.toLowerCase().replace(/\s+/g, '_');
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase().replace(/\s+/g, '_'));

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role [${req.user.role}] is not authorized to access this resource`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};
