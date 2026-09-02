const mongoose = require('mongoose');
const User = require('../models/User');
const Lead = require('../models/Lead');
const Followup = require('../models/Followup');
const { logActivity } = require('../utils/activityLogger');

// @desc    Get all leads (with advanced search, status, date range, and sorting)
// @route   GET /api/leads
// @access  Public / Private
const getLeads = async (req, res) => {
  try {
    const { status, search, assignedUser, dateFilter, startDate, endDate, sortBy } = req.query;
    const isDbConnected = mongoose.connection.readyState === 1;

    const safeStatus = typeof status === 'string' ? status.trim() : '';
    const safeSearch = typeof search === 'string' ? search.trim() : '';
    const safeDateFilter = typeof dateFilter === 'string' ? dateFilter.trim() : '';
    const safeSortBy = typeof sortBy === 'string' ? sortBy.trim() : 'newest';

    if (isDbConnected) {
      let query = {};

      // 1. Status Filter
      if (safeStatus && safeStatus.toLowerCase() !== 'all') {
        query.status = new RegExp(`^${safeStatus}$`, 'i');
      }

      // 2. Assigned User Filter
      if (typeof assignedUser === 'string' && mongoose.Types.ObjectId.isValid(assignedUser)) {
        query.assignedUser = assignedUser;
      }

      // 3. Advanced Search Query across Full Name, Email, Company, Phone, Service Interested
      if (safeSearch !== '') {
        const cleanSearch = safeSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(cleanSearch, 'i');
        query.$or = [
          { name: searchRegex },
          { email: searchRegex },
          { company: searchRegex },
          { phone: searchRegex },
          { serviceInterested: searchRegex },
        ];
      }

      // 4. Date Filters (Today, Last 7 Days, Last 30 Days, Custom Range)
      if (safeDateFilter === 'today') {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        query.createdAt = { $gte: startOfToday };
      } else if (safeDateFilter === 'last7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        query.createdAt = { $gte: sevenDaysAgo };
      } else if (safeDateFilter === 'last30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        query.createdAt = { $gte: thirtyDaysAgo };
      } else if (safeDateFilter === 'custom' && (startDate || endDate)) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          query.createdAt.$lte = end;
        }
      }

      // 5. Sorting (Newest First, Oldest First, Name A-Z, Name Z-A)
      let sortOption = { createdAt: -1 };
      if (safeSortBy === 'oldest') {
        sortOption = { createdAt: 1 };
      } else if (safeSortBy === 'name_asc') {
        sortOption = { name: 1 };
      } else if (safeSortBy === 'name_desc') {
        sortOption = { name: -1 };
      }

      let leads;
      try {
        leads = await Lead.find(query)
          .populate('assignedUser', 'name email role')
          .sort(sortOption);
      } catch (popErr) {
        leads = await Lead.find(query).sort(sortOption);
      }

      const mappedLeads = leads.map(l => {
        const obj = l.toObject ? l.toObject() : l;
        return {
          ...obj,
          id: (l._id || l.id || '').toString(),
          score: l.score || 85,
        };
      });

      return res.status(200).json({
        success: true,
        count: mappedLeads.length,
        leads: mappedLeads,
      });
    }

    return res.status(200).json({
      success: true,
      count: 0,
      leads: [],
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching leads',
      error: error.message,
    });
  }
};

// @desc    Get single lead by ID with complete details & activities
// @route   GET /api/leads/:id
// @access  Public / Private
const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const lead = await Lead.findById(id).populate('assignedUser', 'name email role');
      if (lead) {
        const followups = await Followup.find({ leadId: id }).sort({ date: 1 });
        const leadObj = lead.toObject();

        return res.status(200).json({
          success: true,
          lead: {
            ...leadObj,
            id: lead._id.toString(),
            followups: followups.map(f => ({ ...f.toObject(), id: f._id.toString() })),
          },
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: 'Lead not found',
    });
  } catch (error) {
    console.error('Error fetching lead by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching lead details',
      error: error.message,
    });
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private / Public
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, serviceInterested, status, leadScore, assignedUser } = req.body;

    if (!name || !email || !serviceInterested) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in Name, Email, and Service Interested',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable',
      });
    }

    const leadStatus = status || 'New';
    const scoreVal = leadScore !== undefined ? Number(leadScore) : 85;

    const created = await Lead.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : '',
      serviceInterested: serviceInterested.trim(),
      status: leadStatus,
      score: scoreVal,
      assignedUser: mongoose.Types.ObjectId.isValid(assignedUser) ? assignedUser : null,
    });

    const newLead = { ...created.toObject(), id: created._id.toString() };

    await logActivity(
      newLead._id,
      'Lead Created',
      `Lead "${name}" added to pipeline in ${leadStatus} stage`,
      req.user?.name || 'System Admin',
      'lead_created'
    );

    return res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      lead: newLead,
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating lead',
      error: error.message,
    });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private / Public
const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, serviceInterested, status, score, leadScore, assignedUser } = req.body;

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const existing = await Lead.findById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Lead not found',
        });
      }

      const updateData = {};
      if (name) updateData.name = name.trim();
      if (email) updateData.email = email.toLowerCase().trim();
      if (phone !== undefined) updateData.phone = phone.trim();
      if (company !== undefined) updateData.company = company.trim();
      if (serviceInterested) updateData.serviceInterested = serviceInterested.trim();
      if (status) updateData.status = status;
      if (score !== undefined || leadScore !== undefined) {
        updateData.score = Number(score !== undefined ? score : leadScore);
      }
      if (assignedUser && mongoose.Types.ObjectId.isValid(assignedUser)) {
        updateData.assignedUser = assignedUser;
      }

      const updated = await Lead.findByIdAndUpdate(id, updateData, { new: true });
      const updatedObj = { ...updated.toObject(), id: updated._id.toString() };

      if (status && status !== existing.status) {
        await logActivity(
          updated._id,
          'Lead Stage Updated',
          `Lead "${updated.name}" stage changed from ${existing.status} to ${status}`,
          req.user?.name || 'System Admin',
          'lead_activity'
        );
      } else {
        await logActivity(
          updated._id,
          'Lead Updated',
          `Lead details for "${updated.name}" updated`,
          req.user?.name || 'System Admin',
          'lead_activity'
        );
      }

      return res.status(200).json({
        success: true,
        message: 'Lead updated successfully',
        lead: updatedObj,
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Lead not found',
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating lead',
      error: error.message,
    });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private / Public
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await Lead.findByIdAndDelete(id);
      if (deleted) {
        await logActivity(
          null,
          'Lead Deleted',
          `Lead "${deleted.name}" removed from pipeline`,
          req.user?.name || 'System Admin',
          'lead_activity'
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting lead',
      error: error.message,
    });
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};
