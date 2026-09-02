const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper to generate JWT Token
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'super-secret-jwt-key-agentix-crm-2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.name || 'Admin User';

  return jwt.sign(
    {
      id: (user._id || user.id).toString(),
      email: user.email,
      role: user.role || 'agent',
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
    const isDbConnected = mongoose.connection.readyState === 1;

    // 1. Query user record using Mongoose
    let user = null;
    if (isDbConnected) {
      user = await User.findOne({ email: cleanEmail });
    }

    // 2. If user does not exist in DB, create initial account in MongoDB
    if (!user && isDbConnected) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password || 'password123', salt);
      
      let role = 'agent';
      let firstName = 'User';
      let lastName = 'Agent';

      if (cleanEmail === 'admin@agentix.com' || cleanEmail === 'rajesh.sharma@minicrm.in') {
        role = 'admin';
        firstName = 'Rajesh';
        lastName = 'Sharma';
      } else if (cleanEmail === 'agent@agentix.com' || cleanEmail === 'priya.patel@minicrm.in') {
        role = 'agent';
        firstName = 'Priya';
        lastName = 'Patel';
      }

      try {
        user = await User.create({
          first_name: firstName,
          last_name: lastName,
          email: cleanEmail,
          password_hash: passwordHash,
          role,
          lastLogin: now,
        });
      } catch (createErr) {
        console.warn('[Auth Controller] User creation warning:', createErr.message);
      }
    }

    // 3. Fallback memory user if DB offline
    if (!user) {
      const hashedDemoPass = await bcrypt.hash('password123', 10);
      const isPassValid = await bcrypt.compare(password, hashedDemoPass);
      if (isPassValid) {
        user = {
          _id: new mongoose.Types.ObjectId().toString(),
          id: new mongoose.Types.ObjectId().toString(),
          first_name: cleanEmail.includes('admin') ? 'Rajesh' : 'Priya',
          last_name: cleanEmail.includes('admin') ? 'Sharma' : 'Patel',
          email: cleanEmail,
          password_hash: hashedDemoPass,
          role: cleanEmail.includes('admin') ? 'admin' : 'agent',
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

    // 4. Verify password
    if (user.password_hash) {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
    }

    // Update lastLogin timestamp
    if (user.save && typeof user.save === 'function') {
      user.lastLogin = now;
      await user.save();
    } else {
      user.lastLogin = now;
    }

    // Issue JWT token
    const token = generateToken(user);
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.name || 'Admin User';

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: (user._id || user.id).toString(),
        first_name: user.first_name,
        last_name: user.last_name,
        name: fullName,
        email: user.email,
        role: user.role || 'agent',
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

// @desc    Logout user
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
