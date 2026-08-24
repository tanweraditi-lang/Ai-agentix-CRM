const mongoose = require('mongoose');

const connectDB = async () => {
  const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-agentix-crm';
  
  try {
    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] Unable to connect to MongoDB at ${connString}: ${error.message}`);
    console.warn('[Database Warning] Server will run with fallback mode until MongoDB is accessible.');
    return null;
  }
};

module.exports = connectDB;
