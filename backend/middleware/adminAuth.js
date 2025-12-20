const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

module.exports = async function adminAuth(req, res, next) {
  try {
    console.log('🔐 AdminAuth middleware called');
    console.log('🔍 Authorization header:', req.headers['authorization']);
    console.log('🔍 x-admin-key header:', req.headers['x-admin-key'] ? 'Present' : 'Not present');
    
    // 1) PRIORITIZE JWT TOKEN FIRST
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring('Bearer '.length)
      : null;

    if (token) {
      console.log('🎫 JWT token found, using JWT authentication');
      
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET);
        console.log('✅ Token verified successfully');
        console.log('🔍 Decoded token:', { adminId: decoded.adminId, iat: decoded.iat, exp: decoded.exp });
      } catch (jwtError) {
        console.log('❌ Token verification failed:', jwtError.message);
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      }

      // Confirm admin user exists
      console.log('🔍 Looking up admin user with ID:', decoded.adminId);
      const [rows] = await pool.execute('SELECT id, email FROM admin_users WHERE id = ?', [decoded.adminId]);
      
      if (rows.length === 0) {
        console.log('❌ Admin user not found in database');
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      console.log('✅ Admin user found:', rows[0].email);
      
      req.admin = rows[0];
      req.adminId = rows[0].id;
      
      console.log('✅ JWT AdminAuth completed successfully');
      console.log('🔍 Set req.adminId:', req.adminId);
      
      return next();
    }

    // 2) FALLBACK TO ADMIN KEY (only if no JWT token)
    const adminKey = req.headers['x-admin-key'];
    if (adminKey && adminKey === process.env.ADMIN_API_KEY) {
      console.log('🔑 Using admin key authentication (fallback)');
      return next();
    }

    // 3) No valid authentication found
    console.log('❌ No valid authentication provided');
    return res.status(401).json({ success: false, message: 'Unauthorized' });
    
  } catch (e) {
    console.error('❌ AdminAuth middleware error:', e);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

