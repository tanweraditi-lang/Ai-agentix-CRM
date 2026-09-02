const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
    },
    visitorEmail: {
      type: String,
      required: [true, 'Visitor email is required'],
      trim: true,
      lowercase: true,
    },
    question: {
      type: String,
      required: [true, 'Visitor question is required'],
      trim: true,
    },
    botResponse: {
      type: String,
      required: [true, 'Bot response is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Resolved', 'Escalated', 'Pending'],
        message: '{VALUE} is not a valid conversation status',
      },
      default: 'Pending',
    },
    assignedAgent: {
      type: String,
      trim: true,
      default: 'AI Bot Agent',
    },
    chatbotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chatbot',
      default: null,
    },
    conversationTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Conversation', conversationSchema);
