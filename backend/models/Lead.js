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
