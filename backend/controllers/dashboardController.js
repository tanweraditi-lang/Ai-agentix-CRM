const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Followup = require('../models/Followup');
const Chatbot = require('../models/Chatbot');
const Conversation = require('../models/Conversation');
const Activity = require('../models/Activity');
const { getRecentActivities } = require('../utils/activityLogger');

// @desc    Get complete enterprise dashboard analytics and charts from MongoDB (or Seed fallback)
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
    let completedFollowups = 0;
    let overdueFollowups = 0;

    let activeChatbots = 0;
    let totalChatbots = 0;
    let todaysConversations = 0;
    let totalConversations = 0;
    let resolvedByAI = 0;
    let escalatedToHuman = 0;
    let pendingConversations = 0;

    let revenue = 0;
    let conversionRate = 0;

    let monthlyLeadsChart = [];
    let leadStatusDistribution = [];
    let serviceWiseLeads = [];
    let leadSourceDistribution = [];
    let conversationTrend = [];
    let dailyChatbotUsage = [];
    let conversionFunnel = [];
    let revenueTrend = [];
    let followupStatusDistribution = [];
    let topServices = [];

    let recentLeads = [];
    let recentCustomers = [];
    let recentConversations = [];
    let activityTimeline = [];
    let upcomingFollowups = [];

    if (isDbConnected) {
      // 1. Lead Metrics & Distribution
      totalLeads = await Lead.countDocuments();
      newLeads = await Lead.countDocuments({ status: 'New' });
      contactedLeads = await Lead.countDocuments({ status: 'Contacted' });
      qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
      negotiationLeads = await Lead.countDocuments({ status: 'In Negotiation' });
      convertedLeads = await Lead.countDocuments({ status: 'Converted' });
      lostLeads = await Lead.countDocuments({ status: 'Lost' });

      // 2. Customer & Revenue Metrics
      totalCustomers = await Customer.countDocuments();
      const customerAgg = await Customer.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$revenue' } } }
      ]);
      revenue = customerAgg.length > 0 ? customerAgg[0].totalRevenue : totalCustomers * 32000;

      // 3. Followup Metrics
      pendingFollowups = await Followup.countDocuments({ status: 'Pending' });
      completedFollowups = await Followup.countDocuments({ status: 'Completed' });
      overdueFollowups = await Followup.countDocuments({ status: 'Overdue' });

      // 4. Chatbot & Conversation Metrics
      activeChatbots = await Chatbot.countDocuments({ status: 'Active' });
      totalChatbots = await Chatbot.countDocuments();

      totalConversations = await Conversation.countDocuments();
      resolvedByAI = await Conversation.countDocuments({ status: 'Resolved' });
      escalatedToHuman = await Conversation.countDocuments({ status: 'Escalated' });
      pendingConversations = await Conversation.countDocuments({ status: 'Pending' });

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      todaysConversations = await Conversation.countDocuments({ conversationTime: { $gte: startOfToday } });

      conversionRate = totalLeads > 0 ? Number(((totalCustomers / totalLeads) * 100).toFixed(1)) : 0;

      // 5. Aggregations for Charts
      // (1) Monthly Leads
      try {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyAgg = await Lead.aggregate([
          {
            $group: {
              _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
              count: { $sum: 1 },
              converted: { $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] } },
              lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        monthlyLeadsChart = monthlyAgg.map(m => ({
          month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
          count: m.count,
          converted: m.converted,
          lost: m.lost,
        }));
      } catch (err) {
        console.warn('MongoDB monthly aggregation warning:', err.message);
      }

      // (2) Lead Status Distribution (Donut)
      leadStatusDistribution = [
        { name: 'New', value: newLeads },
        { name: 'Contacted', value: contactedLeads },
        { name: 'Qualified', value: qualifiedLeads },
        { name: 'In Negotiation', value: negotiationLeads },
        { name: 'Converted', value: convertedLeads },
        { name: 'Lost', value: lostLeads },
      ];

      // (3) Service Wise Leads & (10) Top Services
      try {
        const serviceAgg = await Lead.aggregate([
          { $group: { _id: '$serviceInterested', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);
        serviceWiseLeads = serviceAgg.map(s => ({ service: s._id || 'AI Solutions', leads: s.count }));
        topServices = serviceWiseLeads.slice(0, 5);
      } catch (err) {
        serviceWiseLeads = [];
      }

      // (4) Lead Source Distribution
      try {
        const sourceAgg = await Lead.aggregate([
          { $group: { _id: '$leadSource', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);
        leadSourceDistribution = sourceAgg.map(s => ({ source: s._id || 'Website Form', value: s.count }));
      } catch (err) {
        leadSourceDistribution = [];
      }

      // (5) Conversation Trend (Area Chart)
      try {
        const convTrendAgg = await Conversation.aggregate([
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$conversationTime' } },
              total: { $sum: 1 },
              resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
              escalated: { $sum: { $cond: [{ $eq: ['$status', 'Escalated'] }, 1, 0] } },
            }
          },
          { $sort: { _id: 1 } },
          { $limit: 14 }
        ]);
        conversationTrend = convTrendAgg.map(c => ({
          date: c._id,
          conversations: c.total,
          resolved: c.resolved,
          escalated: c.escalated,
        }));
      } catch (err) {
        conversationTrend = [];
      }

      // (6) Daily Chatbot Usage
      dailyChatbotUsage = conversationTrend.map(c => ({
        date: c.date,
        usage: c.conversations,
      }));

      // (7) Conversion Funnel
      const visitorsCount = totalConversations > 0 ? totalConversations * 3 : 500;
      conversionFunnel = [
        { stage: 'Visitors', count: visitorsCount },
        { stage: 'Leads', count: totalLeads },
        { stage: 'Qualified', count: qualifiedLeads + negotiationLeads + convertedLeads },
        { stage: 'Proposal', count: negotiationLeads + convertedLeads },
        { stage: 'Customers', count: totalCustomers > 0 ? totalCustomers : convertedLeads },
      ];

      // (8) Revenue Trend
      revenueTrend = [
        { month: 'May 2026', revenue: Math.round(revenue * 0.15) },
        { month: 'Jun 2026', revenue: Math.round(revenue * 0.22) },
        { month: 'Jul 2026', revenue: Math.round(revenue * 0.28) },
        { month: 'Aug 2026', revenue: Math.round(revenue * 0.35) },
      ];

      // (9) Followup Status
      followupStatusDistribution = [
        { status: 'Pending', count: pendingFollowups },
        { status: 'Completed', count: completedFollowups },
        { status: 'Overdue', count: overdueFollowups },
      ];

      // 6. Recent Data Tables
      const rawLeads = await Lead.find().sort({ createdAt: -1 }).limit(5);
      recentLeads = rawLeads.map(l => ({ ...l.toObject(), id: l._id.toString() }));

      const rawCustomers = await Customer.find().sort({ createdAt: -1 }).limit(5);
      recentCustomers = rawCustomers.map(c => ({ ...c.toObject(), id: c._id.toString() }));

      const rawConvs = await Conversation.find().sort({ conversationTime: -1 }).limit(5);
      recentConversations = rawConvs.map(c => ({ ...c.toObject(), id: c._id.toString() }));

      activityTimeline = await getRecentActivities(10);

      const rawFollowups = await Followup.find({ status: 'Pending' }).sort({ date: 1 }).limit(5);
      upcomingFollowups = rawFollowups.map(f => ({ ...f.toObject(), id: f._id.toString() }));

    } else {
      // Fallback when MongoDB is disconnected: Compute live from backend/seeds/*.json
      const loadSeed = (file) => {
        const p = path.join(__dirname, '../seeds', file);
        return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
      };

      const leads = loadSeed('leads.json');
      const customers = loadSeed('customers.json');
      const followups = loadSeed('followups.json');
      const chatbots = loadSeed('chatbots.json');
      const convs = loadSeed('conversations.json');
      const acts = loadSeed('activities.json');

      totalLeads = leads.length;
      newLeads = leads.filter(l => l.status === 'New').length;
      contactedLeads = leads.filter(l => l.status === 'Contacted').length;
      qualifiedLeads = leads.filter(l => l.status === 'Qualified').length;
      negotiationLeads = leads.filter(l => l.status === 'In Negotiation').length;
      convertedLeads = leads.filter(l => l.status === 'Converted').length;
      lostLeads = leads.filter(l => l.status === 'Lost').length;

      totalCustomers = customers.length;
      revenue = customers.reduce((acc, c) => acc + (c.revenue || 35000), 0);

      pendingFollowups = followups.filter(f => f.status === 'Pending' || f.status === 'Scheduled').length;
      completedFollowups = followups.filter(f => f.status === 'Completed').length;
      overdueFollowups = followups.filter(f => f.status === 'Overdue').length;

      activeChatbots = chatbots.filter(b => (b.status || '').toLowerCase() === 'active').length;
      totalChatbots = chatbots.length;

      totalConversations = convs.length;
      resolvedByAI = convs.filter(c => c.status === 'Closed' || c.status === 'Resolved').length;
      escalatedToHuman = convs.filter(c => c.status === 'Escalated').length;
      pendingConversations = convs.filter(c => c.status === 'Pending' || c.status === 'Open').length;
      todaysConversations = convs.length;

      conversionRate = totalLeads > 0 ? Number(((totalCustomers / totalLeads) * 100).toFixed(1)) : 0;

      // Groupings
      leadStatusDistribution = [
        { name: 'New', value: newLeads },
        { name: 'Contacted', value: contactedLeads },
        { name: 'Qualified', value: qualifiedLeads },
        { name: 'In Negotiation', value: negotiationLeads },
        { name: 'Converted', value: convertedLeads },
        { name: 'Lost', value: lostLeads },
      ];

      const sMap = {};
      leads.forEach(l => {
        const s = l.serviceInterested || 'AI Solutions';
        sMap[s] = (sMap[s] || 0) + 1;
      });
      serviceWiseLeads = Object.keys(sMap).map(s => ({ service: s, leads: sMap[s] }));
      topServices = serviceWiseLeads.sort((a, b) => b.leads - a.leads).slice(0, 5);

      const srcMap = {};
      leads.forEach(l => {
        const src = l.leadSource || 'Website Form';
        srcMap[src] = (srcMap[src] || 0) + 1;
      });
      leadSourceDistribution = Object.keys(srcMap).map(src => ({ source: src, value: srcMap[src] }));

      conversionFunnel = [
        { stage: 'Visitors', count: totalConversations * 3 },
        { stage: 'Leads', count: totalLeads },
        { stage: 'Qualified', count: qualifiedLeads + negotiationLeads + convertedLeads },
        { stage: 'Proposal', count: negotiationLeads + convertedLeads },
        { stage: 'Customers', count: totalCustomers },
      ];

      revenueTrend = [
        { month: 'May 2026', revenue: Math.round(revenue * 0.15) },
        { month: 'Jun 2026', revenue: Math.round(revenue * 0.22) },
        { month: 'Jul 2026', revenue: Math.round(revenue * 0.28) },
        { month: 'Aug 2026', revenue: Math.round(revenue * 0.35) },
      ];

      followupStatusDistribution = [
        { status: 'Pending', count: pendingFollowups },
        { status: 'Completed', count: completedFollowups },
        { status: 'Overdue', count: overdueFollowups },
      ];

      recentLeads = leads.slice(0, 5).map((l, idx) => ({ ...l, id: l._id || `lead_${idx + 1}` }));
      recentCustomers = customers.slice(0, 5).map((c, idx) => ({ ...c, id: c._id || `cust_${idx + 1}` }));
      recentConversations = convs.slice(0, 5).map((c, idx) => ({ ...c, id: c._id || `conv_${idx + 1}` }));
      activityTimeline = acts.slice(0, 10).map((a, idx) => ({
        id: a._id || a.id || `act_${idx + 1}`,
        type: (a.activityType || 'crm_event').toLowerCase().replace(/\s+/g, '_'),
        title: a.subject || a.activityType || 'CRM Event',
        description: a.description || '',
        user: a.performedBy || 'System Admin',
        time: 'Recently',
        date: a.timestamp || new Date().toISOString(),
      }));
      upcomingFollowups = followups.slice(0, 5).map((f, idx) => ({ ...f, id: f._id || `follow_${idx + 1}` }));
    }

    return res.status(200).json({
      success: true,
      data: {
        // Metrics
        totalLeads,
        newLeads,
        contactedLeads,
        qualifiedLeads,
        negotiationLeads,
        convertedLeads,
        lostLeads,
        totalCustomers,
        pendingFollowups,
        completedFollowups,
        overdueFollowups,
        activeChatbots,
        totalChatbots,
        todaysConversations,
        totalConversations,
        resolvedByAI,
        escalatedToHuman,
        pendingConversations,
        conversionRate,
        revenue,

        // Charts
        monthlyLeadsChart,
        leadStatusDistribution,
        serviceWiseLeads,
        leadSourceDistribution,
        conversationTrend,
        dailyChatbotUsage,
        conversionFunnel,
        revenueTrend,
        followupStatusDistribution,
        topServices,

        // Tables & Timelines
        recentLeads,
        recentCustomers,
        recentConversations,
        activityTimeline,
        recentActivities: activityTimeline,
        upcomingFollowups,
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
