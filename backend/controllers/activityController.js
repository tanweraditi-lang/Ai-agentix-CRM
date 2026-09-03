const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Activity = require('../models/Activity');

// @desc    Get all activity records
// @route   GET /api/activities
// @access  Public / Private
const getActivities = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        const activities = await Activity.find().sort({ createdAt: -1 });
        if (activities && activities.length > 0) {
          const mappedActivities = activities.map(a => {
            const obj = a.toObject ? a.toObject() : a;
            return {
              ...obj,
              id: (a._id || a.id).toString(),
              title: a.action,
              user: a.user,
            };
          });

          return res.status(200).json({
            success: true,
            count: mappedActivities.length,
            activities: mappedActivities,
            data: mappedActivities,
          });
        }
      } catch (dbErr) {
        console.warn('MongoDB query warning in getActivities:', dbErr.message);
      }
    }

    // Fallback when MongoDB is disconnected: Load from backend/seeds/activities.json
    let seedActivities = [];
    try {
      const seedPath = path.join(__dirname, '../seeds/activities.json');
      if (fs.existsSync(seedPath)) {
        const raw = fs.readFileSync(seedPath, 'utf8');
        seedActivities = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading backend/seeds/activities.json:', err);
    }

    const mappedSeedActivities = seedActivities.map((a, idx) => ({
      id: a._id || a.id || `activity_${idx + 1}`,
      _id: a._id || a.id || `activity_${idx + 1}`,
      title: a.subject || a.activityType || 'CRM Event',
      action: a.activityType || 'CRM Event',
      type: (a.activityType || 'crm_event').toLowerCase().replace(/\s+/g, '_'),
      description: a.description || '',
      user: a.performedBy || 'System Admin',
      performedBy: a.performedBy || 'System Admin',
      targetCompany: a.targetCompany || '',
      time: a.timestamp ? new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
      createdAt: a.timestamp || new Date().toISOString(),
    }));

    return res.status(200).json({
      success: true,
      count: mappedSeedActivities.length,
      activities: mappedSeedActivities,
      data: mappedSeedActivities,
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching activities',
      error: error.message,
    });
  }
};

module.exports = {
  getActivities,
};
