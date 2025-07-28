const { pool } = require('../config/database');

// Create a new chat session
exports.createChatSession = async (req, res) => {
  try {
    const { sessionName = 'New Chat' } = req.body;
    const userId = req.user?.id || null; // Optional user authentication

    const [result] = await pool.execute(
      'INSERT INTO chat_sessions (user_id, session_name) VALUES (?, ?)',
      [userId, sessionName]
    );

    res.json({
      success: true,
      sessionId: result.insertId,
      sessionName,
      message: 'Chat session created successfully'
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat session'
    });
  }
};

// Save a message to chat history
exports.saveMessage = async (req, res) => {
  try {
    const { sessionId, sender, message } = req.body;

    if (!sessionId || !sender || !message) {
      return res.status(400).json({
        success: false,
        message: 'Session ID, sender, and message are required'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)',
      [sessionId, sender, message]
    );

    // Update the session's updated_at timestamp
    await pool.execute(
      'UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [sessionId]
    );

    res.json({
      success: true,
      messageId: result.insertId,
      message: 'Message saved successfully'
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save message'
    });
  }
};

// Get all chat sessions for a user
exports.getChatSessions = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    let query = `
      SELECT cs.*, 
             COUNT(cm.id) as message_count,
             MAX(cm.created_at) as last_message_time
      FROM chat_sessions cs
      LEFT JOIN chat_messages cm ON cs.id = cm.session_id
    `;

    if (userId) {
      query += ' WHERE cs.user_id = ?';
      query += ' GROUP BY cs.id ORDER BY cs.updated_at DESC';
      const [sessions] = await pool.execute(query, [userId]);
      res.json({ success: true, sessions });
    } else {
      // For anonymous users, return recent sessions (limit to last 10)
      query += ' WHERE cs.user_id IS NULL';
      query += ' GROUP BY cs.id ORDER BY cs.updated_at DESC LIMIT 10';
      const [sessions] = await pool.execute(query);
      res.json({ success: true, sessions });
    }
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat sessions'
    });
  }
};

// Get messages for a specific chat session
exports.getChatMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const [messages] = await pool.execute(
      'SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC',
      [sessionId]
    );

    res.json({
      success: true,
      messages: messages.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        text: msg.message,
        timestamp: msg.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat messages'
    });
  }
};

// Update chat session name
exports.updateSessionName = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { sessionName } = req.body;

    if (!sessionName) {
      return res.status(400).json({
        success: false,
        message: 'Session name is required'
      });
    }

    await pool.execute(
      'UPDATE chat_sessions SET session_name = ? WHERE id = ?',
      [sessionName, sessionId]
    );

    res.json({
      success: true,
      message: 'Session name updated successfully'
    });
  } catch (error) {
    console.error('Error updating session name:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update session name'
    });
  }
};

// Delete a chat session and all its messages
exports.deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Delete messages first (due to foreign key constraint)
    await pool.execute('DELETE FROM chat_messages WHERE session_id = ?', [sessionId]);
    
    // Delete the session
    await pool.execute('DELETE FROM chat_sessions WHERE id = ?', [sessionId]);

    res.json({
      success: true,
      message: 'Chat session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat session'
    });
  }
}; 