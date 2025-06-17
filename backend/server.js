require('dotenv').config();
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const paypalRoutes = require('./routes/paypal');
const authRoutes = require('./routes/auth');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Centralized CORS options (first!)
const allowedOrigins = [
  'http://weareone.co.ke',
  'https://weareone.co.ke',
  'http://www.weareone.co.ke',
  'https://www.weareone.co.ke',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Origin',
    'X-Requested-With',
    'Accept'
  ]
};

// ✅ Apply CORS before anything else
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight for all routes

// ✅ Body parsing (still before routes)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Security middleware
app.use(helmet());

// ✅ Rate limiting middleware
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));

// ✅ Test database connection
testConnection();

// ✅ Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ✅ API routes
app.use('/api/paypal', paypalRoutes);
app.use('/api/auth', authRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// ✅ 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`PayPal Mode: ${process.env.PAYPAL_MODE}`);
});
