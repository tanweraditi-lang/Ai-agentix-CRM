const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Followup = require('../models/Followup');

// @desc    Get all follow-ups / tasks
// @route   GET /api/followups
// @access  Public (or Protected)
const getFollowups = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const followups = await Followup.find().populate('leadId', 'name company email').sort({ createdAt: -1 });
      
      if (followups && followups.length > 0) {
        return res.status(200).json({
          success: true,
          count: followups.length,
          data: followups,
          followups,
        });
      }
    }

    // Fallback when MongoDB is disconnected or empty: Load from backend/seeds/followups.json
    let seedFollowups = [];
    try {
      const seedPath = path.join(__dirname, '../seeds/followups.json');
      if (fs.existsSync(seedPath)) {
        const raw = fs.readFileSync(seedPath, 'utf8');
        seedFollowups = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading backend/seeds/followups.json:', err);
    }

    const mappedSeedFollowups = seedFollowups.map((f, idx) => ({
      id: f._id || f.id || `followup_${idx + 1}`,
      _id: f._id || f.id || `followup_${idx + 1}`,
      task: f.task || `${f.followupType || 'Follow-up'} with ${f.customerName || f.clientName || 'Client'}`,
      clientName: f.customerName || f.clientName || f.company || 'Client',
      customerName: f.customerName || f.clientName || '',
      company: f.company || '',
      time: f.time || f.followupDate || 'Scheduled',
      status: f.status || 'Pending',
      priority: f.priority || 'Medium',
      remarks: f.remarks || '',
    }));

    return res.status(200).json({
      success: true,
      count: mappedSeedFollowups.length,
      data: mappedSeedFollowups,
      followups: mappedSeedFollowups,
    });
  } catch (error) {
    console.error('Error in getFollowups controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching followups',
      error: error.message,
    });
  }
};

// @desc    Create a new follow-up / task
// @route   POST /api/followups
// @access  Public (or Protected)
const createFollowup = async (req, res) => {
  try {
    const { task, clientName, leadId, date, time, notes, status } = req.body;

    if (!task || !task.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const newFollowup = await Followup.create({
      task: task.trim(),
      clientName: clientName ? clientName.trim() : 'General Client',
      leadId: leadId || null,
      date: date ? new Date(date) : new Date(),
      time: time ? time.trim() : 'Today at 2:00 PM',
      notes: notes ? notes.trim() : '',
      status: status || 'Pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Task scheduled successfully',
      data: newFollowup,
    });
  } catch (error) {
    console.error('Error in createFollowup controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while scheduling task',
      error: error.message,
    });
  }
};

// @desc    Update a follow-up
// @route   PUT /api/followups/:id
// @access  Public (or Protected)
const updateFollowup = async (req, res) => {
  try {
    const followup = await Followup.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!followup) {
      return res.status(404).json({
        success: false,
        message: 'Follow-up task not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: followup,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update follow-up',
      error: error.message,
    });
  }
};

// @desc    Delete a follow-up
// @route   DELETE /api/followups/:id
// @access  Public (or Protected)
const deleteFollowup = async (req, res) => {
  try {
    const followup = await Followup.findByIdAndDelete(req.params.id);

    if (!followup) {
      return res.status(404).json({
        success: false,
        message: 'Follow-up task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete follow-up',
      error: error.message,
    });
  }
};

module.exports = {
  getFollowups,
  createFollowup,
  updateFollowup,
  deleteFollowup,
};
