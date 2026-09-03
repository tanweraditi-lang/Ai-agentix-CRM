const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Customer email is required'],
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
    servicePurchased: {
      type: String,
      required: [true, 'Service purchased is required'],
      trim: true,
    },
    package: {
      type: String,
      trim: true,
      default: 'Enterprise Suite',
    },
    revenue: {
      type: Number,
      default: 25000,
    },
    plan: {
      type: String,
      trim: true,
      default: 'Annual Enterprise',
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    owner: {
      type: String,
      trim: true,
      default: 'System Admin',
    },
    convertedFromLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Customer', customerSchema);
