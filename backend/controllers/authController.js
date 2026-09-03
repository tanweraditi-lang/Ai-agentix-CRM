const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Recognized demo accounts for automatic seed creation when database is initialized
const DEMO_ACCOUNTS = {
  'admin@agentix.com': { role: 'admin', firstName: 'Rajesh', lastName: 'Sharma' },
  'rajesh.sharma@minicrm.in': { role: 'admin', firstName: 'Rajesh', lastName: 'Sharma' },
  'agent@agentix.com': { role: 'agent', firstName: 'Priya', lastName: 'Patel' },
  'priya.patel@minicrm.in': { role: 'agent', firstName: 'Priya', lastName: 'Patel' },
  'amit.verma@minicrm.in': { role: 'sales_rep', firstName: 'Amit', lastName: 'Verma' },
  'neha.sundaram@minicrm.in': { role: 'sales_rep', firstName: 'Neha', lastName: 'Sundaram' },
};

// Helper to generate JWT Token
const generateToken = (user) => {
  if (!user) return null;
  const secret = process.env.JWT_SECRET || 'super-secret-jwt-key-agentix-crm-2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.name || 'Admin User';
  const userId = (user._id || user.id || '').toString();

  return jwt.sign(
    {
      id: userId,
      email: user.email,
      role: user.role || 'agent',
      name: fullName,
      lastLogin: user.lastLogin || new Date(),
    },
    secret,
    { expiresIn }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const now = new Date();
    const isDbConnected = mongoose.connection.readyState === 1;

    // Check if user already exists in DB
    let existingUser = null;
    if (isDbConnected) {
      existingUser = await User.findOne({ email: cleanEmail });
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userRole = role || 'agent';
    const firstName = (first_name || '').trim();
    const lastName = (last_name || '').trim();

    let user = null;
    if (isDbConnected) {
      user = await User.create({
        first_name: firstName,
        last_name: lastName,
        email: cleanEmail,
        password_hash: passwordHash,
        role: userRole,
        lastLogin: now,
      });
    } else {
      // In-memory fallback if DB is offline
      const mockId = new mongoose.Types.ObjectId().toString();
      user = {
        _id: mockId,
        id: mockId,
        first_name: firstName || 'New',
        last_name: lastName || 'User',
        email: cleanEmail,
        password_hash: passwordHash,
        role: userRole,
        lastLogin: now,
      };
    }

    const token = generateToken(user);
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
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
    console.error('[Auth Controller] Register Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
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

    // 2. If user does not exist in DB, auto-seed ONLY if it's a recognized demo account
    if (!user && isDbConnected && DEMO_ACCOUNTS[cleanEmail]) {
      const demoInfo = DEMO_ACCOUNTS[cleanEmail];
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password || 'password123', salt);

      try {
        user = await User.create({
          first_name: demoInfo.firstName,
          last_name: demoInfo.lastName,
          email: cleanEmail,
          password_hash: passwordHash,
          role: demoInfo.role,
          lastLogin: now,
        });
      } catch (createErr) {
        console.warn('[Auth Controller] Demo user creation warning:', createErr.message);
      }
    }

    // 3. Fallback in-memory user if DB offline
    if (!user && !isDbConnected) {
      const demoInfo = DEMO_ACCOUNTS[cleanEmail] || {
        role: cleanEmail.includes('admin') ? 'admin' : 'agent',
        firstName: cleanEmail.includes('admin') ? 'Rajesh' : 'Priya',
        lastName: cleanEmail.includes('admin') ? 'Sharma' : 'Patel',
      };

      const hashedDemoPass = await bcrypt.hash(password || 'password123', 10);
      const mockId = new mongoose.Types.ObjectId().toString();
      user = {
        _id: mockId,
        id: mockId,
        first_name: demoInfo.firstName,
        last_name: demoInfo.lastName,
        email: cleanEmail,
        password_hash: hashedDemoPass,
        role: demoInfo.role,
        lastLogin: now,
      };
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

    // Update lastLogin timestamp safely
    if (user.save && typeof user.save === 'function') {
      try {
        user.lastLogin = now;
        await user.save();
      } catch (saveErr) {
        console.warn('[Auth Controller] Error saving lastLogin:', saveErr.message);
      }
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
    if (!req.user) {
      return res.status(401).json({
        success: false,
        valid: false,
        message: 'Session invalid or expired',
      });
    }
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
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }
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
  registerUser,
  loginUser,
  logoutUser,
  validateSession,
  getMe,
};

