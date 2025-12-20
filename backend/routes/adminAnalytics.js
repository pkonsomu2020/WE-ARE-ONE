const express = require('express');
const router = express.Router();
const enhancedAdminAuth = require('../middleware/enhancedAdminAuth');
const adminAnalyticsService = require('../services/adminAnalyticsService');

// Apply enhanced admin authentication to all routes
router.use(enhancedAdminAuth);

/**
 * GET /api/admin/analytics/overview
 * Get overview metrics for all admins (Task 6.4)
 * Query params: startDate, endDate
 */
router.get('/overview', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const metrics = await adminAnalyticsService.getOverviewMetrics({
      startDate,
      endDate
    });

    res.json({
      success: true,
      data: {
        metrics,
        filters: {
          startDate: startDate || null,
          endDate: endDate || null
        }
      }
    });
  } catch (error) {
    console.error('Get overview metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overview metrics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/admin/analytics/admin/:profileId
 * Get detailed analytics for specific admin (Task 6.4)
 * Query params: startDate, endDate, actionType, page, limit
 */
router.get('/admin/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const { startDate, endDate, actionType, page = 1, limit = 50 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const details = await adminAnalyticsService.getAdminDetails(
      parseInt(profileId),
      {
        startDate,
        endDate,
        actionType,
        limit: parseInt(limit),
        offset
      }
    );

    res.json({
      success: true,
      data: details
    });
  } catch (error) {
    console.error('Get admin details error:', error);
    
    if (error.message === 'Admin profile not found') {
      return res.status(404).json({
        success: false,
        message: 'Admin profile not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/admin/analytics/trends
 * Get activity trends for charting (Task 6.4)
 * Query params: startDate, endDate, adminProfileId, groupBy
 */
router.get('/trends', async (req, res) => {
  try {
    const { startDate, endDate, adminProfileId, groupBy = 'day' } = req.query;

    const trends = await adminAnalyticsService.getActivityTrends({
      startDate,
      endDate,
      adminProfileId: adminProfileId ? parseInt(adminProfileId) : null,
      groupBy
    });

    res.json({
      success: true,
      data: {
        trends,
        filters: {
          startDate: startDate || null,
          endDate: endDate || null,
          adminProfileId: adminProfileId || null,
          groupBy
        }
      }
    });
  } catch (error) {
    console.error('Get activity trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity trends',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/admin/analytics/export
 * Export analytics data to CSV (Task 6.4)
 * Query params: startDate, endDate, type (overview|detailed)
 */
router.get('/export', async (req, res) => {
  try {
    const { startDate, endDate, type = 'overview' } = req.query;

    const csvData = await adminAnalyticsService.exportToCSV({
      startDate,
      endDate,
      type
    });

    // Set headers for CSV download
    const filename = `admin_analytics_${type}_${Date.now()}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.send(csvData);
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/admin/analytics/action-stats
 * Get statistics by action type
 * Query params: startDate, endDate, adminProfileId
 */
router.get('/action-stats', async (req, res) => {
  try {
    const { startDate, endDate, adminProfileId } = req.query;

    const stats = await adminAnalyticsService.getActionTypeStats({
      startDate,
      endDate,
      adminProfileId: adminProfileId ? parseInt(adminProfileId) : null
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get action stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch action statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/admin/analytics/top-performers
 * Get top performing admins
 * Query params: startDate, endDate, limit
 */
router.get('/top-performers', async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    const topPerformers = await adminAnalyticsService.getTopPerformers({
      startDate,
      endDate,
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: topPerformers
    });
  } catch (error) {
    console.error('Get top performers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top performers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
