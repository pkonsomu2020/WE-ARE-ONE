const { supabase } = require('../config/database');

/**
 * Activity Log Service (Supabase Version)
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

      console.log('📝 Logging activity:', { adminProfileId, action, description });

      const { data, error } = await supabase
        .from('admin_activity_log')
        .insert([{
          admin_profile_id: adminProfileId,
          action: action,
          description: description,
          ip_address: ipAddress,
          user_agent: userAgent,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Activity log insert failed:', error);
        throw error;
      }

      console.log('✅ Activity logged successfully:', data.id);
      return data.id;
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

      let query = supabase
        .from('admin_activity_log')
        .select(`
          *,
          admin_profiles (
            full_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (adminProfileId) {
        query = query.eq('admin_profile_id', adminProfileId);
      }

      if (action) {
        query = query.eq('action', action);
      }

      if (startDate) {
        query = query.gte('created_at', startDate);
      }

      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data: logs, error } = await query;

      if (error) {
        console.error('❌ Activity log query failed:', error);
        throw error;
      }

      return logs || [];
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
      const { data: activities, error } = await supabase
        .from('admin_activity_log')
        .select(`
          *,
          admin_profiles (
            full_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Recent activity query failed:', error);
        throw error;
      }

      return activities || [];
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
      let query = supabase
        .from('admin_activity_log')
        .select('action');

      if (adminProfileId) {
        query = query.eq('admin_profile_id', adminProfileId);
      }

      if (startDate) {
        query = query.gte('created_at', startDate);
      }

      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data: activities, error } = await query;

      if (error) {
        console.error('❌ Activity count query failed:', error);
        throw error;
      }

      // Count activities by action type
      const counts = {};
      activities?.forEach(activity => {
        counts[activity.action] = (counts[activity.action] || 0) + 1;
      });

      // Convert to array format
      const result = Object.entries(counts).map(([action, count]) => ({
        action,
        count
      })).sort((a, b) => b.count - a.count);

      return result;
    } catch (error) {
      console.error('❌ Activity count query failed:', error.message);
      throw error;
    }
  }
}

module.exports = new ActivityLogService();
