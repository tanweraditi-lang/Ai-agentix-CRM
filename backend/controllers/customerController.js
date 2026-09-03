const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Customer = require('../models/Customer');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Public / Private
const getCustomers = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        if (customers && customers.length > 0) {
          const mappedCustomers = customers.map(c => {
            const obj = c.toObject ? c.toObject() : c;
            return {
              ...obj,
              id: (c._id || c.id).toString(),
            };
          });

          return res.status(200).json({
            success: true,
            count: mappedCustomers.length,
            customers: mappedCustomers,
            data: mappedCustomers,
          });
        }
      } catch (dbErr) {
        console.warn('MongoDB query warning in getCustomers:', dbErr.message);
      }
    }

    // Fallback when MongoDB is disconnected: Load from backend/seeds/customers.json
    let seedCustomers = [];
    try {
      const seedPath = path.join(__dirname, '../seeds/customers.json');
      if (fs.existsSync(seedPath)) {
        const raw = fs.readFileSync(seedPath, 'utf8');
        seedCustomers = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading backend/seeds/customers.json:', err);
    }

    const mappedSeedCustomers = seedCustomers.map((c, idx) => ({
      id: c._id || c.id || `customer_${idx + 1}`,
      _id: c._id || c.id || `customer_${idx + 1}`,
      name: c.name || '',
      email: c.email || '',
      phone: c.phone || '',
      company: c.company || '',
      servicePurchased: c.servicePurchased || c.purchasedService || 'CRM Development',
      customerStatus: c.customerStatus || 'Active',
      joinedDate: c.joinedDate || new Date().toISOString(),
    }));

    return res.status(200).json({
      success: true,
      count: mappedSeedCustomers.length,
      customers: mappedSeedCustomers,
      data: mappedSeedCustomers,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching customers',
      error: error.message,
    });
  }
};

module.exports = {
  getCustomers,
};
