const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Followup = require('../models/Followup');
const Chatbot = require('../models/Chatbot');
const Conversation = require('../models/Conversation');
const { getRecentActivities } = require('../utils/activityLogger');

// @desc    Get real live dashboard analytics directly from MongoDB database
// @route   GET /api/dashboard
// @access  Public / Private
const getDashboardMetrics = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    let totalLeads = 0;
    let newLeads = 0;
    let convertedLeads = 0;
    let lostLeads = 0;
    let contactedLeads = 0;
    let qualifiedLeads = 0;
    let negotiationLeads = 0;

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
    let monthlyLeadsChart = [];

    // Optional telemetry fields
    let avgResponseTime = null;
    let customerSatisfaction = null;
    let weeklyChatGrowth = null;

    if (isDbConnected) {
      // 1. Real Lead Counts queried from MongoDB Lead collection
      totalLeads = await Lead.countDocuments();
      newLeads = await Lead.countDocuments({ status: 'New' });
      convertedLeads = await Lead.countDocuments({ status: 'Converted' });
      lostLeads = await Lead.countDocuments({ status: 'Lost' });
      contactedLeads = await Lead.countDocuments({ status: 'Contacted' });
      qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
      negotiationLeads = await Lead.countDocuments({ status: 'In Negotiation' });

      // 2. Real Customer & Followup Counts
      totalCustomers = await Customer.countDocuments();
      pendingFollowups = await Followup.countDocuments({ status: 'Pending' });

      // 3. Real Chatbot Counts
      activeChatbots = await Chatbot.countDocuments({ status: 'Active' });
      totalChatbots = await Chatbot.countDocuments();

      // 4. Real Conversation Counts
      totalConversations = await Conversation.countDocuments();
      resolvedByAI = await Conversation.countDocuments({ status: 'Resolved' });
      escalatedToHuman = await Conversation.countDocuments({ status: 'Escalated' });
      pendingConversations = await Conversation.countDocuments({ status: 'Pending' });

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      todaysConversations = await Conversation.countDocuments({ conversationTime: { $gte: startOfToday } });

      // Real Conversion Rate calculation
      const activeConverted = totalCustomers > 0 ? totalCustomers : convertedLeads;
      conversionRate = totalLeads > 0 
        ? Number(((activeConverted / totalLeads) * 100).toFixed(1)) 
        : 0;

      // 5. Real Monthly Leads Aggregation using Lead.createdAt in MongoDB
      try {
        const monthlyAggregation = await Lead.aggregate([
          {
            $project: {
              status: 1,
              createdAtDate: { $ifNull: ['$createdAt', '$$NOW'] }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAtDate' },
                month: { $month: '$createdAtDate' },
              },
              count: { $sum: 1 },
              converted: {
                $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] }
              },
              lost: {
                $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] }
              }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        monthlyLeadsChart = monthlyAggregation.map(item => {
          const mIdx = item._id.month - 1;
          return {
            month: `${monthNames[mIdx]} ${item._id.year}`,
            count: item.count,
            converted: item.converted,
            lost: item.lost,
          };
        });
      } catch (aggErr) {
        console.warn('MongoDB aggregation warning in getDashboardMetrics:', aggErr.message);
      }

      // Guaranteed fallback grouping if documents exist
      if (monthlyLeadsChart.length === 0 && totalLeads > 0) {
        const allLeads = await Lead.find({}, 'createdAt status');
        const monthMap = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        allLeads.forEach(l => {
          const d = l.createdAt ? new Date(l.createdAt) : new Date();
          const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
          if (!monthMap[key]) {
            monthMap[key] = { month: key, count: 0, converted: 0, lost: 0, year: d.getFullYear(), mIdx: d.getMonth() };
          }
          monthMap[key].count += 1;
          if (l.status === 'Converted') monthMap[key].converted += 1;
          if (l.status === 'Lost') monthMap[key].lost += 1;
        });

        monthlyLeadsChart = Object.values(monthMap).sort((a, b) => (a.year - b.year) || (a.mIdx - b.mIdx));
      }

      // 6. Fetch real recent activities from Activity collection
      recentActivities = await getRecentActivities(10);
    }

    return res.status(200).json({
      success: true,
      data: {
        // Requirements: Real MongoDB Lead Metrics
        totalLeads,
        newLeads,
        convertedLeads,
        lostLeads,
        contactedLeads,
        qualifiedLeads,
        negotiationLeads,

        // Monthly Leads Chart Aggregation Data
        monthlyLeadsChart,

        // CRM & AI Chatbot Counts
        totalCustomers,
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

        // Telemetry nulls when uncalculated
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
