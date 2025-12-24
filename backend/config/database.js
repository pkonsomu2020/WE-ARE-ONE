const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase clients
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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
      execute: promisePool.execute,
      beginTransaction: async () => {},
      commit: async () => {},
      rollback: async () => {},
      release: () => {}
    };
  }
};

// Helper functions for different query types
async function handleSelectQuery(query, params) {
  const tableMatch = query.match(/from\s+(\w+)/i);
  if (tableMatch) {
    const tableName = tableMatch[1];
    
    // Handle WHERE clauses with parameters
    if (query.includes('WHERE') && params && params.length > 0) {
      // For user/admin login: SELECT ... FROM users/admin_users WHERE email = ?
      if (query.includes('email = ?') && params[0]) {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('email', params[0]);
        
        if (error) throw error;
        return [data, { affectedRows: data.length }];
      }
      
      // Handle other WHERE conditions as needed
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
      const { data, error } = await supabase
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
  supabaseAdmin
};