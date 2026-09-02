const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Lead = require('../models/Lead');
const { logActivity } = require('../utils/activityLogger');

// @desc    Get all conversations (with status & search filter)
// @route   GET /api/conversations
// @access  Public / Private
const getConversations = async (req, res) => {
  try {
    const { status, search } = req.query;
    const isDbConnected = mongoose.connection.readyState === 1;

    const safeStatus = typeof status === 'string' ? status.trim() : '';
    const safeSearch = typeof search === 'string' ? search.trim() : '';

    if (isDbConnected) {
      let query = {};
      if (safeStatus && safeStatus.toLowerCase() !== 'all') {
        query.status = new RegExp(`^${safeStatus}$`, 'i');
      }
      if (safeSearch) {
        const cleanSearch = safeSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(cleanSearch, 'i');
        query.$or = [
          { visitorName: searchRegex },
          { visitorEmail: searchRegex },
          { question: searchRegex },
          { message: searchRegex },
          { botResponse: searchRegex },
          { assignedAgent: searchRegex },
        ];
      }

      const convs = await Conversation.find(query).sort({ conversationTime: -1 });
      const mappedConvs = convs.map(c => {
        const obj = c.toObject ? c.toObject() : c;
        return {
          ...obj,
          id: (c._id || c.id).toString(),
          message: obj.message || obj.question,
        };
      });

      return res.status(200).json({
        success: true,
        count: mappedConvs.length,
        conversations: mappedConvs,
      });
    }

    return res.status(200).json({
      success: true,
      count: 0,
      conversations: [],
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching conversations',
      error: error.message,
    });
  }
};

// @desc    Get single conversation by ID
// @route   GET /api/conversations/:id
// @access  Public / Private
const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const conv = await Conversation.findById(id);
      if (conv) {
        const obj = conv.toObject ? conv.toObject() : conv;
        return res.status(200).json({
          success: true,
          conversation: {
            ...obj,
            id: conv._id.toString(),
            message: obj.message || obj.question,
          },
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: 'Conversation not found',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching conversation',
      error: error.message,
    });
  }
};

// @desc    Create new conversation record
// @route   POST /api/conversations
// @access  Public / Private
const createConversation = async (req, res) => {
  try {
    const { visitorName, visitorEmail, message, question, botResponse, status, assignedAgent, chatbotId } = req.body;

    const userMessage = (message || question || '').trim();
    const botReply = (botResponse || '').trim();

    if (!visitorName || !visitorEmail || !userMessage || !botReply) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in Visitor Name, Email, Message/Question, and Bot Response',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable',
      });
    }

    const created = await Conversation.create({
      visitorName: visitorName.trim(),
      visitorEmail: visitorEmail.toLowerCase().trim(),
      message: userMessage,
      question: userMessage,
      botResponse: botReply,
      status: status || 'Pending',
      assignedAgent: assignedAgent || 'AI Bot Agent',
      chatbotId: mongoose.Types.ObjectId.isValid(chatbotId) ? chatbotId : null,
      conversationTime: new Date(),
    });

    const obj = created.toObject ? created.toObject() : created;
    const newConv = { ...obj, id: created._id.toString() };

    await logActivity(
      null,
      'Conversation Logged',
      `Conversation with visitor "${visitorName}" logged in ${status || 'Pending'} state`,
      assignedAgent || 'AI Bot Agent',
      'conversation_logged'
    );

    return res.status(201).json({
      success: true,
      message: 'Conversation recorded successfully',
      conversation: newConv,
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating conversation',
      error: error.message,
    });
  }
};

// @desc    Update conversation status / assigned agent
// @route   PUT /api/conversations/:id
// @access  Private
const updateConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedAgent } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const updateData = {};
      if (status) updateData.status = status;
      if (assignedAgent !== undefined) updateData.assignedAgent = assignedAgent;

      const updated = await Conversation.findByIdAndUpdate(id, updateData, { new: true });
      if (updated) {
        const obj = updated.toObject ? updated.toObject() : updated;

        await logActivity(
          null,
          'Conversation Updated',
          `Conversation with "${updated.visitorName}" status updated to ${updated.status}`,
          req.user?.name || 'System Admin',
          'conversation_updated'
        );

        return res.status(200).json({
          success: true,
          message: 'Conversation updated successfully',
          conversation: { ...obj, id: updated._id.toString() },
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: 'Conversation not found',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating conversation',
      error: error.message,
    });
  }
};

// @desc    Convert conversation into a Lead
// @route   POST /api/conversations/:id/convert-lead
// @access  Private
const convertToLead = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID or DB disconnected',
      });
    }

    const conv = await Conversation.findById(id);
    if (!conv) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    if (conv.isConvertedToLead) {
      return res.status(400).json({
        success: false,
        message: 'Conversation is already converted into a Lead',
      });
    }

    // Create lead in Lead collection
    const newLead = await Lead.create({
      name: conv.visitorName,
      email: conv.visitorEmail,
      company: 'Inquired via Chatbot',
      serviceInterested: 'AI Solutions',
      leadScore: 75,
      status: 'New',
      assignedUser: req.user?.name || 'System Admin',
    });

    // Update conversation state
    conv.isConvertedToLead = true;
    conv.convertedLeadId = newLead._id;
    await conv.save();

    // Log Activity in MongoDB
    await logActivity(
      newLead._id,
      'Lead Converted from Chat',
      `Visitor "${conv.visitorName}" converted from AI Chatbot conversation into a Lead`,
      req.user?.name || 'System Admin',
      'lead_created'
    );

    return res.status(200).json({
      success: true,
      message: `Conversation successfully converted into Lead "${newLead.name}"`,
      lead: newLead,
      conversation: conv,
    });
  } catch (error) {
    console.error('Error converting conversation to lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error converting conversation to lead',
      error: error.message,
    });
  }
};

// @desc    Delete conversation
// @route   DELETE /api/conversations/:id
// @access  Private
const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const conv = await Conversation.findByIdAndDelete(id);
      if (conv) {
        await logActivity(
          null,
          'Conversation Deleted',
          `Conversation transcript with "${conv.visitorName}" deleted`,
          req.user?.name || 'System Admin',
          'conversation_deleted'
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting conversation',
      error: error.message,
    });
  }
};

module.exports = {
  getConversations,
  getConversationById,
  createConversation,
  updateConversation,
  convertToLead,
  deleteConversation,
};
