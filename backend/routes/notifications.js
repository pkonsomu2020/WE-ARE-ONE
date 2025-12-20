const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateAdmin } = require('../middleware/auth');

// Apply admin authentication to all notification routes
router.use(authenticateAdmin);

// GET /api/notifications - Get all notifications
router.get('/', notificationController.getNotifications);

// GET /api/notifications/unread-count - Get unread notifications count
router.get('/unread-count', notificationController.getUnreadCount);

// POST /api/notifications - Create a new notification
router.post('/', notificationController.createNotification);

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// PUT /api/notifications/mark-all-read - Mark all notifications as read
router.put('/mark-all-read', notificationController.markAllAsRead);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', notificationController.deleteNotification);

// DELETE /api/notifications - Clear all notifications
router.delete('/', notificationController.clearAllNotifications);

// POST /api/notifications/clean-old - Clean old notifications
router.post('/clean-old', notificationController.cleanOldNotifications);

module.exports = router;