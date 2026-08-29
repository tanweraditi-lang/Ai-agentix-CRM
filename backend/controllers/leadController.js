const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const Followup = require('../models/Followup');

// Seed in-memory leads array for graceful fallback when DB is offline
const inMemoryLeads = [
  { id: '1', _id: '1', name: 'Rohan Gupta', email: 'rohan.gupta@apextech.in', phone: '+91 98765 43210', company: 'Apex Tech Solutions (Bengaluru)', serviceInterested: 'CRM System Integration', status: 'New', score: 85, assignedUser: { name: 'Priya Patel', email: 'priya.patel@minicrm.in', role: 'sales_rep' }, createdAt: new Date() },
  { id: '2', _id: '2', name: 'Ananya Iyer', email: 'ananya.iyer@brightmedia.in', phone: '+91 98123 45678', company: 'Bright Media Works (Mumbai)', serviceInterested: 'AI Lead Scoring Engine', status: 'Contacted', score: 92, assignedUser: { name: 'Priya Patel', email: 'priya.patel@minicrm.in', role: 'sales_rep' }, createdAt: new Date() },
  { id: '3', _id: '3', name: 'Vikram Malhotra', email: 'vmalhotra@cloudnet.co.in', phone: '+91 97111 22334', company: 'CloudNet Systems (Gurugram)', serviceInterested: 'Enterprise Automation', status: 'Qualified', score: 78, assignedUser: { name: 'Amit Verma', email: 'amit.verma@minicrm.in', role: 'sales_rep' }, createdAt: new Date() },
];

// @desc    Get all leads (with search & status filter)
// @route   GET /api/leads
// @access  Public
const getLeads = async (req, res) => {
  try {
    const { status, search, assignedUser } = req.query;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let query = {};

      if (status && status !== 'All' && status !== 'all') {
        query.status = new RegExp(`^${status.trim()}$`, 'i');
      }

      if (assignedUser) {
        query.assignedUser = assignedUser;
      }

      if (search && search.trim() !== '') {
        const cleanSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(cleanSearch, 'i');
        query.$or = [
          { name: searchRegex },
          { company: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
          { serviceInterested: searchRegex },
        ];
      }

      const leads = await Lead.find(query)
        .populate('assignedUser', 'name email role')
        .sort({ createdAt: -1 });

      const mappedLeads = leads.map(l => ({
        ...l.toObject(),
        id: l._id.toString(),
        score: l.score || 85,
      }));

      return res.status(200).json({
        success: true,
        count: mappedLeads.length,
        leads: mappedLeads,
      });
    } else {
      let result = [...inMemoryLeads];

      if (status && status !== 'All' && status !== 'all') {
        result = result.filter(l => l.status.toLowerCase() === status.toLowerCase());
      }

      if (search && search.trim() !== '') {
        const s = search.trim().toLowerCase();
        result = result.filter(
          l =>
            (l.name && l.name.toLowerCase().includes(s)) ||
            (l.company && l.company.toLowerCase().includes(s)) ||
            (l.email && l.email.toLowerCase().includes(s)) ||
            (l.phone && l.phone.toLowerCase().includes(s)) ||
            (l.serviceInterested && l.serviceInterested.toLowerCase().includes(s))
        );
      }

      return res.status(200).json({
        success: true,
        count: result.length,
        leads: result,
      });
    }
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching leads',
      error: error.message,
    });
  }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// @access  Public
const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const lead = await Lead.findById(id).populate('assignedUser', 'name email role');
      if (!lead) {
        return res.status(404).json({
          success: false,
          message: 'Lead not found',
        });
      }

      const followups = await Followup.find({ leadId: id }).sort({ date: -1 });

      return res.status(200).json({
        success: true,
        lead: { ...lead.toObject(), id: lead._id.toString(), score: lead.score || 85 },
        followups,
      });
    } else {
      const lead = inMemoryLeads.find(l => l.id === id || l._id === id) || inMemoryLeads[0];
      return res.status(200).json({
        success: true,
        lead,
        followups: [
          { id: 'f101', notes: 'Initial discovery call completed', date: '2026-08-20', status: 'Completed' },
        ],
      });
    }
  } catch (error) {
    console.error('Error fetching lead details:', error);
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
    const { name, email, phone, company, serviceInterested, status, assignedUser } = req.body;

    if (!name || !email || !serviceInterested) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and service interested',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const leadStatus = status || 'New';
    const isDbConnected = mongoose.connection.readyState === 1;

    let newLead;

    if (isDbConnected) {
      newLead = await Lead.create({
        name,
        email: cleanEmail,
        phone,
        company,
        serviceInterested,
        status: leadStatus,
        assignedUser: mongoose.Types.ObjectId.isValid(assignedUser) ? assignedUser : null,
      });

      if (newLead.assignedUser) {
        newLead = await newLead.populate('assignedUser', 'name email role');
      }

      newLead = { ...newLead.toObject(), id: newLead._id.toString(), score: 85 };
    } else {
      newLead = {
        id: 'ld_' + Date.now(),
        _id: 'ld_' + Date.now(),
        name,
        email: cleanEmail,
        phone: phone || '',
        company: company || 'N/A',
        serviceInterested,
        status: leadStatus,
        score: 85,
        createdAt: new Date(),
      };
      inMemoryLeads.unshift(newLead);
    }

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
    const { name, email, phone, company, serviceInterested, status, assignedUser } = req.body;

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email.toLowerCase().trim();
      if (phone !== undefined) updateData.phone = phone;
      if (company !== undefined) updateData.company = company;
      if (serviceInterested) updateData.serviceInterested = serviceInterested;
      if (status) updateData.status = status;
      if (assignedUser !== undefined) {
        updateData.assignedUser = mongoose.Types.ObjectId.isValid(assignedUser) ? assignedUser : null;
      }

      const updatedLead = await Lead.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .populate('assignedUser', 'name email role');

      if (!updatedLead) {
        return res.status(404).json({
          success: false,
          message: 'Lead not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Lead updated successfully',
        lead: { ...updatedLead.toObject(), id: updatedLead._id.toString() },
      });
    } else {
      const leadIndex = inMemoryLeads.findIndex(l => l.id === id || l._id === id);
      if (leadIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Lead not found',
        });
      }

      if (name) inMemoryLeads[leadIndex].name = name;
      if (email) inMemoryLeads[leadIndex].email = email;
      if (phone !== undefined) inMemoryLeads[leadIndex].phone = phone;
      if (company !== undefined) inMemoryLeads[leadIndex].company = company;
      if (serviceInterested) inMemoryLeads[leadIndex].serviceInterested = serviceInterested;
      if (status) inMemoryLeads[leadIndex].status = status;

      return res.status(200).json({
        success: true,
        message: 'Lead updated successfully',
        lead: inMemoryLeads[leadIndex],
      });
    }
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
      const lead = await Lead.findByIdAndDelete(id);
      if (!lead) {
        return res.status(404).json({
          success: false,
          message: 'Lead not found',
        });
      }
    } else {
      const leadIndex = inMemoryLeads.findIndex(l => l.id === id || l._id === id);
      if (leadIndex !== -1) {
        inMemoryLeads.splice(leadIndex, 1);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Lead removed successfully',
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
