const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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

      let dbUser = null;
      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(decoded.id)) {
        dbUser = await User.findById(decoded.id).select('-password_hash');
      }

      if (dbUser) {
        req.user = {
          id: dbUser._id.toString(),
          first_name: dbUser.first_name,
          last_name: dbUser.last_name,
          email: dbUser.email,
          role: dbUser.role || 'agent',
          lastLogin: dbUser.lastLogin,
        };
      } else {
        // Fallback to decoded payload data
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role || 'agent',
          name: decoded.name,
          lastLogin: decoded.lastLogin || null,
        };
      }

      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          code: 'TOKEN_EXPIRED',
          message: 'Token has expired. Please login again.',
        });
      }
      return res.status(401).json({
        success: false,
        code: 'TOKEN_INVALID',
        message: 'Not authorized, invalid token',
        error: error.message,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      code: 'NO_TOKEN',
      message: 'Not authorized, no token provided',
    });
  }
};

// Role-Based Access Control (RBAC) middleware for Admin & Agent roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied, missing user authentication role',
      });
    }

    // Normalize roles ('admin', 'agent', 'sales_rep' -> 'agent')
    let userRole = req.user.role.toLowerCase().replace(/\s+/g, '_');
    if (userRole === 'sales_rep') userRole = 'agent';

    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase().replace(/\s+/g, '_'));

    if (!normalizedAllowedRoles.includes(userRole) && !normalizedAllowedRoles.includes('admin') === false && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        code: 'UNAUTHORIZED_ROLE',
        message: `Access denied. Role [${req.user.role}] cannot perform this action.`,
      });
    }

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        code: 'UNAUTHORIZED_ROLE',
        message: `Access denied. Role [${req.user.role}] cannot perform this action.`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};

