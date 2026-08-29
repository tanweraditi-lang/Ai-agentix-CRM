const express = require('express');
const router = express.Router();
const { loginUser, logoutUser, getMe } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT token
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/auth/logout
// @desc    Logout user & invalidate session/token state
// @access  Public
router.post('/logout', logoutUser);

// @route   GET /api/auth/me
// @desc    Get currently authenticated user details
// @access  Private (Protected)
router.get('/me', protect, getMe);

// @route   GET /api/auth/admin-only
// @desc    Role-based test endpoint restricted to Admin users
// @access  Private (Admin only)
router.get('/admin-only', protect, authorizeRoles('admin'), (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome Admin! Access granted to admin-restricted endpoint.',
    user: req.user,
  });
});

// @route   GET /api/auth/sales-only
// @desc    Role-based test endpoint for Sales Representatives & Admins
// @access  Private (Sales Rep & Admin)
router.get('/sales-only', protect, authorizeRoles('sales_rep', 'admin'), (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome Sales Rep! Access granted to sales-restricted endpoint.',
    user: req.user,
  });
});

module.exports = router;
