const express = require('express');
const router = express.Router();
const {
  getChatbots,
  getChatbotById,
  createChatbot,
  updateChatbot,
  deleteChatbot,
} = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/chatbots
// @access  Public / Private
router.get('/', getChatbots);

// @route   GET /api/chatbots/:id
// @access  Public / Private
router.get('/:id', getChatbotById);

// @route   POST /api/chatbots
// @access  Private (Protected)
router.post('/', protect, createChatbot);

// @route   PUT /api/chatbots/:id
// @access  Private (Protected)
router.put('/:id', protect, updateChatbot);

// @route   DELETE /api/chatbots/:id
// @access  Private (Protected)
router.delete('/:id', protect, deleteChatbot);

module.exports = router;
