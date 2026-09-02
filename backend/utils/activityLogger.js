const Activity = require('../models/Activity');
const mongoose = require('mongoose');

const logActivity = async (leadId, action, description, user = 'System Admin', type = 'crm_event') => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const validLeadId = mongoose.Types.ObjectId.isValid(leadId) ? leadId : null;
      const act = await Activity.create({
        leadId: validLeadId,
        action,
        description,
        type,
        user,
      });
      return act;
    }
  } catch (err) {
    console.error('[Activity Logger Error]:', err.message);
  }
  return null;
};

const getRecentActivities = async (limit = 10) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const dbActivities = await Activity.find().sort({ createdAt: -1 }).limit(limit);
      return dbActivities.map(a => ({
        id: a._id.toString(),
        type: a.type || 'crm_event',
        title: a.action,
        description: a.description,
        user: a.user,
        leadId: a.leadId ? a.leadId.toString() : null,
        time: a.createdAt ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        date: a.createdAt,
      }));
    }
  } catch (err) {
    console.error('[Get Recent Activities Error]:', err.message);
  }
  return [];
};

const getLeadActivities = async (leadId) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(leadId)) {
      const dbActivities = await Activity.find({ leadId }).sort({ createdAt: -1 });
      return dbActivities.map(a => ({
        ...a.toObject(),
        id: a._id.toString(),
      }));
    }
  } catch (err) {
    console.error('[Get Lead Activities Error]:', err.message);
  }
  return [];
};

module.exports = {
  logActivity,
  getRecentActivities,
  getLeadActivities,
};
