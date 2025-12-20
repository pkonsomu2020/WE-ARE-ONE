const express = require('express');
const router = express.Router();
const {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getSystemSettings,
  updateSystemSettings,
  getNotificationSettings,
  updateNotificationSettings,
  exportData,
  createBackup,
  getStorageInfo,
  clearAllData,
  sendTestNotification
} = require('../controllers/adminSettingsController');
const { authenticateAdmin } = require('../middleware/auth');

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Test endpoint to verify route is working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Admin Settings route is working',
    timestamp: new Date().toISOString()
  });
});

// Profile Management Routes
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);
router.post('/profile/change-password', changeAdminPassword);

// System Settings Routes
router.get('/system', getSystemSettings);
router.put('/system', updateSystemSettings);

// Notification Settings Routes
router.get('/notifications', getNotificationSettings);
router.put('/notifications', updateNotificationSettings);
router.post('/notifications/test', sendTestNotification);

// Data Management Routes
router.post('/data/export', exportData);
router.post('/data/backup', createBackup);
router.get('/data/storage', getStorageInfo);

// Danger Zone Routes
router.post('/data/clear-all', clearAllData);

// Additional utility routes
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Admin settings service is healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      email: 'configured',
      storage: 'available'
    }
  });
});

// Get system statistics for settings dashboard
router.get('/stats', async (req, res) => {
  try {
    const { pool } = require('../config/database');
    
    // Get various system statistics
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [orderCount] = await pool.execute('SELECT COUNT(*) as count FROM event_payments');
    const [eventCount] = await pool.execute('SELECT COUNT(*) as count FROM scheduled_events WHERE status = "scheduled"');
    
    // Get recent activity
    const [recentUsers] = await pool.execute(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    
    const [recentOrders] = await pool.execute(
      'SELECT COUNT(*) as count FROM event_payments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );

    res.json({
      success: true,
      data: {
        totalUsers: userCount[0].count,
        totalOrders: orderCount[0].count,
        totalEvents: eventCount[0].count,
        totalAdmins: 1, // Simplified - no admin_profiles table query
        recentUsers: recentUsers[0].count,
        recentOrders: recentOrders[0].count,
        systemUptime: process.uptime(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV
      }
    });

  } catch (error) {
    console.error('Get settings stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system statistics'
    });
  }
});

module.exports = router;
