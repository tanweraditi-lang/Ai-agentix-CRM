const express = require('express');
const router = express.Router();
const {
  getConversations,
  getConversationById,
  createConversation,
  updateConversation,
  convertToLead,
  deleteConversation,
} = require('../controllers/conversationController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/conversations
// @access  Public / Private
router.get('/', getConversations);

// @route   GET /api/conversations/:id
// @access  Public / Private
router.get('/:id', getConversationById);

// @route   POST /api/conversations
// @access  Public / Private
router.post('/', createConversation);

// @route   POST /api/conversations/:id/convert-lead
// @access  Private (Protected)
router.post('/:id/convert-lead', protect, convertToLead);

// @route   PUT /api/conversations/:id
// @access  Private (Protected)
router.put('/:id', protect, updateConversation);

// @route   DELETE /api/conversations/:id
// @access  Private (Protected)
router.delete('/:id', protect, deleteConversation);

module.exports = router;
