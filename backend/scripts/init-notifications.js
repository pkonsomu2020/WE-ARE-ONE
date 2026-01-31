const { pool } = require('../config/database');

async function initializeNotifications() {
  try {
    console.log('🔄 Initializing notifications system...');

    // Create notifications table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          type ENUM('success', 'info', 'warning', 'error') DEFAULT 'info',
          source ENUM('event', 'feedback', 'file', 'settings', 'system') DEFAULT 'system',
          action_url VARCHAR(500) NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          
          INDEX idx_created_at (created_at),
          INDEX idx_is_read (is_read),
          INDEX idx_source (source),
          INDEX idx_type (type)
      )
    `);

    console.log('✅ Notifications table created successfully');
    console.log('🎉 Notifications system initialized successfully!');
    
  } catch (error) {
    console.error('❌ Failed to initialize notifications system:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initializeNotifications()
    .then(() => {
      console.log('✅ Notifications initialization complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Notifications initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeNotifications };