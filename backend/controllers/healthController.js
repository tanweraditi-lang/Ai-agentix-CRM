const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Health Controller exposing dynamic Mongoose DB connection state
const getHealthStatus = (req, res) => {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbStateCode = mongoose.connection.readyState;
  const dbStatus = dbStates[dbStateCode] || 'unknown';

  // Trigger connectDB retry if currently disconnected and database URI exists
  if (dbStateCode === 0 && (process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL)) {
    connectDB();
  }

  res.status(200).json({
    status: 'ok',
    message: 'AI-Agentix-CRM Backend Service is operational',
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealthStatus
};
