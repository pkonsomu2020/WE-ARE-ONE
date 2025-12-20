const { pool } = require('../config/database');

class NotificationService {
  // Create a new notification
  async createNotification({ title, message, type = 'info', source = 'system', actionUrl = null }) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO notifications (title, message, type, source, action_url) 
         VALUES (?, ?, ?, ?, ?)`,
        [title, message, type, source, actionUrl]
      );

      console.log(`📢 Notification created: ${title}`);
      return {
        success: true,
        notificationId: result.insertId,
        data: {
          id: result.insertId,
          title,
          message,
          type,
          source,
          actionUrl,
          isRead: false,
          createdAt: new Date()
        }
      };
    } catch (error) {
      console.error('❌ Failed to create notification:', error);
      return {
        success: false,
        message: 'Failed to create notification',
        error: error.message
      };
    }
  }

  // Get all notifications (with pagination)
  async getNotifications(limit = 50, offset = 0) {
    try {
      const [notifications] = await pool.execute(
        `SELECT id, title, message, type, source, action_url as actionUrl, 
                is_read as isRead, created_at as createdAt, updated_at as updatedAt
         FROM notifications 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      // Get total count
      const [countResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM notifications'
      );
      const total = countResult[0].total;

      // Get unread count
      const [unreadResult] = await pool.execute(
        'SELECT COUNT(*) as unread FROM notifications WHERE is_read = FALSE'
      );
      const unreadCount = unreadResult[0].unread;

      return {
        success: true,
        data: {
          notifications: notifications.map(notification => ({
            ...notification,
            isRead: Boolean(notification.isRead),
            timestamp: new Date(notification.createdAt)
          })),
          total,
          unreadCount,
          hasMore: (offset + limit) < total
        }
      };
    } catch (error) {
      console.error('❌ Failed to get notifications:', error);
      return {
        success: false,
        message: 'Failed to get notifications',
        error: error.message
      };
    }
  }

  // Get unread notifications count
  async getUnreadCount() {
    try {
      const [result] = await pool.execute(
        'SELECT COUNT(*) as count FROM notifications WHERE is_read = FALSE'
      );

      return {
        success: true,
        count: result[0].count
      };
    } catch (error) {
      console.error('❌ Failed to get unread count:', error);
      return {
        success: false,
        message: 'Failed to get unread count',
        error: error.message
      };
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const [result] = await pool.execute(
        'UPDATE notifications SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [notificationId]
      );

      if (result.affectedRows === 0) {
        return {
          success: false,
          message: 'Notification not found'
        };
      }

      return {
        success: true,
        message: 'Notification marked as read'
      };
    } catch (error) {
      console.error('❌ Failed to mark notification as read:', error);
      return {
        success: false,
        message: 'Failed to mark notification as read',
        error: error.message
      };
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const [result] = await pool.execute(
        'UPDATE notifications SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP WHERE is_read = FALSE'
      );

      return {
        success: true,
        message: `Marked ${result.affectedRows} notifications as read`
      };
    } catch (error) {
      console.error('❌ Failed to mark all notifications as read:', error);
      return {
        success: false,
        message: 'Failed to mark all notifications as read',
        error: error.message
      };
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM notifications WHERE id = ?',
        [notificationId]
      );

      if (result.affectedRows === 0) {
        return {
          success: false,
          message: 'Notification not found'
        };
      }

      return {
        success: true,
        message: 'Notification deleted'
      };
    } catch (error) {
      console.error('❌ Failed to delete notification:', error);
      return {
        success: false,
        message: 'Failed to delete notification',
        error: error.message
      };
    }
  }

  // Clear all notifications
  async clearAllNotifications() {
    try {
      const [result] = await pool.execute('DELETE FROM notifications');

      return {
        success: true,
        message: `Cleared ${result.affectedRows} notifications`
      };
    } catch (error) {
      console.error('❌ Failed to clear all notifications:', error);
      return {
        success: false,
        message: 'Failed to clear all notifications',
        error: error.message
      };
    }
  }

  // Clean old notifications (older than 30 days)
  async cleanOldNotifications(daysOld = 30) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
        [daysOld]
      );

      console.log(`🧹 Cleaned ${result.affectedRows} old notifications (older than ${daysOld} days)`);
      return {
        success: true,
        message: `Cleaned ${result.affectedRows} old notifications`,
        deletedCount: result.affectedRows
      };
    } catch (error) {
      console.error('❌ Failed to clean old notifications:', error);
      return {
        success: false,
        message: 'Failed to clean old notifications',
        error: error.message
      };
    }
  }

  // Helper method to create event notifications
  async createEventNotification(eventTitle, eventDate, eventTime) {
    return this.createNotification({
      title: 'Event Scheduled',
      message: `"${eventTitle}" scheduled for ${new Date(eventDate).toLocaleDateString()} at ${eventTime}`,
      type: 'success',
      source: 'event',
      actionUrl: '/admin/events'
    });
  }

  // Helper method to create feedback notifications
  async createFeedbackNotification(feedbackType, subject) {
    return this.createNotification({
      title: 'Feedback Submitted',
      message: `New ${feedbackType}: "${subject}" has been submitted`,
      type: 'success',
      source: 'feedback',
      actionUrl: '/admin/feedback'
    });
  }

  // Helper method to create file upload notifications
  async createFileUploadNotification(fileName, fileCount = 1) {
    const displayName = fileCount === 1 ? fileName : `${fileCount} files`;
    return this.createNotification({
      title: 'File Upload Complete',
      message: `Successfully uploaded ${displayName} to repository`,
      type: 'success',
      source: 'file',
      actionUrl: '/admin/files'
    });
  }

  // Helper method to create settings notifications
  async createSettingsNotification(settingType, message) {
    return this.createNotification({
      title: `${settingType} Updated`,
      message,
      type: 'success',
      source: 'settings',
      actionUrl: '/admin/settings'
    });
  }
}

module.exports = new NotificationService();