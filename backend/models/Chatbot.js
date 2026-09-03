const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Bot name is required'],
      trim: true,
    },
    clientName: {
      type: String,
      trim: true,
      default: 'Apex Tech Solutions',
    },
    website: {
      type: String,
      required: [true, 'Website URL is required'],
      trim: true,
    },
    aiModel: {
      type: String,
      trim: true,
      default: 'Gemini 1.5 Pro',
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
    platform: {
      type: String,
      trim: true,
      enum: ['Website', 'WhatsApp', 'Facebook', 'Instagram'],
      default: 'Website',
    },
    totalConversations: {
      type: Number,
      default: 0,
    },
    todaysConversations: {
      type: Number,
      default: 0,
    },
    resolutionRate: {
      type: String,
      default: '94.5%',
    },
    avgResponseTime: {
      type: String,
      default: '1.2s',
    },
    successRate: {
      type: String,
      default: '96.0%',
    },
    escalations: {
      type: Number,
      default: 12,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Chatbot', chatbotSchema);
