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

    // Insert sample notifications for demo
    const [existingNotifications] = await pool.execute('SELECT COUNT(*) as count FROM notifications');
    
    if (existingNotifications[0].count === 0) {
      await pool.execute(`
        INSERT INTO notifications (title, message, type, source, action_url, is_read, created_at) VALUES
        ('Welcome to Admin Portal', 'System initialized successfully. All features are ready to use.', 'success', 'system', '/admin', FALSE, DATE_SUB(NOW(), INTERVAL 5 MINUTE)),
        ('New Meeting Scheduled', 'Team meeting scheduled for tomorrow at 10:00 AM', 'info', 'event', '/admin/events', FALSE, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
        ('Feedback Received', 'New customer feedback submitted for review', 'success', 'feedback', '/admin/feedback', FALSE, DATE_SUB(NOW(), INTERVAL 2 HOUR))
      `);
      
      console.log('✅ Sample notifications inserted');
    } else {
      console.log('ℹ️ Notifications table already has data, skipping sample data insertion');
    }

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