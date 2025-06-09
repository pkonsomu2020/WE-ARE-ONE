const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const paypalRoutes = require('./routes/paypal');
require('dotenv').config();
const paypal = require('paypal-rest-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Define allowed origins at the top
const allowedOrigins = ['http://localhost:8080', 'http://localhost:5173'];

// ✅ Security middleware
app.use(helmet());

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// ✅ CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or matching ones
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ✅ Routes
app.use('/api/paypal', paypalRoutes);

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

// ✅ 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

console.log('PayPal Mode:', process.env.PAYPAL_MODE);
console.log('Client ID:', process.env.PAYPAL_CLIENT_ID ? '✅ Loaded' : '❌ Missing');
console.log('Client Secret:', process.env.PAYPAL_CLIENT_SECRET ? '✅ Loaded' : '❌ Missing');

paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`PayPal Mode: ${process.env.PAYPAL_MODE}`);
});
