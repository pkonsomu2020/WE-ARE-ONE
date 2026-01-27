const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const realAnalyticsService = require('../services/realAnalyticsService');

// Apply admin authentication to all routes
router.use(authenticateAdmin);

/**
 * GET /api/real-analytics/overview
 * Get overview metrics for all admins using real data
 */
router.get('/overview', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    console.log('📊 Fetching real analytics overview...', { startDate, endDate });
    
    const data = await realAnalyticsService.getOverviewMetrics({
      startDate,
      endDate
    });
    
    console.log('✅ Real analytics overview fetched');
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching real analytics overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics overview',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/real-analytics/trends
 * Get activity trends for charting using real data
 */
router.get('/trends', async (req, res) => {
  try {
    const { startDate, endDate, adminProfileId, groupBy = 'day' } = req.query;
    
    console.log('📊 Fetching real analytics trends...', { startDate, endDate, adminProfileId, groupBy });
    
    const data = await realAnalyticsService.getActivityTrends({
      startDate,
      endDate,
      adminProfileId,
      groupBy
    });
    
    console.log('✅ Real analytics trends fetched');
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching real analytics trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics trends',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/real-analytics/admin/:profileId
 * Get detailed analytics for specific admin using real data
 */
router.get('/admin/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const { startDate, endDate, actionType, page = 1, limit = 50 } = req.query;
    
    console.log('📊 Fetching admin details...', { profileId, startDate, endDate, actionType });
    
    const data = await realAnalyticsService.getAdminDetails(
      parseInt(profileId),
      {
        startDate,
        endDate,
        actionType,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    );
    
    console.log('✅ Admin details fetched');
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching admin details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/real-analytics/export
 * Export analytics data to CSV using real data
 */
router.get('/export', async (req, res) => {
  try {
    const { startDate, endDate, type = 'overview' } = req.query;
    
    console.log('📊 Exporting analytics data...', { startDate, endDate, type });
    
    const csvData = await realAnalyticsService.exportToCSV({
      startDate,
      endDate,
      type
    });
    
    // Set headers for CSV download
    const filename = `admin_analytics_${type}_${Date.now()}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    console.log('✅ Analytics data exported');
    
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
 * GET /api/real-analytics/action-stats
 * Get statistics by action type using real data
 */
router.get('/action-stats', async (req, res) => {
  try {
    const { startDate, endDate, adminProfileId } = req.query;
    
    console.log('📊 Fetching action type stats...', { startDate, endDate, adminProfileId });
    
    const data = await realAnalyticsService.getActionTypeStats({
      startDate,
      endDate,
      adminProfileId
    });
    
    console.log('✅ Action type stats fetched');
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching action stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch action statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/real-analytics/top-performers
 * Get top performing admins using real data
 */
router.get('/top-performers', async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
    console.log('📊 Fetching top performers...', { startDate, endDate, limit });
    
    const data = await realAnalyticsService.getTopPerformers({
      startDate,
      endDate,
      limit: parseInt(limit)
    });
    
    console.log('✅ Top performers fetched');
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching top performers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top performers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;