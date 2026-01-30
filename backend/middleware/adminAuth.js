const jwt = require('jsonwebtoken');
const { supabase } = require('../config/database');

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

      // Confirm admin user exists using Supabase
      console.log('🔍 Looking up admin user with ID:', decoded.adminId);
      const { data: adminUsers, error } = await supabase
        .from('admin_users')
        .select('id, email')
        .eq('id', decoded.adminId);
      
      if (error || !adminUsers || adminUsers.length === 0) {
        console.log('❌ Admin user not found in database:', error?.message);
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      console.log('✅ Admin user found:', adminUsers[0].email);
      
      req.admin = adminUsers[0];
      req.adminId = adminUsers[0].id;
      
      console.log('✅ JWT AdminAuth completed successfully');
      console.log('🔍 Set req.adminId:', req.adminId);
      
      return next();
    }

    // 2) FALLBACK TO ADMIN KEY (only if no JWT token)
    const adminKey = req.headers['x-admin-key'];
    if (adminKey && adminKey === process.env.ADMIN_API_KEY) {
      console.log('🔑 Using admin key authentication (fallback)');
      
      // Set a default admin for API key authentication
      // Get the first admin user as default
      const { data: defaultAdmin, error: defaultError } = await supabase
        .from('admin_users')
        .select('id, email')
        .limit(1);
      
      if (!defaultError && defaultAdmin && defaultAdmin.length > 0) {
        req.admin = defaultAdmin[0];
        req.adminId = defaultAdmin[0].id;
        console.log('✅ Set default admin for API key auth:', defaultAdmin[0].email);
      } else {
        // Fallback if no admin users found
        req.admin = { id: 1, email: 'admin@weareone.co.ke' };
        req.adminId = 1;
        console.log('✅ Set fallback admin for API key auth');
      }
      
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

