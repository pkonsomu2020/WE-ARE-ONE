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
  clearAllData
} = require('../controllers/adminSettingsController');
const { authenticateAdmin } = require('../middleware/auth');

// Apply admin authentication to all routes
router.use(authenticateAdmin);

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

// Data Management Routes
router.post('/data/export', exportData);
router.post('/data/backup', createBackup);
router.get('/data/storage', getStorageInfo);

// Danger Zone Routes
router.post('/data/clear-all', clearAllData);

// Health check for admin settings service
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

// Stats endpoint for settings page
router.get('/stats', async (req, res) => {
  try {
    // Get basic system statistics
    const { supabase } = require('../config/database');
    
    // Get user count
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    // Get orders count (from event_payments and event_registrations)
    const { count: paidOrders, error: paidError } = await supabase
      .from('event_payments')
      .select('*', { count: 'exact', head: true });
    
    const { count: freeOrders, error: freeError } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true });
    
    // Get admin count
    const { count: totalAdmins, error: adminsError } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true });
    
    const totalOrders = (paidOrders || 0) + (freeOrders || 0);
    
    res.json({
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        totalOrders: totalOrders,
        totalAdmins: totalAdmins || 0,
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching admin settings stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Test notification endpoint
router.post('/notifications/test', async (req, res) => {
  try {
    const { type, recipient } = req.body;
    
    // Send test notification using Resend
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Email service not configured'
      });
    }
    
    const { data, error } = await resend.emails.send({
      from: 'We Are One Admin <admin@weareone.co.ke>',
      to: [recipient],
      subject: 'Test Notification - WAO Admin Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c;">Test Notification</h2>
          <p>This is a test notification from the We Are One Admin Portal.</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Sent to:</strong> ${recipient}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This is an automated test message from the WAO Admin Portal.
          </p>
        </div>
      `
    });
    
    if (error) {
      console.error('Test notification error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send test notification',
        error: error.message
      });
    }
    
    res.json({
      success: true,
      message: 'Test notification sent successfully',
      data: { id: data?.id }
    });
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
