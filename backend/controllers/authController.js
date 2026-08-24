const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

// Helper to sign JWT Token
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'super-secret-jwt-key-agentix-crm-2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn }
  );
};

// In-Memory Fallback User Store for standalone execution when MongoDB service is offline
const inMemoryUsers = [];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Input Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userRole = role && ['Admin', 'Manager', 'Sales Rep'].includes(role) ? role : 'Sales Rep';

    // Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
      }

      newUser = await User.create({
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: userRole,
      });
    } else {
      const existingUser = inMemoryUsers.find(u => u.email === cleanEmail);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
      }

      newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: userRole,
        createdAt: new Date(),
      };
      inMemoryUsers.push(newUser);
    }

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during user registration',
      error: error.message,
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = inMemoryUsers.find(u => u.email === cleanEmail);
      
      // Default demo user fallback for testing
      if (!user && cleanEmail === 'admin@agentix.com') {
        const salt = await bcrypt.genSalt(10);
        const hashedDemoPass = await bcrypt.hash('password123', salt);
        user = {
          _id: 'usr_admin_default',
          name: 'System Admin',
          email: 'admin@agentix.com',
          password: hashedDemoPass,
          role: 'Admin',
        };
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Compare password with bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
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

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};
