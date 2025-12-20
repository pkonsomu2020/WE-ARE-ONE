const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

// Ensure feedback tables exist
(async function ensureFeedbackTables() {
  try {
    // Messages table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS feedback_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_profile_id INT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        type ENUM('complaint', 'suggestion', 'announcement') NOT NULL,
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        status ENUM('new', 'in_progress', 'resolved') DEFAULT 'new',
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        assigned_to VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_feedback_type (type),
        INDEX idx_feedback_status (status),
        INDEX idx_feedback_priority (priority),
        INDEX idx_feedback_admin (admin_profile_id)
      )
    `);

    // Replies table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS feedback_replies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        message_id INT NOT NULL,
        admin_profile_id INT,
        reply_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (message_id) REFERENCES feedback_messages(id) ON DELETE CASCADE,
        INDEX idx_reply_message (message_id)
      )
    `);

    console.log('✅ Feedback tables ready');
  } catch (e) {
    console.error('⚠️ Failed ensuring feedback tables:', e.message);
  }
})();

// Get current admin profile info (simplified - no database queries)
router.get('/admin-profile', authenticateAdmin, async (req, res) => {
  try {
    // Return admin info from environment or JWT
    const profileData = {
      id: req.admin?.id || 1,
      fullName: process.env.ADMIN_DEFAULT_NAME || 'WAO Admin',
      email: process.env.ADMIN_DEFAULT_EMAIL || 'admin@weareone.co.ke',
      phone: '+254712345678',
      role: 'Super Admin',
      status: 'active'
    };

    res.json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error('Admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile'
    });
  }
});

// Get all feedback messages with pagination and filtering
router.get('/messages', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const type = req.query.type;
    const status = req.query.status;
    const priority = req.query.priority;
    const search = req.query.search;

    let whereClause = 'WHERE 1=1';
    let queryParams = [];

    if (type && type !== 'all') {
      whereClause += ' AND fm.type = ?';
      queryParams.push(type);
    }

    if (status && status !== 'all') {
      whereClause += ' AND fm.status = ?';
      queryParams.push(status);
    }

    if (priority && priority !== 'all') {
      whereClause += ' AND fm.priority = ?';
      queryParams.push(priority);
    }

    if (search) {
      whereClause += ' AND (fm.subject LIKE ? OR fm.message LIKE ? OR fm.name LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    const query = `
      SELECT 
        fm.*,
        (SELECT COUNT(*) FROM feedback_replies fr WHERE fr.message_id = fm.id) as replies_count
      FROM feedback_messages fm
      ${whereClause}
      ORDER BY fm.created_at DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset);

    const [messages] = await pool.execute(query, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM feedback_messages fm
      ${whereClause}
    `;

    const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2));
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// Update message priority
router.put('/messages/:id/priority', authenticateAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { priority } = req.body;

    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority' });
    }

    const [result] = await pool.execute(
      'UPDATE feedback_messages SET priority = ? WHERE id = ?',
      [priority, messageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({
      success: true,
      message: 'Message priority updated successfully'
    });
  } catch (error) {
    console.error('Error updating message priority:', error);
    res.status(500).json({ success: false, message: 'Failed to update message priority' });
  }
});

// Assign message to team member
router.put('/messages/:id/assign', authenticateAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { assignedTo } = req.body;

    const [result] = await pool.execute(
      'UPDATE feedback_messages SET assigned_to = ? WHERE id = ?',
      [assignedTo || null, messageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({
      success: true,
      message: 'Message assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning message:', error);
    res.status(500).json({ success: false, message: 'Failed to assign message' });
  }
});

// Create new feedback message
router.post('/messages', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, phone, type, priority, subject, message } = req.body;

    if (!name || !email || !phone || !type || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO feedback_messages 
       (name, email, phone, type, priority, subject, message) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, type, priority || 'medium', subject, message]
    );

    // Create notification for feedback submission
    try {
      await notificationService.createFeedbackNotification(type, subject);
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
    }

    res.json({
      success: true,
      message: 'Feedback message created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ success: false, message: 'Failed to create message' });
  }
});

// Get single message with replies
router.get('/messages/:id', authenticateAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;

    // Get message
    const [messages] = await pool.execute(
      'SELECT * FROM feedback_messages WHERE id = ?',
      [messageId]
    );

    if (messages.length === 0) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Get replies
    const [replies] = await pool.execute(
      'SELECT * FROM feedback_replies WHERE message_id = ? ORDER BY created_at ASC',
      [messageId]
    );

    res.json({
      success: true,
      data: {
        message: messages[0],
        replies: replies
      }
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch message' });
  }
});

// Update message status
router.put('/messages/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { status, assignedTo } = req.body;

    if (!['new', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const [result] = await pool.execute(
      'UPDATE feedback_messages SET status = ?, assigned_to = ? WHERE id = ?',
      [status, assignedTo || null, messageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({
      success: true,
      message: 'Message status updated successfully'
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ success: false, message: 'Failed to update message status' });
  }
});

// Add reply to message
router.post('/messages/:id/replies', authenticateAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({ success: false, message: 'Reply text is required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO feedback_replies (message_id, reply_text) VALUES (?, ?)',
      [messageId, replyText]
    );

    res.json({
      success: true,
      message: 'Reply added successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ success: false, message: 'Failed to add reply' });
  }
});

// Get feedback statistics
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    // Total messages
    const [totalMessages] = await pool.execute(
      'SELECT COUNT(*) as count FROM feedback_messages'
    );

    // Messages by status
    const [statusStats] = await pool.execute(
      `SELECT 
        status,
        COUNT(*) as count
       FROM feedback_messages
       GROUP BY status`
    );

    // Messages by type
    const [typeStats] = await pool.execute(
      `SELECT 
        type,
        COUNT(*) as count
       FROM feedback_messages
       GROUP BY type`
    );

    // Messages by priority
    const [priorityStats] = await pool.execute(
      `SELECT 
        priority,
        COUNT(*) as count
       FROM feedback_messages
       GROUP BY priority`
    );

    res.json({
      success: true,
      data: {
        totalMessages: totalMessages[0].count,
        byStatus: statusStats,
        byType: typeStats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

// Delete message
router.delete('/messages/:id', authenticateAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;

    const [result] = await pool.execute(
      'DELETE FROM feedback_messages WHERE id = ?',
      [messageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
});

module.exports = router;
