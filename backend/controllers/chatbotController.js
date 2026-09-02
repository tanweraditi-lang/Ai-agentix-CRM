const mongoose = require('mongoose');
const Chatbot = require('../models/Chatbot');
const { logActivity } = require('../utils/activityLogger');

// @desc    Get all chatbots (with search & status filter)
// @route   GET /api/chatbots
// @access  Public / Private
const getChatbots = async (req, res) => {
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
          { name: searchRegex },
          { clientName: searchRegex },
          { website: searchRegex },
          { aiModel: searchRegex },
          { version: searchRegex },
        ];
      }

      const bots = await Chatbot.find(query).sort({ createdAt: -1 });
      const mappedBots = bots.map(b => {
        const obj = b.toObject ? b.toObject() : b;
        return {
          ...obj,
          id: (b._id || b.id).toString(),
        };
      });

      return res.status(200).json({
        success: true,
        count: mappedBots.length,
        chatbots: mappedBots,
      });
    }

    return res.status(200).json({
      success: true,
      count: 0,
      chatbots: [],
    });
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching chatbots',
      error: error.message,
    });
  }
};

// @desc    Get single chatbot by ID
// @route   GET /api/chatbots/:id
// @access  Public / Private
const getChatbotById = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const bot = await Chatbot.findById(id);
      if (bot) {
        const obj = bot.toObject ? bot.toObject() : bot;
        return res.status(200).json({
          success: true,
          chatbot: { ...obj, id: bot._id.toString() },
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: 'Chatbot not found',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching chatbot',
      error: error.message,
    });
  }
};

// @desc    Create new chatbot
// @route   POST /api/chatbots
// @access  Private
const createChatbot = async (req, res) => {
  try {
    const { name, clientName, website, aiModel, description, version, status, totalConversations, todaysConversations } = req.body;

    if (!name || !website) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Bot Name and Website URL',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable',
      });
    }

    const created = await Chatbot.create({
      name: name.trim(),
      clientName: (clientName || 'Enterprise Client').trim(),
      website: website.trim(),
      aiModel: aiModel || 'Gemini 1.5 Pro',
      description: (description || '').trim(),
      version: version || 'v1.0',
      status: status || 'Active',
      totalConversations: totalConversations !== undefined ? Number(totalConversations) : 0,
      todaysConversations: todaysConversations !== undefined ? Number(todaysConversations) : 0,
    });

    const obj = created.toObject ? created.toObject() : created;
    const newBot = { ...obj, id: created._id.toString() };

    // Log real activity event to MongoDB
    await logActivity(
      null,
      'Chatbot Created',
      `New AI Chatbot "${name}" created for client "${newBot.clientName}"`,
      req.user?.name || 'System Admin',
      'chatbot_created'
    );

    return res.status(201).json({
      success: true,
      message: 'Chatbot created successfully',
      chatbot: newBot,
    });
  } catch (error) {
    console.error('Error creating chatbot:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating chatbot',
      error: error.message,
    });
  }
};

// @desc    Update chatbot
// @route   PUT /api/chatbots/:id
// @access  Private
const updateChatbot = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, clientName, website, aiModel, description, version, status, totalConversations, todaysConversations } = req.body;

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const updateData = {};
      if (name) updateData.name = name.trim();
      if (clientName) updateData.clientName = clientName.trim();
      if (website) updateData.website = website.trim();
      if (aiModel) updateData.aiModel = aiModel.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (version) updateData.version = version;
      if (status) updateData.status = status;
      if (totalConversations !== undefined) updateData.totalConversations = Number(totalConversations);
      if (todaysConversations !== undefined) updateData.todaysConversations = Number(todaysConversations);

      const updated = await Chatbot.findByIdAndUpdate(id, updateData, { new: true });
      if (updated) {
        const obj = updated.toObject ? updated.toObject() : updated;

        await logActivity(
          null,
          'Chatbot Updated',
          `Chatbot "${updated.name}" updated`,
          req.user?.name || 'System Admin',
          'chatbot_updated'
        );

        return res.status(200).json({
          success: true,
          message: 'Chatbot updated successfully',
          chatbot: { ...obj, id: updated._id.toString() },
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: 'Chatbot not found',
    });
  } catch (error) {
    console.error('Error updating chatbot:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating chatbot',
      error: error.message,
    });
  }
};

// @desc    Delete chatbot
// @route   DELETE /api/chatbots/:id
// @access  Private
const deleteChatbot = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const bot = await Chatbot.findByIdAndDelete(id);
      if (bot) {
        await logActivity(
          null,
          'Chatbot Deleted',
          `Chatbot "${bot.name}" deleted`,
          req.user?.name || 'System Admin',
          'chatbot_deleted'
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Chatbot deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting chatbot:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting chatbot',
      error: error.message,
    });
  }
};

module.exports = {
  getChatbots,
  getChatbotById,
  createChatbot,
  updateChatbot,
  deleteChatbot,
};
