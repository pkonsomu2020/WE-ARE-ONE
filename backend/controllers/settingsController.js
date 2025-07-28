const { pool } = require('../config/database');

// Get user settings
exports.getUserSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.execute(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      // Create default settings if none exist
      await pool.execute(
        'INSERT INTO user_settings (user_id, dark_mode, mood_reminders, data_retention_days) VALUES (?, ?, ?, ?)',
        [userId, true, false, 30]
      );
      
      res.json({
        success: true,
        settings: {
          darkMode: true,
          moodReminders: false,
          dataRetentionDays: 30
        }
      });
    } else {
      const settings = rows[0];
      res.json({
        success: true,
        settings: {
          darkMode: settings.dark_mode === 1,
          moodReminders: settings.mood_reminders === 1,
          dataRetentionDays: settings.data_retention_days
        }
      });
    }
  } catch (error) {
    console.error('Error getting user settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user settings'
    });
  }
};

// Update user settings
exports.updateUserSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { darkMode, moodReminders, dataRetentionDays } = req.body;

    await pool.execute(
      `INSERT INTO user_settings (user_id, dark_mode, mood_reminders, data_retention_days) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       dark_mode = VALUES(dark_mode), 
       mood_reminders = VALUES(mood_reminders), 
       data_retention_days = VALUES(data_retention_days)`,
      [userId, darkMode ? 1 : 0, moodReminders ? 1 : 0, dataRetentionDays]
    );

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
};

// Export user data
exports.exportUserData = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user data from all tables
    const [userData] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    const [moodData] = await pool.execute('SELECT * FROM moods WHERE user_id = ?', [userId]);
    const [journalData] = await pool.execute('SELECT * FROM journal_entries WHERE user_id = ?', [userId]);
    const [chatSessions] = await pool.execute('SELECT * FROM chat_sessions WHERE user_id = ?', [userId]);
    
    // Get chat messages for all user sessions
    const sessionIds = chatSessions.map(session => session.id);
    let chatMessages = [];
    if (sessionIds.length > 0) {
      const [messages] = await pool.execute(
        'SELECT * FROM chat_messages WHERE session_id IN (?)',
        [sessionIds]
      );
      chatMessages = messages;
    }

    const exportData = {
      user: userData[0] || null,
      moods: moodData,
      journalEntries: journalData,
      chatSessions: chatSessions,
      chatMessages: chatMessages,
      exportDate: new Date().toISOString()
    };

    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    console.error('Error exporting user data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data'
    });
  }
};

// Delete user account and all data
exports.deleteUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;

    // Start transaction
    await pool.execute('START TRANSACTION');

    try {
      // Delete chat messages first (due to foreign key constraints)
      const [chatSessions] = await pool.execute('SELECT id FROM chat_sessions WHERE user_id = ?', [userId]);
      const sessionIds = chatSessions.map(session => session.id);
      
      if (sessionIds.length > 0) {
        await pool.execute('DELETE FROM chat_messages WHERE session_id IN (?)', [sessionIds]);
      }

      // Delete all user data
      await pool.execute('DELETE FROM chat_sessions WHERE user_id = ?', [userId]);
      await pool.execute('DELETE FROM moods WHERE user_id = ?', [userId]);
      await pool.execute('DELETE FROM journal_entries WHERE user_id = ?', [userId]);
      await pool.execute('DELETE FROM user_support_categories WHERE user_id = ?', [userId]);
      await pool.execute('DELETE FROM user_settings WHERE user_id = ?', [userId]);
      await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

      // Commit transaction
      await pool.execute('COMMIT');

      res.json({
        success: true,
        message: 'Account and all data deleted successfully'
      });
    } catch (error) {
      // Rollback on error
      await pool.execute('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
}; 