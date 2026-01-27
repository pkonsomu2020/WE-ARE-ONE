const { supabase, supabaseAdmin } = require('../config/database');

// Ensure notifications table exists
(async function ensureNotificationsTable() {
  try {
    console.log('🔧 Ensuring notifications table exists...');
    
    // Check if notifications table exists
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('📝 Notifications table does not exist. Please create it in Supabase dashboard:');
      console.log(`
        CREATE TABLE notifications (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          type VARCHAR(50) DEFAULT 'info',
          source VARCHAR(50) DEFAULT 'system',
          action_url VARCHAR(500),
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX idx_notifications_is_read ON notifications(is_read);
        CREATE INDEX idx_notifications_created_at ON notifications(created_at);
        CREATE INDEX idx_notifications_source ON notifications(source);
      `);
    } else if (!error) {
      console.log('✅ Notifications table exists');
    }
  } catch (error) {
    console.error('⚠️ Failed to check notifications table:', error.message);
  }
})();

class NotificationService {
  // Create a new notification
  async createNotification({ title, message, type = 'info', source = 'system', actionUrl = null }) {
    try {
      // First, try to reset the sequence if there's a conflict
      let insertAttempts = 0;
      const maxAttempts = 3;
      
      while (insertAttempts < maxAttempts) {
        try {
          const { data, error } = await supabase
            .from('notifications')
            .insert({
              title,
              message,
              type,
              source,
              action_url: actionUrl
            })
            .select()
            .single();

          if (error) {
            // Check if it's a duplicate key error
            if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
              console.log(`⚠️ Duplicate key error on attempt ${insertAttempts + 1}, trying to reset sequence...`);
              
              // Try to reset the sequence
              await this.resetNotificationsSequence();
              insertAttempts++;
              continue;
            } else {
              throw error;
            }
          }

          console.log(`📢 Notification created: ${title}`);
          return {
            success: true,
            notificationId: data.id,
            data: {
              id: data.id,
              title,
              message,
              type,
              source,
              actionUrl,
              isRead: false,
              createdAt: data.created_at
            }
          };
        } catch (attemptError) {
          if (insertAttempts === maxAttempts - 1) {
            throw attemptError;
          }
          insertAttempts++;
        }
      }
    } catch (error) {
      console.error('❌ Failed to create notification:', error);
      return {
        success: false,
        message: 'Failed to create notification',
        error: error.message
      };
    }
  }

  // Reset notifications sequence to prevent duplicate key errors
  async resetNotificationsSequence() {
    try {
      // Get the current maximum ID
      const { data: maxResult, error: maxError } = await supabase
        .from('notifications')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      if (maxError) {
        console.error('Error getting max notification ID:', maxError);
        return;
      }

      const maxId = maxResult && maxResult.length > 0 ? maxResult[0].id : 0;
      const nextId = maxId + 1;

      // Reset the sequence using SQL
      const { error: resetError } = await supabase.rpc('reset_notifications_sequence', {
        new_value: nextId
      });

      if (resetError) {
        console.error('Error resetting notifications sequence:', resetError);
        // If the function doesn't exist, try to create it
        const createFunctionSQL = `
          CREATE OR REPLACE FUNCTION reset_notifications_sequence(new_value INTEGER)
          RETURNS VOID AS $$
          BEGIN
            PERFORM setval('notifications_id_seq', new_value, false);
          END;
          $$ LANGUAGE plpgsql;
        `;
        
        const { error: createError } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });
        if (!createError) {
          // Try again after creating the function
          await supabase.rpc('reset_notifications_sequence', { new_value: nextId });
        }
      } else {
        console.log(`✅ Notifications sequence reset to ${nextId}`);
      }
    } catch (error) {
      console.error('Error in resetNotificationsSequence:', error);
    }
  }

  // Get all notifications (with pagination)
  async getNotifications(limit = 50, offset = 0) {
    try {
      // Get notifications with pagination
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      // Get total count
      const { count: total, error: countError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        throw countError;
      }

      // Get unread count
      const { count: unreadCount, error: unreadError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      if (unreadError) {
        throw unreadError;
      }

      return {
        success: true,
        data: {
          notifications: (notifications || []).map(notification => ({
            ...notification,
            actionUrl: notification.action_url,
            isRead: Boolean(notification.is_read),
            timestamp: notification.created_at ? new Date(notification.created_at) : null
          })),
          total: total || 0,
          unreadCount: unreadCount || 0,
          hasMore: (offset + limit) < (total || 0)
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
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      if (error) {
        throw error;
      }

      return {
        success: true,
        count: count || 0
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
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .select();

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
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
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          updated_at: new Date().toISOString()
        })
        .eq('is_read', false)
        .select();

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: `Marked ${data ? data.length : 0} notifications as read`
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
      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .select();

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
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
      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .neq('id', 0) // Delete all records
        .select();

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: `Cleared ${data ? data.length : 0} notifications`
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

  // Clean old notifications (older than specified days)
  async cleanOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .select();

      if (error) {
        throw error;
      }

      const deletedCount = data ? data.length : 0;
      console.log(`🧹 Cleaned ${deletedCount} old notifications (older than ${daysOld} days)`);
      
      return {
        success: true,
        message: `Cleaned ${deletedCount} old notifications`,
        deletedCount
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