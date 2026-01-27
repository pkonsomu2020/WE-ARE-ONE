const realAnalyticsService = require('../services/realAnalyticsService');

async function testAnalytics() {
  try {
    console.log('🧪 Testing Real Analytics Service...');
    
    // Test overview metrics
    console.log('\n📊 Testing Overview Metrics...');
    const overview = await realAnalyticsService.getOverviewMetrics();
    console.log('Overview:', JSON.stringify(overview, null, 2));
    
    // Test activity trends
    console.log('\n📈 Testing Activity Trends...');
    const trends = await realAnalyticsService.getActivityTrends({
      startDate: '2025-11-01',
      endDate: '2025-12-01'
    });
    console.log('Trends:', JSON.stringify(trends, null, 2));
    
    // Test admin details
    if (overview.metrics && overview.metrics.length > 0) {
      const firstAdmin = overview.metrics[0];
      console.log('\n👤 Testing Admin Details...');
      const details = await realAnalyticsService.getAdminDetails(firstAdmin.admin_profile_id);
      console.log('Admin Details:', JSON.stringify(details, null, 2));
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAnalytics();