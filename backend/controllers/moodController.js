const { pool } = require('../config/database');

// Log a new mood
exports.logMood = async (req, res) => {
  try {
    const { user_id, mood_value, note } = req.body;
    if (!user_id || !mood_value) {
      return res.status(400).json({ success: false, message: 'user_id and mood_value are required' });
    }
    await pool.query(
      'INSERT INTO moods (user_id, mood_value, note) VALUES (?, ?, ?)',
      [user_id, mood_value, note || null]
    );
    res.json({ success: true, message: 'Mood logged successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to log mood' });
  }
};

// Get mood history for a user
exports.getMoodHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM moods WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, moods: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch mood history' });
  }
};

// Delete a mood entry
exports.deleteMood = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM moods WHERE id = ?', [id]);
    res.json({ success: true, message: 'Mood entry deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete mood entry' });
  }
}; 