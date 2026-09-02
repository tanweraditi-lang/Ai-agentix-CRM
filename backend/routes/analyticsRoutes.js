const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');

// @route   GET /api/analytics
// @access  Public / Private
router.get('/', getAnalytics);

module.exports = router;
