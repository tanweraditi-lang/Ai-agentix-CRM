const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Followup = require('../models/Followup');
const Chatbot = require('../models/Chatbot');
const Conversation = require('../models/Conversation');
const { getRecentActivities } = require('../utils/activityLogger');

// @desc    Get real live dashboard statistics dynamically from MongoDB database
// @route   GET /api/dashboard
// @access  Public / Private
const getDashboardMetrics = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    let totalLeads = 0;
    let newLeads = 0;
    let convertedLeads = 0;
    let totalCustomers = 0;
    let pendingFollowups = 0;
    let activeChatbots = 0;
    let totalChatbots = 0;
    let todaysConversations = 0;
    let totalConversations = 0;
    let resolvedByAI = 0;
    let escalatedToHuman = 0;
    let pendingConversations = 0;
    let conversionRate = 0;
    let recentActivities = [];

    // Optional metrics return null when insufficient real data exists
    let avgResponseTime = null;
    let customerSatisfaction = null;
    let weeklyChatGrowth = null;

    if (isDbConnected) {
      // Real MongoDB queries
      totalLeads = await Lead.countDocuments();
      newLeads = await Lead.countDocuments({ status: 'New' });
      convertedLeads = await Lead.countDocuments({ status: 'Converted' });
      totalCustomers = await Customer.countDocuments();
      pendingFollowups = await Followup.countDocuments({ status: 'Pending' });

      activeChatbots = await Chatbot.countDocuments({ status: 'Active' });
      totalChatbots = await Chatbot.countDocuments();

      totalConversations = await Conversation.countDocuments();
      resolvedByAI = await Conversation.countDocuments({ status: 'Resolved' });
      escalatedToHuman = await Conversation.countDocuments({ status: 'Escalated' });
      pendingConversations = await Conversation.countDocuments({ status: 'Pending' });

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      todaysConversations = await Conversation.countDocuments({ conversationTime: { $gte: startOfToday } });

      // Real conversion rate calculation
      const activeConverted = totalCustomers > 0 ? totalCustomers : convertedLeads;
      conversionRate = totalLeads > 0 
        ? Number(((activeConverted / totalLeads) * 100).toFixed(1)) 
        : 0;

      // Fetch real activities from MongoDB Activity collection
      recentActivities = await getRecentActivities(10);
    }

    return res.status(200).json({
      success: true,
      data: {
        // PART 3 Requirements: Real Live Counts
        totalLeads,
        totalCustomers,
        newLeads,
        convertedLeads,
        pendingFollowups,
        activeChatbots,
        totalChatbots,
        todaysConversations,
        totalConversations,
        resolvedByAI,
        escalatedToHuman,
        pendingConversations,
        conversionRate,

        // Real Activity Stream
        recentActivities,

        // Null when real data unavailable
        avgResponseTime,
        customerSatisfaction,
        weeklyChatGrowth,
      }
    });
  } catch (error) {
    console.error('Error computing live dashboard metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error computing dashboard metrics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardMetrics
};
