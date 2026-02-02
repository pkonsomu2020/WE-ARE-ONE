const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const [users] = await pool.execute(
      'SELECT id, email, full_name FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const authenticateAdmin = async (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check for JWT token first (preferred method)
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET);
      
      // Check if it's an admin token (has adminId)
      if (decoded.adminId) {
        // Get full admin profile from Supabase
        const { supabase } = require('../config/database');
        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('id, full_name, email')
          .eq('id', decoded.adminId)
          .single();
        
        if (error || !adminUser) {
          console.error('Admin user not found:', error?.message);
          return res.status(401).json({
            success: false,
            message: 'Admin user not found'
          });
        }
        
        // Get admin profile for role information
        const { data: adminProfile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('email', adminUser.email)
          .single();
        
        req.admin = {
          id: adminUser.id,
          email: adminUser.email,
          full_name: adminUser.full_name,
          role: adminProfile?.role || 'Admin',
          method: 'jwt'
        };
        
        return next();
      }
      
      // Also check for role field (legacy support)
      if (decoded.role === 'admin') {
        req.admin = decoded;
        return next();
      }
    } catch (error) {
      // Token invalid, fall back to admin key
      console.log('JWT verification failed, trying admin key:', error.message);
    }
  }

  // Fallback to admin key
  if (adminKey && adminKey === process.env.ADMIN_API_KEY) {
    // For API key auth, set a default super admin
    req.admin = { 
      id: 1,
      email: 'admin@weareone.co.ke',
      role: 'Super Admin', 
      method: 'api_key' 
    };
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Admin authentication required'
  });
};

module.exports = { authenticateToken, authenticateAdmin };