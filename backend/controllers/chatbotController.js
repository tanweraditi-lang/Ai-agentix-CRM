const mongoose = require('mongoose');
const Chatbot = require('../models/Chatbot');

// Seed in-memory chatbots fallback array
let inMemoryChatbots = [
  {
    id: 'bot_101',
    _id: 'bot_101',
    name: 'Customer Support Bot',
    website: 'https://agentix.ai/support',
    description: 'Handles 24/7 tier-1 customer inquiries, FAQs, and ticket routing',
    version: 'v2.4',
    status: 'Active',
    createdAt: new Date('2026-07-15T09:30:00Z'),
  },
  {
    id: 'bot_102',
    _id: 'bot_102',
    name: 'Sales Qualifier Bot',
    website: 'https://agentix.ai/sales',
    description: 'Engages website visitors, captures leads, and schedules demo calls',
    version: 'v1.8',
    status: 'Active',
    createdAt: new Date('2026-08-01T14:15:00Z'),
  },
  {
    id: 'bot_103',
    _id: 'bot_103',
    name: 'E-commerce Assistant',
    website: 'https://store.agentix.ai',
    description: 'Assists customers with order tracking, product recommendations, and refunds',
    version: 'v1.1',
    status: 'Inactive',
    createdAt: new Date('2026-08-10T11:00:00Z'),
  },
];

// @desc    Get all chatbots (with search & status filter)
// @route   GET /api/chatbots
// @access  Private / Public
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
          { website: searchRegex },
          { description: searchRegex },
          { version: searchRegex },
        ];
      }

      try {
        let bots = await Chatbot.find(query).sort({ createdAt: -1 });

        // If database is empty, seed demo bots into DB
        if (bots.length === 0 && !safeStatus && !safeSearch) {
          const seeded = await Chatbot.insertMany([
            {
              name: 'Customer Support Bot',
              website: 'https://agentix.ai/support',
              description: 'Handles 24/7 tier-1 customer inquiries, FAQs, and ticket routing',
              version: 'v2.4',
              status: 'Active',
            },
            {
              name: 'Sales Qualifier Bot',
              website: 'https://agentix.ai/sales',
              description: 'Engages website visitors, captures leads, and schedules demo calls',
              version: 'v1.8',
              status: 'Active',
            },
            {
              name: 'E-commerce Assistant',
              website: 'https://store.agentix.ai',
              description: 'Assists customers with order tracking, product recommendations, and refunds',
              version: 'v1.1',
              status: 'Inactive',
            },
          ]);
          bots = seeded;
        }

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
      } catch (dbErr) {
        console.error('MongoDB query error in getChatbots:', dbErr.message);
      }
    }

    // Fallback logic
    let result = [...inMemoryChatbots];
    if (safeStatus && safeStatus.toLowerCase() !== 'all') {
      result = result.filter(b => b.status.toLowerCase() === safeStatus.toLowerCase());
    }
    if (safeSearch) {
      const s = safeSearch.toLowerCase();
      result = result.filter(
        b =>
          b.name.toLowerCase().includes(s) ||
          b.website.toLowerCase().includes(s) ||
          b.description.toLowerCase().includes(s) ||
          b.version.toLowerCase().includes(s)
      );
    }

    return res.status(200).json({
      success: true,
      count: result.length,
      chatbots: result,
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
// @access  Private / Public
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

    const memoryBot = inMemoryChatbots.find(b => b.id === id || b._id === id);
    if (memoryBot) {
      return res.status(200).json({
        success: true,
        chatbot: memoryBot,
      });
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
    const { name, website, description, version, status } = req.body;

    if (!name || !website) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Bot Name and Website URL',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    let newBot;

    if (isDbConnected) {
      const created = await Chatbot.create({
        name: name.trim(),
        website: website.trim(),
        description: (description || '').trim(),
        version: version || 'v1.0',
        status: status || 'Active',
      });
      const obj = created.toObject ? created.toObject() : created;
      newBot = { ...obj, id: created._id.toString() };
    } else {
      newBot = {
        id: 'bot_' + Date.now(),
        _id: 'bot_' + Date.now(),
        name: name.trim(),
        website: website.trim(),
        description: (description || '').trim(),
        version: version || 'v1.0',
        status: status || 'Active',
        createdAt: new Date(),
      };
      inMemoryChatbots.unshift(newBot);
    }

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
    const { name, website, description, version, status } = req.body;

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const updateData = {};
      if (name) updateData.name = name.trim();
      if (website) updateData.website = website.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (version) updateData.version = version;
      if (status) updateData.status = status;

      const updated = await Chatbot.findByIdAndUpdate(id, updateData, { new: true });
      if (updated) {
        const obj = updated.toObject ? updated.toObject() : updated;
        return res.status(200).json({
          success: true,
          message: 'Chatbot updated successfully',
          chatbot: { ...obj, id: updated._id.toString() },
        });
      }
    }

    const idx = inMemoryChatbots.findIndex(b => b.id === id || b._id === id);
    if (idx !== -1) {
      if (name) inMemoryChatbots[idx].name = name.trim();
      if (website) inMemoryChatbots[idx].website = website.trim();
      if (description !== undefined) inMemoryChatbots[idx].description = description.trim();
      if (version) inMemoryChatbots[idx].version = version;
      if (status) inMemoryChatbots[idx].status = status;

      return res.status(200).json({
        success: true,
        message: 'Chatbot updated successfully',
        chatbot: inMemoryChatbots[idx],
      });
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
      await Chatbot.findByIdAndDelete(id);
    }

    const idx = inMemoryChatbots.findIndex(b => b.id === id || b._id === id);
    if (idx !== -1) {
      inMemoryChatbots.splice(idx, 1);
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
