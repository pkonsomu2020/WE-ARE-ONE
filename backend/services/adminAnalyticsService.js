const { pool } = require('../config/database');

/**
 * Admin Analytics Service
 * Provides comprehensive analytics for admin activity and performance
 */
class AdminAnalyticsService {
  /**
   * Get overview metrics aggregated by admin profile (Task 6.1)
   * @param {Object} options - Filter options
   * @param {string} options.startDate - Start date for filtering
   * @param {string} options.endDate - End date for filtering
   * @returns {Promise<Array>} - Array of admin metrics
   */
  async getOverviewMetrics(options = {}) {
    try {
      const { startDate, endDate } = options;

      let query = `
        SELECT 
          ap.id as admin_profile_id,
          ap.full_name,
          ap.email,
          ap.role,
          ap.status,
          COUNT(DISTINCT CASE WHEN aal.action = 'document_upload' THEN aal.id END) as documents_uploaded,
          COUNT(DISTINCT CASE WHEN aal.action = 'feedback_response' THEN aal.id END) as feedback_responses,
          COUNT(DISTINCT CASE WHEN aal.action = 'event_created' THEN aal.id END) as events_created,
          COUNT(DISTINCT CASE WHEN aal.action = 'document_download' THEN aal.id END) as documents_downloaded,
          COUNT(DISTINCT CASE WHEN aal.action = 'event_updated' THEN aal.id END) as events_updated,
          COUNT(DISTINCT CASE WHEN aal.action = 'event_deleted' THEN aal.id END) as events_deleted,
          COUNT(aal.id) as total_actions,
          MAX(aal.created_at) as last_activity
        FROM admin_profiles ap
        LEFT JOIN admin_activity_log aal ON ap.id = aal.admin_profile_id
      `;

      const params = [];

      if (startDate || endDate) {
        query += ' WHERE 1=1';
        if (startDate) {
          query += ' AND aal.created_at >= ?';
          params.push(startDate);
        }
        if (endDate) {
          query += ' AND aal.created_at <= ?';
          params.push(endDate);
        }
      }

      query += ' GROUP BY ap.id, ap.full_name, ap.email, ap.role, ap.status';
      query += ' ORDER BY total_actions DESC';

      const [metrics] = await pool.execute(query, params);
      return metrics;
    } catch (error) {
      console.error('❌ Get overview metrics failed:', error.message);
      throw error;
    }
  }

  /**
   * Get detailed activity history for specific admin (Task 6.2)
   * @param {number} adminProfileId - Admin profile ID
   * @param {Object} options - Filter options
   * @param {string} options.startDate - Start date
   * @param {string} options.endDate - End date
   * @param {string} options.actionType - Filter by action type
   * @param {number} options.limit - Results limit
   * @param {number} options.offset - Results offset
   * @returns {Promise<Object>} - Admin details with activity history
   */
  async getAdminDetails(adminProfileId, options = {}) {
    try {
      const { startDate, endDate, actionType, limit = 50, offset = 0 } = options;

      // Get admin profile info
      const [adminProfile] = await pool.execute(
        'SELECT id, full_name, email, role, status, created_at FROM admin_profiles WHERE id = ?',
        [adminProfileId]
      );

      if (adminProfile.length === 0) {
        throw new Error('Admin profile not found');
      }

      // Build activity query
      let activityQuery = `
        SELECT 
          aal.*
        FROM admin_activity_log aal
        WHERE aal.admin_profile_id = ?
      `;

      const params = [adminProfileId];

      if (startDate) {
        activityQuery += ' AND aal.created_at >= ?';
        params.push(startDate);
      }

      if (endDate) {
        activityQuery += ' AND aal.created_at <= ?';
        params.push(endDate);
      }

      if (actionType) {
        activityQuery += ' AND aal.action = ?';
        params.push(actionType);
      }

      // Get total count
      const countQuery = activityQuery.replace('aal.*', 'COUNT(*) as total');
      const [countResult] = await pool.execute(countQuery, params);
      const total = countResult[0].total;

      // Get paginated activities
      activityQuery += ' ORDER BY aal.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [activities] = await pool.execute(activityQuery, params);

      // Get activity summary
      const [summary] = await pool.execute(
        `SELECT 
          action,
          COUNT(*) as count
         FROM admin_activity_log
         WHERE admin_profile_id = ?
         ${startDate ? 'AND created_at >= ?' : ''}
         ${endDate ? 'AND created_at <= ?' : ''}
         GROUP BY action
         ORDER BY count DESC`,
        [
          adminProfileId,
          ...(startDate ? [startDate] : []),
          ...(endDate ? [endDate] : [])
        ]
      );

      return {
        profile: adminProfile[0],
        activities: activities,
        summary: summary,
        pagination: {
          total: total,
          limit: limit,
          offset: offset,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('❌ Get admin details failed:', error.message);
      throw error;
    }
  }

  /**
   * Get activity trends for charting (Task 6.2)
   * @param {Object} options - Filter options
   * @param {string} options.startDate - Start date
   * @param {string} options.endDate - End date
   * @param {number} options.adminProfileId - Filter by admin (optional)
   * @param {string} options.groupBy - Group by 'day', 'week', or 'month'
   * @returns {Promise<Array>} - Array of trend data points
   */
  async getActivityTrends(options = {}) {
    try {
      const { startDate, endDate, adminProfileId, groupBy = 'day' } = options;

      // Determine date format based on groupBy
      let dateFormat;
      switch (groupBy) {
        case 'week':
          dateFormat = '%Y-%u'; // Year-Week
          break;
        case 'month':
          dateFormat = '%Y-%m'; // Year-Month
          break;
        default:
          dateFormat = '%Y-%m-%d'; // Year-Month-Day
      }

      let query = `
        SELECT 
          DATE_FORMAT(aal.created_at, '${dateFormat}') as period,
          DATE(aal.created_at) as date,
          COUNT(*) as total_actions,
          COUNT(DISTINCT aal.admin_profile_id) as active_admins,
          COUNT(DISTINCT CASE WHEN aal.action = 'document_upload' THEN aal.id END) as documents_uploaded,
          COUNT(DISTINCT CASE WHEN aal.action = 'feedback_response' THEN aal.id END) as feedback_responses,
          COUNT(DISTINCT CASE WHEN aal.action = 'event_created' THEN aal.id END) as events_created
        FROM admin_activity_log aal
        WHERE 1=1
      `;

      const params = [];

      if (startDate) {
        query += ' AND aal.created_at >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND aal.created_at <= ?';
        params.push(endDate);
      }

      if (adminProfileId) {
        query += ' AND aal.admin_profile_id = ?';
        params.push(adminProfileId);
      }

      query += ' GROUP BY period, date ORDER BY date ASC';

      const [trends] = await pool.execute(query, params);
      return trends;
    } catch (error) {
      console.error('❌ Get activity trends failed:', error.message);
      throw error;
    }
  }

  /**
   * Export analytics data to CSV format (Task 6.3)
   * @param {Object} options - Export options
   * @param {string} options.startDate - Start date
   * @param {string} options.endDate - End date
   * @param {string} options.type - Export type: 'overview' or 'detailed'
   * @returns {Promise<string>} - CSV formatted string
   */
  async exportToCSV(options = {}) {
    try {
      const { startDate, endDate, type = 'overview' } = options;

      let csvData = '';

      if (type === 'overview') {
        // Export overview metrics
        const metrics = await this.getOverviewMetrics({ startDate, endDate });

        // CSV Headers
        csvData = 'Admin Name,Email,Role,Status,Documents Uploaded,Feedback Responses,Events Created,Documents Downloaded,Events Updated,Events Deleted,Total Actions,Last Activity\n';

        // CSV Rows
        metrics.forEach(metric => {
          csvData += `"${metric.full_name}","${metric.email}","${metric.role}","${metric.status}",${metric.documents_uploaded},${metric.feedback_responses},${metric.events_created},${metric.documents_downloaded},${metric.events_updated},${metric.events_deleted},${metric.total_actions},"${metric.last_activity || 'N/A'}"\n`;
        });

      } else if (type === 'detailed') {
        // Export detailed activity log
        let query = `
          SELECT 
            ap.full_name,
            ap.email,
            aal.action,
            aal.description,
            aal.ip_address,
            aal.created_at
          FROM admin_activity_log aal
          JOIN admin_profiles ap ON aal.admin_profile_id = ap.id
          WHERE 1=1
        `;

        const params = [];

        if (startDate) {
          query += ' AND aal.created_at >= ?';
          params.push(startDate);
        }

        if (endDate) {
          query += ' AND aal.created_at <= ?';
          params.push(endDate);
        }

        query += ' ORDER BY aal.created_at DESC';

        const [activities] = await pool.execute(query, params);

        // CSV Headers
        csvData = 'Admin Name,Email,Action,Description,IP Address,Timestamp\n';

        // CSV Rows
        activities.forEach(activity => {
          csvData += `"${activity.full_name}","${activity.email}","${activity.action}","${activity.description || ''}","${activity.ip_address || ''}","${activity.created_at}"\n`;
        });
      }

      return csvData;
    } catch (error) {
      console.error('❌ Export to CSV failed:', error.message);
      throw error;
    }
  }

  /**
   * Get action type statistics
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} - Array of action statistics
   */
  async getActionTypeStats(options = {}) {
    try {
      const { startDate, endDate, adminProfileId } = options;

      let query = `
        SELECT 
          aal.action,
          COUNT(*) as count,
          COUNT(DISTINCT aal.admin_profile_id) as unique_admins
        FROM admin_activity_log aal
        WHERE 1=1
      `;

      const params = [];

      if (startDate) {
        query += ' AND aal.created_at >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND aal.created_at <= ?';
        params.push(endDate);
      }

      if (adminProfileId) {
        query += ' AND aal.admin_profile_id = ?';
        params.push(adminProfileId);
      }

      query += ' GROUP BY aal.action ORDER BY count DESC';

      const [stats] = await pool.execute(query, params);
      return stats;
    } catch (error) {
      console.error('❌ Get action type stats failed:', error.message);
      throw error;
    }
  }

  /**
   * Get top performing admins
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} - Array of top admins
   */
  async getTopPerformers(options = {}) {
    try {
      const { startDate, endDate, limit = 10 } = options;

      const metrics = await this.getOverviewMetrics({ startDate, endDate });
      
      // Sort by total actions and limit
      return metrics
        .sort((a, b) => b.total_actions - a.total_actions)
        .slice(0, limit);
    } catch (error) {
      console.error('❌ Get top performers failed:', error.message);
      throw error;
    }
  }
}

module.exports = new AdminAnalyticsService();
