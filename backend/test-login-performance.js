const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testLoginPerformance() {
  console.log('🔍 Testing admin login performance...');
  
  try {
    // Test 1: Direct Supabase query for admin user
    console.log('\n1. Testing direct admin user query...');
    const start1 = Date.now();
    const { data: admins, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('id, full_name, email, password_hash')
      .eq('email', 'admin@weareone.co.ke');
    const time1 = Date.now() - start1;
    console.log(`✅ Direct admin query: ${time1}ms, found ${admins?.length || 0} admins`);
    
    if (admins && admins.length > 0) {
      // Test 2: Password verification
      console.log('\n2. Testing password verification...');
      const start2 = Date.now();
      const isValid = await bcrypt.compare('Dela6572@', admins[0].password_hash);
      const time2 = Date.now() - start2;
      console.log(`✅ Password verification: ${time2}ms, valid: ${isValid}`);
    }
    
    // Test 3: Test connection latency
    console.log('\n3. Testing connection latency...');
    const start3 = Date.now();
    const { data: ping, error: pingError } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .limit(1);
    const time3 = Date.now() - start3;
    console.log(`✅ Connection latency: ${time3}ms`);
    
    // Test 4: Multiple rapid queries to test connection pooling
    console.log('\n4. Testing multiple rapid queries...');
    const start4 = Date.now();
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        supabaseAdmin
          .from('admin_users')
          .select('id')
          .limit(1)
      );
    }
    await Promise.all(promises);
    const time4 = Date.now() - start4;
    console.log(`✅ 5 parallel queries: ${time4}ms (avg: ${time4/5}ms per query)`);
    
  } catch (error) {
    console.error('❌ Login performance test failed:', error.message);
  }
}

testLoginPerformance();