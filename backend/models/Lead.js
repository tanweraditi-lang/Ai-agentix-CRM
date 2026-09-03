const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
      default: 'Technology',
    },
    city: {
      type: String,
      trim: true,
      default: 'Mumbai',
    },
    country: {
      type: String,
      trim: true,
      default: 'India',
    },
    leadSource: {
      type: String,
      trim: true,
      default: 'Website Form',
    },
    serviceInterested: {
      type: String,
      required: [true, 'Service interested is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Qualified', 'In Negotiation', 'Converted', 'Lost'],
        message: '{VALUE} is not a valid lead status',
      },
      default: 'New',
    },
    score: {
      type: Number,
      default: 85,
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', leadSchema);
