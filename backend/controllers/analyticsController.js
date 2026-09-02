const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Chatbot = require('../models/Chatbot');

// @desc    Get AI Chatbot Conversation Analytics from MongoDB
// @route   GET /api/analytics
// @access  Public / Private
const getAnalytics = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    let total = 0;
    let resolved = 0;
    let escalated = 0;
    let pending = 0;
    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;

    if (isDbConnected) {
      total = await Conversation.countDocuments();
      resolved = await Conversation.countDocuments({ status: 'Resolved' });
      escalated = await Conversation.countDocuments({ status: 'Escalated' });
      pending = await Conversation.countDocuments({ status: 'Pending' });

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      todayCount = await Conversation.countDocuments({ conversationTime: { $gte: startOfToday } });

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 7);
      weekCount = await Conversation.countDocuments({ conversationTime: { $gte: startOfWeek } });

      const startOfMonth = new Date();
      startOfMonth.setDate(startOfMonth.getDate() - 30);
      monthCount = await Conversation.countDocuments({ conversationTime: { $gte: startOfMonth } });
    }

    const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) + '%' : null;
    const escalationRate = total > 0 ? ((escalated / total) * 100).toFixed(1) + '%' : null;
    const botAccuracy = total > 0 ? (((resolved + pending * 0.5) / total) * 100).toFixed(1) + '%' : null;

    // Aggregate real top asked questions if conversations exist
    let topAskedQuestions = [];
    if (isDbConnected && total > 0) {
      const dbQuestions = await Conversation.aggregate([
        { $group: { _id: '$question', count: { $sum: 1 }, status: { $first: '$status' } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);
      topAskedQuestions = dbQuestions.map((q, idx) => ({
        id: idx + 1,
        question: q._id,
        category: 'Inquiry',
        count: q.count,
        resolution: q.status === 'Resolved' ? '100%' : '0%',
      }));
    }

    return res.status(200).json({
      success: true,
      analytics: {
        dailyConversations: todayCount,
        weeklyConversations: weekCount,
        monthlyConversations: monthCount,
        totalConversations: total,
        resolvedByAI: resolved,
        escalatedToHuman: escalated,
        pendingConversations: pending,
        botAccuracy: botAccuracy ? `${botAccuracy}` : 'Not enough data',
        resolutionRate: resolutionRate ? `${resolutionRate}` : 'Not enough data',
        escalationRate: escalationRate ? `${escalationRate}` : 'Not enough data',
        topAskedQuestions,
        trends: {
          daily: [
            { label: 'Today', count: todayCount },
          ],
          weekly: [
            { label: 'Past 7 Days', count: weekCount },
          ],
          monthly: [
            { label: 'Past 30 Days', count: monthCount },
          ],
        },
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching analytics',
      error: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};
