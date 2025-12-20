const { pool } = require('../config/database');

/**
 * Activity Log Service
 * Handles logging and retrieval of admin activity
 */
class ActivityLogService {
  /**
   * Log an admin activity
   * @param {Object} activityData - Activity information
   * @param {number} activityData.adminProfileId - Admin profile ID
   * @param {string} activityData.action - Action type (e.g., 'document_upload', 'feedback_response')
   * @param {string} activityData.description - Human-readable description
   * @param {string} activityData.ipAddress - IP address of the admin
   * @param {string} activityData.userAgent - Browser user agent
   * @returns {Promise<number>} - Inserted activity log ID
   */
  async logActivity(activityData) {
    try {
      const {
        adminProfileId,
        action,
        description,
        ipAddress,
        userAgent
      } = activityData;

      const [result] = await pool.execute(
        `INSERT INTO admin_activity_log 
         (admin_profile_id, action, description, ip_address, user_agent, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [adminProfileId, action, description, ipAddress, userAgent]
      );

      return result.insertId;
    } catch (error) {
      console.error('❌ Activity log insert failed:', error.message);
      throw error;
    }
  }

  /**
   * Get activity logs with filtering
   * @param {Object} filters - Filter options
   * @param {number} filters.adminProfileId - Filter by admin profile ID
   * @param {string} filters.action - Filter by action type
   * @param {string} filters.startDate - Start date for date range
   * @param {string} filters.endDate - End date for date range
   * @param {number} filters.limit - Maximum number of results
   * @param {number} filters.offset - Offset for pagination
   * @returns {Promise<Array>} - Array of activity logs
   */
  async getActivityLog(filters = {}) {
    try {
      const {
        adminProfileId,
        action,
        startDate,
        endDate,
        limit = 100,
        offset = 0
      } = filters;

      let query = `
        SELECT 
          aal.*,
          ap.full_name,
          ap.email,
          ap.role
        FROM admin_activity_log aal
        LEFT JOIN admin_profiles ap ON aal.admin_profile_id = ap.id
        WHERE 1=1
      `;

      const params = [];

      if (adminProfileId) {
        query += ' AND aal.admin_profile_id = ?';
        params.push(adminProfileId);
      }

      if (action) {
        query += ' AND aal.action = ?';
        params.push(action);
      }

      if (startDate) {
        query += ' AND aal.created_at >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND aal.created_at <= ?';
        params.push(endDate);
      }

      query += ' ORDER BY aal.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [logs] = await pool.execute(query, params);
      return logs;
    } catch (error) {
      console.error('❌ Activity log query failed:', error.message);
      throw error;
    }
  }

  /**
   * Get recent activity for dashboard display
   * @param {number} limit - Number of recent activities to retrieve
   * @returns {Promise<Array>} - Array of recent activities
   */
  async getRecentActivity(limit = 20) {
    try {
      const [activities] = await pool.execute(
        `SELECT 
          aal.*,
          ap.full_name,
          ap.email,
          ap.role
         FROM admin_activity_log aal
         LEFT JOIN admin_profiles ap ON aal.admin_profile_id = ap.id
         ORDER BY aal.created_at DESC
         LIMIT ?`,
        [limit]
      );

      return activities;
    } catch (error) {
      console.error('❌ Recent activity query failed:', error.message);
      throw error;
    }
  }

  /**
   * Get activity count by action type
   * @param {number} adminProfileId - Admin profile ID (optional)
   * @param {string} startDate - Start date (optional)
   * @param {string} endDate - End date (optional)
   * @returns {Promise<Array>} - Array of action counts
   */
  async getActivityCountByAction(adminProfileId = null, startDate = null, endDate = null) {
    try {
      let query = `
        SELECT 
          action,
          COUNT(*) as count
        FROM admin_activity_log
        WHERE 1=1
      `;

      const params = [];

      if (adminProfileId) {
        query += ' AND admin_profile_id = ?';
        params.push(adminProfileId);
      }

      if (startDate) {
        query += ' AND created_at >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND created_at <= ?';
        params.push(endDate);
      }

      query += ' GROUP BY action ORDER BY count DESC';

      const [counts] = await pool.execute(query, params);
      return counts;
    } catch (error) {
      console.error('❌ Activity count query failed:', error.message);
      throw error;
    }
  }
}

module.exports = new ActivityLogService();
