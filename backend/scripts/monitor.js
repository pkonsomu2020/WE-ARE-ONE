#!/usr/bin/env node

/**
 * External monitoring script to keep the backend warm
 * This can be run as a cron job or external service
 */

const https = require('https');

const BACKEND_URL = 'https://wao-backend.onrender.com';
const PING_INTERVAL = 8 * 60 * 1000; // 8 minutes (before Render's 10-minute timeout)

class BackendMonitor {
  constructor() {
    this.isRunning = false;
    this.pingCount = 0;
    this.lastPingTime = null;
    this.errors = 0;
  }

  async pingBackend() {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const req = https.get(`${BACKEND_URL}/api/health`, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const duration = Date.now() - startTime;
          
          if (res.statusCode === 200) {
            this.pingCount++;
            this.lastPingTime = new Date();
            this.errors = 0; // Reset error count on success
            
            console.log(`✅ Ping #${this.pingCount} successful (${duration}ms) - ${this.lastPingTime.toISOString()}`);
            resolve({ success: true, duration, data: JSON.parse(data) });
          } else {
            console.error(`❌ Ping failed with status ${res.statusCode}`);
            this.errors++;
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        const duration = Date.now() - startTime;
        console.error(`❌ Ping failed after ${duration}ms:`, error.message);
        this.errors++;
        reject(error);
      });

      req.setTimeout(30000, () => {
        req.destroy();
        console.error('❌ Ping timeout after 30 seconds');
        this.errors++;
        reject(new Error('Timeout'));
      });
    });
  }

  async performWarmup() {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const req = https.get(`${BACKEND_URL}/api/warmup`, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const duration = Date.now() - startTime;
          
          if (res.statusCode === 200) {
            console.log(`🔥 Warmup successful (${duration}ms)`);
            resolve({ success: true, duration });
          } else {
            console.error(`❌ Warmup failed with status ${res.statusCode}`);
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Warmup failed:', error.message);
        reject(error);
      });

      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('Warmup timeout'));
      });
    });
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ Monitor is already running');
      return;
    }

    this.isRunning = true;
    console.log(`🚀 Starting backend monitor for ${BACKEND_URL}`);
    console.log(`📅 Ping interval: ${PING_INTERVAL / 1000 / 60} minutes`);

    // Initial ping
    this.pingBackend().catch(() => {
      console.log('Initial ping failed, will retry...');
    });

    // Schedule regular pings
    const intervalId = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(intervalId);
        return;
      }

      try {
        await this.pingBackend();
        
        // Perform warmup every 5th ping
        if (this.pingCount % 5 === 0) {
          await this.performWarmup();
        }
        
      } catch (error) {
        console.error('Ping failed:', error.message);
        
        // If too many consecutive errors, try warmup
        if (this.errors >= 3) {
          console.log('🔥 Too many errors, attempting warmup...');
          try {
            await this.performWarmup();
          } catch (warmupError) {
            console.error('Warmup also failed:', warmupError.message);
          }
        }
      }
    }, PING_INTERVAL);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down monitor...');
      this.isRunning = false;
      clearInterval(intervalId);
      console.log(`📊 Final stats: ${this.pingCount} pings, ${this.errors} errors`);
      process.exit(0);
    });
  }

  getStats() {
    return {
      isRunning: this.isRunning,
      pingCount: this.pingCount,
      lastPingTime: this.lastPingTime,
      errors: this.errors
    };
  }
}

// Run if called directly
if (require.main === module) {
  const monitor = new BackendMonitor();
  monitor.start();
}

module.exports = BackendMonitor;