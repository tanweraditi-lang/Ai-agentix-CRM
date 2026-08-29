require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Connect to Database
connectDB();

// CORS configuration supporting frontend origin (including localhost:3001, 3000, 5173)
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (NODE_ENV === 'development' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leads', leadRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running in [${NODE_ENV}] mode on port ${PORT}`);
});
