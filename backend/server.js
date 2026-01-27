require('dotenv').config();
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const paydRoutes = require('./routes/payd');
const authRoutes = require('./routes/auth');
const paypalRoutes = require('./routes/paypal');
const moodRoutes = require('./routes/mood');
const journalRoutes = require('./routes/journal');
const settingsRoutes = require('./routes/settings');
const chatRoutes = require('./routes/chat');
const chatHistoryRoutes = require('./routes/chatHistory');
const eventsRoutes = require('./routes/events');
const eventSchedulerRoutes = require('./routes/eventScheduler');
const adminRoutes = require('./routes/admin');
const adminSettingsRoutes = require('./routes/adminSettings');
const realAnalyticsRoutes = require('./routes/realAnalytics');
const fileRepositoryRoutes = require('./routes/fileRepository');
// const fileRepositoryAdvancedRoutes = require('./routes/fileRepositoryAdvanced');
const feedbackRoutes = require('./routes/feedback');
const notificationRoutes = require('./routes/notifications');
const { testConnection } = require('./config/database');
const reminderService = require('./services/reminderService');
const warmupService = require('./services/warmupService');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Enhanced CORS configuration for admin panel
const allowedOrigins = [
  // Production domains
  'http://weareone.co.ke',
  'https://weareone.co.ke',
  'http://www.weareone.co.ke',
  'https://www.weareone.co.ke',
  'http://admin.weareone.co.ke',
  'https://admin.weareone.co.ke',
  // Vercel deployment URLs
  'https://weareone-frontend.vercel.app',
  'https://weareone-admin.vercel.app',
  'https://we-are-one-pkonsomu2020s-projects.vercel.app',
  'https://we-are-one-git-main-pkonsomu2020s-projects.vercel.app',
  // Development localhost
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8083',
  'http://localhost:8090',
  'http://127.0.0.1:8083',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5174',
  'http://localhost:8082',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🔍 CORS check for origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ CORS: No origin - allowing');
      return callback(null, true);
    }

    // Allow all localhost origins for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      console.log('✅ CORS: Localhost origin - allowing');
      return callback(null, true);
    }

    // Allow all weareone.co.ke subdomains (including admin.weareone.co.ke)
    if (origin.includes('weareone.co.ke')) {
      console.log('✅ CORS: weareone.co.ke domain - allowing');
      return callback(null, true);
    }

    // Allow all Vercel app domains
    if (origin.includes('vercel.app')) {
      console.log('✅ CORS: Vercel domain - allowing');
      return callback(null, true);
    }

    // Check against allowed origins for production
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS: Found in allowed origins - allowing');
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin not allowed:', origin);
      console.log('📋 Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Origin',
    'X-Requested-With',
    'Accept',
    'x-admin-key',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// ✅ Apply CORS before anything else
app.use(cors(corsOptions));

// ✅ Additional CORS middleware specifically for admin routes
app.use('/api/admin', (req, res, next) => {
  const origin = req.headers.origin;

  // TEMPORARY: Allow all origins for admin routes (for debugging)
  // TODO: Restrict this in production
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Origin,X-Requested-With,Accept,x-admin-key,Cache-Control,Pragma');

  next();
});

// ✅ Handle preflight requests explicitly
app.options('*', (req, res) => {
  const origin = req.headers.origin;

  // Check if origin is allowed
  const isAllowed = !origin ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    allowedOrigins.includes(origin);

  if (isAllowed) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Origin,X-Requested-With,Accept,x-admin-key,Cache-Control,Pragma');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Body parsing (still before routes)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Security middleware (configured to allow CORS)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://admin.weareone.co.ke", "https://weareone.co.ke"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// ✅ Rate limiting middleware
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));

// ✅ Test database connection
testConnection();

// ✅ Health check route with warmup trigger
app.get('/api/health', (req, res) => {
  // Record activity for warmup service
  warmupService.recordActivity();
  
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    timeSinceLastActivity: warmupService.getTimeSinceLastActivity()
  });
});

// ✅ Warmup endpoint for external monitoring
app.get('/api/warmup', async (req, res) => {
  try {
    await warmupService.performWarmup();
    res.status(200).json({
      status: 'Warmup completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'Warmup failed',
      error: error.message
    });
  }
});

// ✅ API routes
app.use('/api/payd', paydRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat-history', chatHistoryRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/event-scheduler', eventSchedulerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin-settings', adminSettingsRoutes);
app.use('/api/real-analytics', realAnalyticsRoutes);
app.use('/api/file-repository', fileRepositoryRoutes);
// app.use('/api/file-repository-advanced', fileRepositoryAdvancedRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);

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
  console.log(`Payd Mode: ${process.env.PAYD_MODE}`);

  // Start the warmup service for better performance
  warmupService.start();

  // Start the reminder service for automatic notifications
  if (process.env.NODE_ENV === 'production') {
    // Check if email configuration is available
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // TEMPORARILY DISABLED FOR PERFORMANCE TESTING
      // reminderService.start();
      console.log('⚠️ Reminder service temporarily disabled for performance testing');
    } else {
      console.log('⚠️ Reminder service disabled - Email configuration missing');
      console.log('💡 Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS to enable reminders');
    }
  } else {
    console.log('⚠️ Reminder service disabled in development mode');
  }
});
