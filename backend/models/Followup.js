const mongoose = require('mongoose');

const followupSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    clientName: {
      type: String,
      trim: true,
      default: 'General Client',
    },
    customerName: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    followupType: {
      type: String,
      trim: true,
      default: 'Call',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: false,
      default: null,
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    time: {
      type: String,
      default: '10:00 AM',
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Upcoming', 'Completed', 'Cancelled', 'Overdue'],
        message: '{VALUE} is not a valid follow-up status',
      },
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Followup', followupSchema);
