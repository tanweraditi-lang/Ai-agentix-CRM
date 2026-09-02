const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper to generate JWT Token
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'super-secret-jwt-key-agentix-crm-2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.name || 'User';

  return jwt.sign(
    {
      id: user.id || user._id,
      email: user.email,
      role: user.role,
      name: fullName,
      lastLogin: user.lastLogin || new Date(),
    },
    secret,
    { expiresIn }
  );
};

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const now = new Date();

    // Query user record using User model
    let user = await User.findByEmail(cleanEmail);

    // Fallback demo user check if DB is offline or user not found during testing
    if (!user) {
      const hashedDemoPass = await bcrypt.hash('password123', 10);
      if (cleanEmail === 'admin@agentix.com' || cleanEmail === 'rajesh.sharma@minicrm.in') {
        user = {
          id: 'demo_admin_1',
          _id: 'demo_admin_1',
          first_name: 'Rajesh',
          last_name: 'Sharma',
          email: cleanEmail,
          password_hash: hashedDemoPass,
          role: 'admin',
          lastLogin: now,
        };
      } else if (cleanEmail === 'agent@agentix.com' || cleanEmail === 'priya.patel@minicrm.in') {
        user = {
          id: 'demo_agent_1',
          _id: 'demo_agent_1',
          first_name: 'Priya',
          last_name: 'Patel',
          email: cleanEmail,
          password_hash: hashedDemoPass,
          role: 'agent',
          lastLogin: now,
        };
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password using bcrypt comparison
    const isMatch = await User.comparePassword(password, user.password_hash || user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update lastLogin timestamp if user is a Mongoose document
    if (user.save && typeof user.save === 'function') {
      user.lastLogin = now;
      await user.save();
    } else {
      user.lastLogin = now;
    }

    // Issue JWT token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id || user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('[Auth Controller] Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// @desc    Logout user / clear token state
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Validate session token & return profile
// @route   GET /api/auth/validate-session
// @access  Private
const validateSession = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      valid: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      valid: false,
      message: 'Session invalid or expired',
    });
  }
};

// @desc    Get profile of currently logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile',
      error: error.message,
    });
  }
};

module.exports = {
  loginUser,
  logoutUser,
  validateSession,
  getMe,
};

