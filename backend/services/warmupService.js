const { testConnection } = require('../config/database');

class WarmupService {
  constructor() {
    this.isWarming = false;
    this.warmupInterval = null;
    this.lastActivity = Date.now();
  }

  // Start the warmup service
  start() {
    console.log('🔥 Starting warmup service...');
    
    // Immediate warmup
    this.performWarmup();
    
    // Schedule regular warmups every 10 minutes
    this.warmupInterval = setInterval(() => {
      this.performWarmup();
    }, 10 * 60 * 1000); // 10 minutes
    
    console.log('✅ Warmup service started - will ping every 10 minutes');
  }

  // Perform warmup operations
  async performWarmup() {
    if (this.isWarming) return;
    
    this.isWarming = true;
    const startTime = Date.now();
    
    try {
      console.log('🔥 Performing backend warmup...');
      
      // Test database connection
      const dbConnected = await testConnection();
      
      // Update last activity
      this.lastActivity = Date.now();
      
      const duration = Date.now() - startTime;
      console.log(`✅ Warmup completed in ${duration}ms - DB: ${dbConnected ? 'Connected' : 'Failed'}`);
      
    } catch (error) {
      console.error('❌ Warmup failed:', error.message);
    } finally {
      this.isWarming = false;
    }
  }

  // Record user activity
  recordActivity() {
    this.lastActivity = Date.now();
  }

  // Get time since last activity
  getTimeSinceLastActivity() {
    return Date.now() - this.lastActivity;
  }

  // Stop the warmup service
  stop() {
    if (this.warmupInterval) {
      clearInterval(this.warmupInterval);
      this.warmupInterval = null;
      console.log('🛑 Warmup service stopped');
    }
  }
}

// Create singleton instance
const warmupService = new WarmupService();

module.exports = warmupService;