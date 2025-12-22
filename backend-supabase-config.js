// =====================================================
// WeAreOne Backend Configuration for Supabase PostgreSQL
// Replace your existing database configuration with this
// =====================================================

const { Pool } = require('pg');

// Supabase PostgreSQL Configuration
const supabaseConfig = {
  // Replace these with your actual Supabase credentials
  host: process.env.SUPABASE_DB_HOST || 'db.your-project-ref.supabase.co',
  port: process.env.SUPABASE_DB_PORT || 5432,
  database: process.env.SUPABASE_DB_NAME || 'postgres',
  user: process.env.SUPABASE_DB_USER || 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD || 'your-database-password',
  
  // SSL configuration for Supabase
  ssl: {
    rejectUnauthorized: false
  },
  
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
};

// Create connection pool
const pool = new Pool(supabaseConfig);

// Test database connection
const testConnection = async () => {
  try {
    console.log('🔄 Testing Supabase PostgreSQL connection...');
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    
    console.log('✅ Supabase PostgreSQL connection successful!');
    console.log(`📅 Server time: ${result.rows[0].current_time}`);
    console.log(`🐘 PostgreSQL version: ${result.rows[0].postgres_version.split(' ')[0]}`);
    
    // Test a simple query on our tables
    const tableTest = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'admin_users', 'scheduled_events')
      ORDER BY table_name
    `);
    
    console.log('📊 Found tables:', tableTest.rows.map(row => row.table_name));
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Supabase PostgreSQL connection failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Possible solutions:');
      console.error('   1. Check if SUPABASE_DB_HOST is correct');
      console.error('   2. Verify your Supabase project is active');
      console.error('   3. Check your internet connection');
    } else if (error.code === '28P01') {
      console.error('\n💡 Possible solutions:');
      console.error('   1. Check SUPABASE_DB_PASSWORD is correct');
      console.error('   2. Verify database user permissions');
    } else if (error.code === '3D000') {
      console.error('\n💡 Possible solutions:');
      console.error('   1. Check if SUPABASE_DB_NAME is correct');
      console.error('   2. Verify the database exists');
    }
    
    return false;
  }
};

// Enhanced query helper with PostgreSQL-specific features
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Query executed:', { text, duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

// Transaction helper
const transaction = async (callback) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// PostgreSQL-specific helpers
const helpers = {
  // Convert MySQL LIMIT syntax to PostgreSQL
  limit: (offset = 0, limit = 10) => `LIMIT ${limit} OFFSET ${offset}`,
  
  // PostgreSQL RETURNING clause (useful for INSERT/UPDATE)
  returning: (columns = '*') => `RETURNING ${columns}`,
  
  // PostgreSQL UPSERT (INSERT ... ON CONFLICT)
  upsert: (table, data, conflictColumn, updateColumns) => {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`);
    const updates = updateColumns.map(col => `${col} = EXCLUDED.${col}`);
    
    return {
      text: `
        INSERT INTO ${table} (${columns.join(', ')}) 
        VALUES (${placeholders.join(', ')})
        ON CONFLICT (${conflictColumn}) 
        DO UPDATE SET ${updates.join(', ')}
        RETURNING *
      `,
      values
    };
  },
  
  // PostgreSQL array operations
  arrayContains: (column, value) => `${column} @> ARRAY['${value}']`,
  arrayAppend: (column, value) => `array_append(${column}, '${value}')`,
  
  // PostgreSQL JSON operations
  jsonExtract: (column, path) => `${column}->>'${path}'`,
  jsonContains: (column, value) => `${column} @> '${JSON.stringify(value)}'`,
  
  // PostgreSQL full-text search
  fullTextSearch: (column, searchTerm) => `${column} @@ plainto_tsquery('${searchTerm}')`,
};

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('🔄 Closing Supabase PostgreSQL connection pool...');
  await pool.end();
  console.log('✅ Supabase PostgreSQL connection pool closed');
};

// Handle process termination
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = {
  pool,
  query,
  transaction,
  testConnection,
  helpers,
  gracefulShutdown
};

// =====================================================
// USAGE EXAMPLES
// =====================================================

/*
// Basic query
const users = await query('SELECT * FROM users WHERE email = $1', ['user@example.com']);

// Transaction example
const result = await transaction(async (client) => {
  const user = await client.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', ['John', 'john@example.com']);
  const profile = await client.query('INSERT INTO user_profiles (user_id, bio) VALUES ($1, $2) RETURNING *', [user.rows[0].id, 'Bio text']);
  return { user: user.rows[0], profile: profile.rows[0] };
});

// Upsert example
const upsertQuery = helpers.upsert('users', { email: 'test@example.com', name: 'Test User' }, 'email', ['name']);
const result = await query(upsertQuery.text, upsertQuery.values);

// Pagination example
const page = 1;
const limit = 10;
const offset = (page - 1) * limit;
const users = await query(`SELECT * FROM users ORDER BY created_at DESC ${helpers.limit(offset, limit)}`);

// Full-text search example
const searchResults = await query(`
  SELECT * FROM posts 
  WHERE ${helpers.fullTextSearch('title', 'mental health')} 
  OR ${helpers.fullTextSearch('content', 'mental health')}
`);
*/