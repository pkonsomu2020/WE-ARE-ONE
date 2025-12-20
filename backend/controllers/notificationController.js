const notificationService = require('../services/notificationService');

class NotificationController {
  // GET /api/notifications - Get all notifications
  async getNotifications(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const result = await notificationService.getNotifications(limit, offset);

      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('❌ Error in getNotifications:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // GET /api/notifications/unread-count - Get unread notifications count
  async getUnreadCount(req, res) {
    try {
      const result = await notificationService.getUnreadCount();

      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('❌ Error in getUnreadCount:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // POST /api/notifications - Create a new notification
  async createNotification(req, res) {
    try {
      const { title, message, type, source, actionUrl } = req.body;

      if (!title || !message) {
        return res.status(400).json({
          success: false,
          message: 'Title and message are required'
        });
      }

      const result = await notificationService.createNotification({
        title,
        message,
        type,
        source,
        actionUrl
      });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('❌ Error in createNotification:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // PUT /api/notifications/:id/read - Mark notification as read
  async markAsRead(req, res) {
    try {
      const notificationId = parseInt(req.params.id);

      if (!notificationId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification ID'
        });
      }

      const result = await notificationService.markAsRead(notificationId);

      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('❌ Error in markAsRead:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // PUT /api/notifications/mark-all-read - Mark all notifications as read
  async markAllAsRead(req, res) {
    try {
      const result = await notificationService.markAllAsRead();

      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('❌ Error in markAllAsRead:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // DELETE /api/notifications/:id - Delete notification
  async deleteNotification(req, res) {
    try {
      const notificationId = parseInt(req.params.id);

      if (!notificationId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification ID'
        });
      }

      const result = await notificationService.deleteNotification(notificationId);

      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('❌ Error in deleteNotification:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // DELETE /api/notifications - Clear all notifications
  async clearAllNotifications(req, res) {
    try {
      const result = await notificationService.clearAllNotifications();

      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('❌ Error in clearAllNotifications:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // POST /api/notifications/clean-old - Clean old notifications
  async cleanOldNotifications(req, res) {
    try {
      const daysOld = parseInt(req.body.daysOld) || 30;

      const result = await notificationService.cleanOldNotifications(daysOld);

      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('❌ Error in cleanOldNotifications:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new NotificationController();