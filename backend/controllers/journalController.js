const { pool } = require('../config/database');

// Create a new journal entry
exports.createEntry = async (req, res) => {
  try {
    const { user_id, title, content } = req.body;
    if (!user_id || !title) {
      return res.status(400).json({ success: false, message: 'user_id and title are required' });
    }
    await pool.query(
      'INSERT INTO journal_entries (user_id, title, content) VALUES (?, ?, ?)',
      [user_id, title, content || null]
    );
    res.json({ success: true, message: 'Journal entry created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create journal entry' });
  }
};

// Get all journal entries for a user
exports.getEntries = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, entries: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch journal entries' });
  }
};

// Update a journal entry
exports.updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    await pool.query(
      'UPDATE journal_entries SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, id]
    );
    res.json({ success: true, message: 'Journal entry updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update journal entry' });
  }
};

// Delete a journal entry
exports.deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM journal_entries WHERE id = ?', [id]);
    res.json({ success: true, message: 'Journal entry deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete journal entry' });
  }
}; 