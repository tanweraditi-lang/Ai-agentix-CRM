const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Bot name is required'],
      trim: true,
    },
    website: {
      type: String,
      required: [true, 'Website URL is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    version: {
      type: String,
      trim: true,
      default: 'v1.0',
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Inactive'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Chatbot', chatbotSchema);
