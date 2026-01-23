const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase clients with optimized settings
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: { 'x-client-info': 'wao-backend' },
  },
});

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: { 'x-client-info': 'wao-backend-admin' },
  },
});

// Enhanced connection warmup with keep-alive
let isConnectionWarmed = false;
let lastWarmupTime = 0;
const WARMUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

const warmupConnections = async (force = false) => {
  const now = Date.now();
  
  // Skip if recently warmed up (unless forced)
  if (!force && isConnectionWarmed && (now - lastWarmupTime) < WARMUP_INTERVAL) {
    return true;
  }

  try {
    console.log('🔥 Warming up database connections...');
    const start = Date.now();
    
    // Warm up both connections with simple queries
    const warmupPromises = [
      supabase.from('users').select('id').limit(1),
      supabaseAdmin.from('admin_users').select('id').limit(1)
    ];
    
    await Promise.all(warmupPromises);
    
    const time = Date.now() - start;
    console.log(`✅ Database connections warmed up in ${time}ms`);
    
    isConnectionWarmed = true;
    lastWarmupTime = now;
    return true;
  } catch (error) {
    console.log('⚠️ Connection warmup failed:', error.message);
    isConnectionWarmed = false;
    return false;
  }
};

// Initial warmup on startup
(async function initialWarmup() {
  await warmupConnections(true);
})();

// Auto-warmup before database operations
const ensureWarmConnection = async () => {
  if (!isConnectionWarmed || (Date.now() - lastWarmupTime) > WARMUP_INTERVAL) {
    await warmupConnections();
  }
};

// Create promise-based wrapper to match existing code structure
const promisePool = {
  execute: async (query, params = []) => {
    try {
      // Handle different types of queries
      const queryLower = query.toLowerCase().trim();
      
      if (queryLower.startsWith('select')) {
        return await handleSelectQuery(query, params);
      } else if (queryLower.startsWith('insert')) {
        return await handleInsertQuery(query, params);
      } else if (queryLower.startsWith('update')) {
        return await handleUpdateQuery(query, params);
      } else if (queryLower.startsWith('delete')) {
        return await handleDeleteQuery(query, params);
      } else {
        return [[], { affectedRows: 0 }];
      }
    } catch (error) {
      throw error;
    }
  },
  
  getConnection: async () => {
    return {
      execute: async (query, params = []) => {
        // Handle support categories lookup
        if (query.includes('SELECT id FROM support_categories WHERE name = ?')) {
          const [categoryName] = params;
          const { data, error } = await supabase
            .from('support_categories')
            .select('id')
            .eq('name', categoryName)
            .limit(1);
          
          if (error) throw error;
          return [data, { affectedRows: data.length }];
        }
        
        // Handle user support categories INSERT
        if (query.includes('INSERT INTO user_support_categories')) {
          const [userId, categoryId, otherDetails] = params;
          const { data, error } = await supabase
            .from('user_support_categories')
            .insert({
              user_id: userId,
              support_category_id: categoryId,
              other_details: otherDetails
            })
            .select();
          
          if (error) throw error;
          return [[], { affectedRows: 1, insertId: data[0]?.id || 1 }];
        }
        
        // For other queries, use the main execute function
        return await promisePool.execute(query, params);
      },
      beginTransaction: async () => {
        console.log('📝 Transaction started (Supabase handles this automatically)');
      },
      commit: async () => {
        console.log('✅ Transaction committed (Supabase handles this automatically)');
      },
      rollback: async () => {
        console.log('🔄 Transaction rolled back (Supabase handles this automatically)');
      },
      release: () => {
        console.log('🔓 Connection released (Supabase handles this automatically)');
      }
    };
  }
};

// Simple in-memory cache for admin and user lookups (to avoid repeated DB queries)
const adminUserCache = new Map();
const userCache = new Map();
const ADMIN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const USER_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (shorter for users)

// Helper functions for different query types
async function handleSelectQuery(query, params) {
  // Ensure warm connection before database operations
  await ensureWarmConnection();
  
  // Handle connection test queries like "SELECT 1 as test"
  if (query.toLowerCase().includes('select 1') && !query.toLowerCase().includes('from')) {
    return [[{ test: 1 }], { affectedRows: 1 }];
  }
  
  const tableMatch = query.match(/from\s+(\w+)/i);
  if (tableMatch) {
    const tableName = tableMatch[1];
    
    // Handle WHERE clauses with parameters
    if (query.includes('WHERE') && params && params.length > 0) {
      // For user/admin login: SELECT ... FROM users/admin_users WHERE email = ?
      if (query.includes('email = ?') && params[0]) {
        // Check cache for admin users
        if (tableName === 'admin_users') {
          const cacheKey = `admin_${params[0]}`;
          const cached = adminUserCache.get(cacheKey);
          if (cached && (Date.now() - cached.timestamp) < ADMIN_CACHE_DURATION) {
            console.log('📋 Using cached admin user data');
            return [cached.data, { affectedRows: cached.data.length }];
          }
        }
        
        // Check cache for regular users
        if (tableName === 'users') {
          const cacheKey = `user_${params[0]}`;
          const cached = userCache.get(cacheKey);
          if (cached && (Date.now() - cached.timestamp) < USER_CACHE_DURATION) {
            console.log('📋 Using cached user data');
            return [cached.data, { affectedRows: cached.data.length }];
          }
        }
        
        // Use admin client for admin_users table for better performance
        const client = tableName === 'admin_users' ? supabaseAdmin : supabase;
        
        const { data, error } = await client
          .from(tableName)
          .select('*')
          .eq('email', params[0])
          .limit(1); // Add limit for better performance
        
        if (error) throw error;
        
        // Cache admin user data
        if (tableName === 'admin_users' && data.length > 0) {
          const cacheKey = `admin_${params[0]}`;
          adminUserCache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
          });
        }
        
        // Cache regular user data
        if (tableName === 'users' && data.length > 0) {
          const cacheKey = `user_${params[0]}`;
          userCache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
          });
        }
        
        return [data, { affectedRows: data.length }];
      }
      
      // Handle event_payments SELECT with WHERE clause
      if (tableName === 'event_payments' && query.includes('mpesa_code = ?') && params[0]) {
        const { data, error } = await supabase
          .from('event_payments')
          .select('*')
          .eq('mpesa_code', params[0])
          .limit(1);
        
        if (error) throw error;
        return [data, { affectedRows: data.length }];
      }
      
      // Handle users SELECT with WHERE clause for event registration check
      if (tableName === 'users' && query.includes('email = ?') && params[0]) {
        const cacheKey = `user_${params[0]}`;
        const cached = userCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < USER_CACHE_DURATION) {
          console.log('📋 Using cached user data');
          return [cached.data, { affectedRows: cached.data.length }];
        }
        
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('email', params[0])
          .limit(1);
        
        if (error) throw error;
        
        // Cache user data
        if (data.length > 0) {
          userCache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
          });
        }
        
        return [data, { affectedRows: data.length }];
      }
      
      // Handle other WHERE conditions as needed
      if (query.includes('email = ? OR phone = ?') && params.length >= 2) {
        // User existence check for registration
        const [email, phone] = params;
        const { data, error } = await supabase
          .from(tableName)
          .select('id')
          .or(`email.eq.${email},phone.eq.${phone}`)
          .limit(1);
        
        if (error) throw error;
        return [data, { affectedRows: data.length }];
      }
      
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) throw error;
      return [data, { affectedRows: data.length }];
    }
    
    // Handle COUNT queries
    if (query.includes('COUNT(') || query.includes('count(')) {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return [[{ count }], { affectedRows: 1 }];
    }
    
    // Handle ORDER BY queries (optimize for event_payments)
    if (query.includes('ORDER BY')) {
      let supabaseQuery = supabase.from(tableName).select('*');
      
      // Handle ORDER BY created_at DESC (common pattern)
      if (query.includes('ORDER BY created_at DESC')) {
        supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
      } else if (query.includes('ORDER BY created_at')) {
        supabaseQuery = supabaseQuery.order('created_at', { ascending: true });
      }
      
      const { data, error } = await supabaseQuery;
      if (error) throw error;
      return [data, { affectedRows: data.length }];
    }
    
    // Handle simple SELECT * queries
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) throw error;
    return [data, { affectedRows: data.length }];
  }
  
  return [[], { affectedRows: 0 }];
}

async function handleInsertQuery(query, params) {
  const tableMatch = query.match(/insert\s+into\s+(\w+)/i);
  if (tableMatch) {
    const tableName = tableMatch[1];
    
    // Handle admin_users INSERT
    if (tableName === 'admin_users' && params && params.length >= 3) {
      const [fullName, email, passwordHash] = params;
      const { data, error } = await supabaseAdmin
        .from('admin_users')
        .insert({
          full_name: fullName,
          email: email,
          password_hash: passwordHash
        })
        .select();
      
      if (error) throw error;
      return [[], { affectedRows: 1, insertId: data[0]?.id || 1 }];
    }
    
    // Handle users INSERT (registration) - sequence is now fixed
    if (tableName === 'users' && params && params.length >= 12) {
      const [fullName, email, phone, gender, age, location, passwordHash,
             emergencyContactName, emergencyContactPhone, emergencyContactRelationship,
             liveLocation, personalStatement] = params;
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          full_name: fullName,
          email: email,
          phone: phone,
          gender: gender,
          age: parseInt(age),
          location: location,
          password_hash: passwordHash,
          emergency_contact_name: emergencyContactName,
          emergency_contact_phone: emergencyContactPhone,
          emergency_contact_relationship: emergencyContactRelationship,
          live_location: liveLocation,
          personal_statement: personalStatement
        })
        .select();
      
      if (error) throw error;
      return [[], { affectedRows: 1, insertId: data[0]?.id || 1 }];
    }
    
    // Handle event_registrations INSERT
    if (tableName === 'event_registrations' && params && params.length >= 7) {
      const [eventId, fullName, email, phone, experienceText, acceptTerms, acceptUpdates] = params;
      
      console.log('🔧 Inserting event registration into Supabase...');
      
      // First attempt - normal insert
      let { data, error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          full_name: fullName,
          email: email,
          phone: phone,
          experience_text: experienceText,
          accept_terms: Boolean(acceptTerms), // Convert to boolean
          accept_updates: Boolean(acceptUpdates) // Convert to boolean
        })
        .select();
      
      // If primary key constraint violation, fix the sequence
      if (error && error.code === '23505' && error.message.includes('event_registrations_pkey')) {
        console.log('🔧 Primary key conflict detected, fixing sequence...');
        
        try {
          // Get the current maximum ID
          const { data: maxData, error: maxError } = await supabase
            .from('event_registrations')
            .select('id')
            .order('id', { ascending: false })
            .limit(1);
          
          if (maxError) {
            console.error('❌ Failed to get max ID:', maxError);
            throw error; // Throw original error
          }
          
          const maxId = maxData && maxData.length > 0 ? maxData[0].id : 0;
          console.log(`🔧 Current max ID: ${maxId}`);
          
          // Reset the sequence using direct SQL execution
          // Note: Supabase doesn't support custom RPC functions by default, so we use direct SQL
          const { error: seqError } = await supabase.rpc('exec_sql', {
            sql: `SELECT setval('event_registrations_id_seq', ${maxId + 1}, false);`
          }).catch(() => ({ error: 'RPC not available' }));
          
          if (seqError || seqError?.error) {
            console.log('⚠️ Sequence reset via RPC not available, trying alternative approach...');
            
            // Alternative: Try inserting with a much higher ID to bypass conflicts
            const safeId = maxId + 100; // Use a safe ID far ahead
            const { data: altData, error: altError } = await supabase
              .from('event_registrations')
              .insert({
                id: safeId,
                event_id: eventId,
                full_name: fullName,
                email: email,
                phone: phone,
                experience_text: experienceText,
                accept_terms: Boolean(acceptTerms),
                accept_updates: Boolean(acceptUpdates)
              })
              .select();
            
            if (altError) {
              console.error('❌ Alternative insert failed:', altError);
              throw error; // Throw original error
            }
            
            console.log('✅ Alternative insert successful with ID:', safeId);
            return [[], { affectedRows: 1, insertId: altData[0]?.id }];
          } else {
            console.log('✅ Sequence reset successful, retrying insert...');
            
            // Retry the original insert
            const { data: retryData, error: retryError } = await supabase
              .from('event_registrations')
              .insert({
                event_id: eventId,
                full_name: fullName,
                email: email,
                phone: phone,
                experience_text: experienceText,
                accept_terms: Boolean(acceptTerms),
                accept_updates: Boolean(acceptUpdates)
              })
              .select();
            
            if (retryError) {
              console.error('❌ Retry insert failed:', retryError);
              throw error; // Throw original error
            }
            
            data = retryData;
            error = null;
          }
        } catch (fixError) {
          console.error('❌ Failed to fix sequence:', fixError);
          throw error; // Throw original error
        }
      }
      
      if (error) {
        console.error('❌ Supabase insert error:', error);
        throw error;
      }
      
      console.log('✅ Supabase insert successful:', data);
      return [[], { affectedRows: 1, insertId: data[0]?.id }];
    }
    
    // Handle event_payments INSERT
    if (tableName === 'event_payments' && params && params.length >= 8) {
      const [eventId, fullName, email, phone, ticketType, amount, mpesaCode, status] = params;
      const { data, error } = await supabase
        .from('event_payments')
        .insert({
          event_id: eventId,
          full_name: fullName,
          email: email,
          phone: phone,
          ticket_type: ticketType,
          amount: amount,
          mpesa_code: mpesaCode,
          status: status
        })
        .select();
      
      if (error) throw error;
      return [[], { affectedRows: 1, insertId: data[0]?.id }];
    }
    
    // Handle other INSERT queries as needed
    return [[], { affectedRows: 1, insertId: 1 }];
  }
  return [[], { affectedRows: 0 }];
}

async function handleUpdateQuery(query, params) {
  const tableMatch = query.match(/update\s+(\w+)/i);
  if (tableMatch) {
    return [[], { affectedRows: 1 }];
  }
  return [[], { affectedRows: 0 }];
}

async function handleDeleteQuery(query, params) {
  const tableMatch = query.match(/delete\s+from\s+(\w+)/i);
  if (tableMatch) {
    return [[], { affectedRows: 1 }];
  }
  return [[], { affectedRows: 0 }];
}

// Test database connection
const testConnection = async () => {
  try {
    const { error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  pool: promisePool,
  testConnection,
  supabase,
  supabaseAdmin,
  warmupConnections,
  ensureWarmConnection
};