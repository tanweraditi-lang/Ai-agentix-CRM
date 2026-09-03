const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    note: {
      type: String,
      required: [true, 'Note text is required'],
      trim: true,
    },
    createdBy: {
      type: String,
      default: 'System Admin',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Note', noteSchema);
