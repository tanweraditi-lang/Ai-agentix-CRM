const mongoose = require('mongoose');

const followupSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: [true, 'Associated lead ID is required'],
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    date: {
      type: Date,
      required: [true, 'Follow-up date is required'],
    },
    time: {
      type: String,
      required: [true, 'Follow-up time is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Completed', 'Cancelled'],
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
