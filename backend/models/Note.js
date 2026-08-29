const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: [true, 'Associated lead ID is required'],
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
