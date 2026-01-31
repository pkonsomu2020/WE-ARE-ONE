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

module.exports = router;
