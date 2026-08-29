const Activity = require('../models/Activity');
const mongoose = require('mongoose');

// In-memory activity fallback store when DB is offline
const inMemoryActivities = [];

const logActivity = async (leadId, action, description, user = 'System Admin') => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(leadId)) {
      const act = await Activity.create({
        leadId,
        action,
        description,
        user,
      });
      return act;
    } else {
      const memoryAct = {
        id: 'act_' + Date.now() + Math.random().toString(36).substring(2, 5),
        _id: 'act_' + Date.now(),
        leadId: leadId ? leadId.toString() : 'general',
        action,
        description,
        user,
        createdAt: new Date(),
      };
      inMemoryActivities.unshift(memoryAct);
      return memoryAct;
    }
  } catch (err) {
    console.error('[Activity Logger Error]:', err.message);
    return null;
  }
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
    } else {
      const filtered = inMemoryActivities.filter(a => a.leadId === leadId || a.leadId === 'general');
      return filtered;
    }
  } catch (err) {
    console.error('[Get Activities Error]:', err.message);
    return [];
  }
};

module.exports = {
  logActivity,
  getLeadActivities,
  inMemoryActivities,
};
