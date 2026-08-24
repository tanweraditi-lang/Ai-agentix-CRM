require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const healthRoutes = require('./routes/healthRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Connect to MongoDB Database
connectDB();

// CORS configuration supporting frontend origin
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes Mounting
app.use('/api/health', healthRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leads', leadRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running in [${NODE_ENV}] mode on port ${PORT}`);
});
