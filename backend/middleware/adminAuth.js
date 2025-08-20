const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

module.exports = async function adminAuth(req, res, next) {
  try {
    // 1) Allow shared secret header (legacy/backdoor for CLI and environments)
    const adminKey = req.headers['x-admin-key'];
    if (adminKey && adminKey === process.env.ADMIN_API_KEY) {
      return next();
    }

    // 2) Otherwise require a valid admin JWT
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring('Bearer '.length)
      : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET);
    } catch (_) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    // Confirm admin user exists
    const [rows] = await pool.execute('SELECT id, email FROM admin_users WHERE id = ?', [decoded.adminId]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    req.admin = rows[0];
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

