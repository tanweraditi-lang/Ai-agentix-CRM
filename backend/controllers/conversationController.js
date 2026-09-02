const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');

// Seed in-memory conversations fallback array
let inMemoryConversations = [
  {
    id: 'conv_201',
    _id: 'conv_201',
    visitorName: 'Aarav Sharma',
    visitorEmail: 'aarav.sharma@techcorp.in',
    question: 'What are your enterprise subscription pricing tiers?',
    botResponse: 'Our Enterprise tier starts at $499/mo including 24/7 dedicated support, custom chatbot workflows, and unlimited lead exports.',
    status: 'Resolved',
    assignedAgent: 'AI Bot Agent',
    conversationTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'conv_202',
    _id: 'conv_202',
    visitorName: 'Sneha Reddy',
    visitorEmail: 'sneha.r@fintech.co',
    question: 'Can I connect this CRM to my custom database?',
    botResponse: 'Yes! AI-Agentix CRM natively supports MongoDB Atlas, PostgreSQL, and REST API webhooks for real-time synchronization.',
    status: 'Resolved',
    assignedAgent: 'AI Bot Agent',
    conversationTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'conv_203',
    _id: 'conv_203',
    visitorName: 'Karan Malhotra',
    visitorEmail: 'karan@mediaworks.in',
    question: 'I need human support for custom SLA contract negotiation.',
    botResponse: 'I am routing your request to our Senior Account Executive Priya Patel. She will reach out to you shortly.',
    status: 'Escalated',
    assignedAgent: 'Priya Patel',
    conversationTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'conv_204',
    _id: 'conv_204',
    visitorName: 'Meera Nair',
    visitorEmail: 'meera.nair@global.org',
    question: 'How do I embed the chatbot widget on my website?',
    botResponse: 'Simply copy the Javascript snippet from your Chatbot Settings tab and paste it before the closing </body> tag of your website.',
    status: 'Pending',
    assignedAgent: 'Rajesh Sharma',
    conversationTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

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
          { botResponse: searchRegex },
          { assignedAgent: searchRegex },
        ];
      }

      try {
        let convs = await Conversation.find(query).sort({ conversationTime: -1 });

        // If database is empty, seed demo conversations into DB
        if (convs.length === 0 && !safeStatus && !safeSearch) {
          const seeded = await Conversation.insertMany(
            inMemoryConversations.map(c => ({
              visitorName: c.visitorName,
              visitorEmail: c.visitorEmail,
              question: c.question,
              botResponse: c.botResponse,
              status: c.status,
              assignedAgent: c.assignedAgent,
              conversationTime: c.conversationTime,
            }))
          );
          convs = seeded;
        }

        const mappedConvs = convs.map(c => {
          const obj = c.toObject ? c.toObject() : c;
          return {
            ...obj,
            id: (c._id || c.id).toString(),
          };
        });

        return res.status(200).json({
          success: true,
          count: mappedConvs.length,
          conversations: mappedConvs,
        });
      } catch (dbErr) {
        console.error('MongoDB query error in getConversations:', dbErr.message);
      }
    }

    // Fallback logic
    let result = [...inMemoryConversations];
    if (safeStatus && safeStatus.toLowerCase() !== 'all') {
      result = result.filter(c => c.status.toLowerCase() === safeStatus.toLowerCase());
    }
    if (safeSearch) {
      const s = safeSearch.toLowerCase();
      result = result.filter(
        c =>
          c.visitorName.toLowerCase().includes(s) ||
          c.visitorEmail.toLowerCase().includes(s) ||
          c.question.toLowerCase().includes(s) ||
          c.botResponse.toLowerCase().includes(s) ||
          c.assignedAgent.toLowerCase().includes(s)
      );
    }

    return res.status(200).json({
      success: true,
      count: result.length,
      conversations: result,
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
          conversation: { ...obj, id: conv._id.toString() },
        });
      }
    }

    const memoryConv = inMemoryConversations.find(c => c.id === id || c._id === id);
    if (memoryConv) {
      return res.status(200).json({
        success: true,
        conversation: memoryConv,
      });
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
    const { visitorName, visitorEmail, question, botResponse, status, assignedAgent, chatbotId } = req.body;

    if (!visitorName || !visitorEmail || !question || !botResponse) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in Visitor Name, Email, Question, and Bot Response',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    let newConv;

    if (isDbConnected) {
      const created = await Conversation.create({
        visitorName: visitorName.trim(),
        visitorEmail: visitorEmail.toLowerCase().trim(),
        question: question.trim(),
        botResponse: botResponse.trim(),
        status: status || 'Pending',
        assignedAgent: assignedAgent || 'AI Bot Agent',
        chatbotId: mongoose.Types.ObjectId.isValid(chatbotId) ? chatbotId : null,
        conversationTime: new Date(),
      });
      const obj = created.toObject ? created.toObject() : created;
      newConv = { ...obj, id: created._id.toString() };
    } else {
      newConv = {
        id: 'conv_' + Date.now(),
        _id: 'conv_' + Date.now(),
        visitorName: visitorName.trim(),
        visitorEmail: visitorEmail.toLowerCase().trim(),
        question: question.trim(),
        botResponse: botResponse.trim(),
        status: status || 'Pending',
        assignedAgent: assignedAgent || 'AI Bot Agent',
        conversationTime: new Date(),
        createdAt: new Date(),
      };
      inMemoryConversations.unshift(newConv);
    }

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
        return res.status(200).json({
          success: true,
          message: 'Conversation updated successfully',
          conversation: { ...obj, id: updated._id.toString() },
        });
      }
    }

    const idx = inMemoryConversations.findIndex(c => c.id === id || c._id === id);
    if (idx !== -1) {
      if (status) inMemoryConversations[idx].status = status;
      if (assignedAgent !== undefined) inMemoryConversations[idx].assignedAgent = assignedAgent;

      return res.status(200).json({
        success: true,
        message: 'Conversation updated successfully',
        conversation: inMemoryConversations[idx],
      });
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

// @desc    Delete conversation
// @route   DELETE /api/conversations/:id
// @access  Private
const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      await Conversation.findByIdAndDelete(id);
    }

    const idx = inMemoryConversations.findIndex(c => c.id === id || c._id === id);
    if (idx !== -1) {
      inMemoryConversations.splice(idx, 1);
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
  deleteConversation,
};
