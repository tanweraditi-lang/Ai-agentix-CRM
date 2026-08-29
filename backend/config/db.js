const mongoose = require('mongoose');

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1 || isConnecting) {
    return mongoose.connection;
  }

  const connString =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL ||
    'mongodb://127.0.0.1:27017/ai-agentix-crm';

  isConnecting = true;

  try {
    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    isConnecting = false;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isConnecting = false;
    const sanitizedUri = connString.replace(/:([^@]+)@/, ':****@');
    console.warn(`[Database Warning] Unable to connect to MongoDB at ${sanitizedUri}: ${error.message}`);
    console.warn('[Database Warning] Retrying connection in 5 seconds...');

    // Automatically retry connection in background
    setTimeout(connectDB, 5000);
    return null;
  }
};

// Global Mongoose Connection Listeners
mongoose.connection.on('disconnected', () => {
  console.warn('[Database Event] MongoDB disconnected. Attempting reconnection...');
  setTimeout(connectDB, 5000);
});

mongoose.connection.on('error', (err) => {
  console.error('[Database Event] MongoDB connection error:', err.message);
});

module.exports = connectDB;
