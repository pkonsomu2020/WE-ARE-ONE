const { supabase } = require('../config/database');

/**
 * Real Analytics Service using actual database data
 * Provides comprehensive analytics for admin activities
 */

// Get overview metrics for all admins
const getOverviewMetrics = async (options = {}) => {
  try {
    const { startDate, endDate } = options;
    
    // Get all admin profiles
    const { data: adminProfiles, error: profilesError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('status', 'active');

    if (profilesError) throw profilesError;

    // Get activity logs with date filtering
    let activityQuery = supabase
      .from('admin_activity_log')
      .select('*');

    if (startDate) {
      activityQuery = activityQuery.gte('created_at', startDate);
    }
    if (endDate) {
      activityQuery = activityQuery.lte('created_at', endDate);
    }

    const { data: activities, error: activitiesError } = await activityQuery;
    if (activitiesError) throw activitiesError;

    // Get scheduled events
    let eventsQuery = supabase
      .from('scheduled_events')
      .select('*');

    if (startDate) {
      eventsQuery = eventsQuery.gte('created_at', startDate);
    }
    if (endDate) {
      eventsQuery = eventsQuery.lte('created_at', endDate);
    }

    const { data: events, error: eventsError } = await eventsQuery;
    if (eventsError) throw eventsError;

    // Get feedback data
    let feedbackQuery = supabase
      .from('feedback')
      .select('*');

    if (startDate) {
      feedbackQuery = feedbackQuery.gte('created_at', startDate);
    }
    if (endDate) {
      feedbackQuery = feedbackQuery.lte('created_at', endDate);
    }

    const { data: feedback, error: feedbackError } = await feedbackQuery;
    if (feedbackError) throw feedbackError;

    // Get file uploads
    let filesQuery = supabase
      .from('files')
      .select('*');

    if (startDate) {
      filesQuery = filesQuery.gte('created_at', startDate);
    }
    if (endDate) {
      filesQuery = filesQuery.lte('created_at', endDate);
    }

    const { data: files, error: filesError } = await filesQuery;
    if (filesError) throw filesError;

    // Calculate metrics for each admin
    const adminMetrics = adminProfiles.map(admin => {
      const adminActivities = activities?.filter(a => a.admin_profile_id === admin.id) || [];
      const adminEvents = events?.filter(e => e.created_by_profile_id === admin.id) || [];
      const adminFiles = files?.filter(f => f.uploaded_by === admin.id) || [];
      
      // Count different types of activities
      const documentsUploaded = adminActivities.filter(a => a.action === 'document_upload').length;
      const eventsCreated = adminActivities.filter(a => a.action === 'event_created').length;
      const feedbackResponses = adminActivities.filter(a => a.action === 'feedback_response').length;
      const documentsDownloaded = adminActivities.filter(a => a.action === 'document_download').length;
      const eventsUpdated = adminActivities.filter(a => a.action === 'event_updated').length;
      const eventsDeleted = adminActivities.filter(a => a.action === 'event_deleted').length;

      return {
        admin_profile_id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role,
        documents_uploaded: documentsUploaded,
        feedback_responses: feedbackResponses,
        events_created: eventsCreated,
        documents_downloaded: documentsDownloaded,
        events_updated: eventsUpdated,
        events_deleted: eventsDeleted,
        total_actions: adminActivities.length,
        last_activity: admin.last_activity
      };
    });

    return {
      metrics: adminMetrics,
      summary: {
        totalAdmins: adminProfiles.length,
        totalActivities: activities?.length || 0,
        totalEvents: events?.length || 0,
        totalFiles: files?.length || 0,
        totalFeedback: feedback?.length || 0
      }
    };

  } catch (error) {
    console.error('Error getting overview metrics:', error);
    throw error;
  }
};

// Get activity trends for charting
const getActivityTrends = async (options = {}) => {
  try {
    const { startDate, endDate, adminProfileId, groupBy = 'day' } = options;
    
    let query = supabase
      .from('admin_activity_log')
      .select('*')
      .order('created_at', { ascending: true });

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    if (adminProfileId) {
      query = query.eq('admin_profile_id', adminProfileId);
    }

    const { data: activities, error } = await query;
    if (error) throw error;

    // Group activities by date
    const trendsMap = new Map();
    
    activities?.forEach(activity => {
      const date = new Date(activity.created_at);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!trendsMap.has(dateKey)) {
        trendsMap.set(dateKey, {
          date: dateKey,
          total_actions: 0,
          documents_uploaded: 0,
          feedback_responses: 0,
          events_created: 0,
          events_updated: 0,
          events_deleted: 0,
          documents_downloaded: 0
        });
      }
      
      const dayData = trendsMap.get(dateKey);
      dayData.total_actions++;
      
      switch (activity.action) {
        case 'document_upload':
          dayData.documents_uploaded++;
          break;
        case 'feedback_response':
          dayData.feedback_responses++;
          break;
        case 'event_created':
          dayData.events_created++;
          break;
        case 'event_updated':
          dayData.events_updated++;
          break;
        case 'event_deleted':
          dayData.events_deleted++;
          break;
        case 'document_download':
          dayData.documents_downloaded++;
          break;
      }
    });

    // Convert map to array and sort by date
    const trends = Array.from(trendsMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return { trends };

  } catch (error) {
    console.error('Error getting activity trends:', error);
    throw error;
  }
};

// Get detailed analytics for specific admin
const getAdminDetails = async (adminProfileId, options = {}) => {
  try {
    const { startDate, endDate, actionType, page = 1, limit = 50 } = options;
    const offset = (page - 1) * limit;

    // Get admin profile
    const { data: adminProfile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', adminProfileId)
      .single();

    if (profileError) throw profileError;

    // Get admin activities
    let query = supabase
      .from('admin_activity_log')
      .select('*')
      .eq('admin_profile_id', adminProfileId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    if (actionType) {
      query = query.eq('action', actionType);
    }

    const { data: activities, error: activitiesError } = await query;
    if (activitiesError) throw activitiesError;

    // Get total count for pagination
    let countQuery = supabase
      .from('admin_activity_log')
      .select('*', { count: 'exact', head: true })
      .eq('admin_profile_id', adminProfileId);

    if (startDate) {
      countQuery = countQuery.gte('created_at', startDate);
    }
    if (endDate) {
      countQuery = countQuery.lte('created_at', endDate);
    }
    if (actionType) {
      countQuery = countQuery.eq('action', actionType);
    }

    const { count, error: countError } = await countQuery;
    if (countError) throw countError;

    return {
      admin: adminProfile,
      activities: activities || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };

  } catch (error) {
    console.error('Error getting admin details:', error);
    throw error;
  }
};

// Export analytics data to CSV
const exportToCSV = async (options = {}) => {
  try {
    const { startDate, endDate, type = 'overview' } = options;
    
    if (type === 'overview') {
      const { metrics } = await getOverviewMetrics({ startDate, endDate });
      
      // Create CSV headers
      const headers = [
        'Admin Name',
        'Email',
        'Role',
        'Documents Uploaded',
        'Feedback Responses',
        'Events Created',
        'Documents Downloaded',
        'Events Updated',
        'Events Deleted',
        'Total Actions',
        'Last Activity'
      ];
      
      // Create CSV rows
      const rows = metrics.map(admin => [
        admin.full_name,
        admin.email,
        admin.role,
        admin.documents_uploaded,
        admin.feedback_responses,
        admin.events_created,
        admin.documents_downloaded,
        admin.events_updated,
        admin.events_deleted,
        admin.total_actions,
        admin.last_activity || 'Never'
      ]);
      
      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      return csvContent;
    }
    
    throw new Error('Unsupported export type');

  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

// Get statistics by action type
const getActionTypeStats = async (options = {}) => {
  try {
    const { startDate, endDate, adminProfileId } = options;
    
    let query = supabase
      .from('admin_activity_log')
      .select('action');

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    if (adminProfileId) {
      query = query.eq('admin_profile_id', adminProfileId);
    }

    const { data: activities, error } = await query;
    if (error) throw error;

    // Count by action type
    const actionStats = {};
    activities?.forEach(activity => {
      actionStats[activity.action] = (actionStats[activity.action] || 0) + 1;
    });

    return { actionStats };

  } catch (error) {
    console.error('Error getting action type stats:', error);
    throw error;
  }
};

// Get top performing admins
const getTopPerformers = async (options = {}) => {
  try {
    const { startDate, endDate, limit = 10 } = options;
    
    const { metrics } = await getOverviewMetrics({ startDate, endDate });
    
    // Sort by total actions and take top performers
    const topPerformers = metrics
      .sort((a, b) => b.total_actions - a.total_actions)
      .slice(0, limit);

    return { topPerformers };

  } catch (error) {
    console.error('Error getting top performers:', error);
    throw error;
  }
};

module.exports = {
  getOverviewMetrics,
  getActivityTrends,
  getAdminDetails,
  exportToCSV,
  getActionTypeStats,
  getTopPerformers
};