const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testUserPerformance() {
  console.log('🔍 Testing user authentication performance...');
  
  try {
    // Test 1: User lookup query (login)
    console.log('\n1. Testing user lookup query...');
    const start1 = Date.now();
    const { data: users, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, full_name, email, phone, password_hash')
      .eq('email', 'pkonsomu2021@gmail.com');
    const time1 = Date.now() - start1;
    console.log(`✅ User lookup: ${time1}ms, found ${users?.length || 0} users`);
    
    if (users && users.length > 0) {
      // Test 2: Password verification
      console.log('\n2. Testing password verification...');
      const start2 = Date.now();
      const isValid = await bcrypt.compare('ponsomu756@', users[0].password_hash);
      const time2 = Date.now() - start2;
      console.log(`✅ Password verification: ${time2}ms, valid: ${isValid}`);
    }
    
    // Test 3: Check if user exists query (registration)
    console.log('\n3. Testing user existence check...');
    const start3 = Date.now();
    const { data: existingUsers, error: existError } = await supabaseAdmin
      .from('users')
      .select('id')
      .or(`email.eq.test@example.com,phone.eq.+254700000000`);
    const time3 = Date.now() - start3;
    console.log(`✅ User existence check: ${time3}ms, found ${existingUsers?.length || 0} users`);
    
    // Test 4: Support categories lookup
    console.log('\n4. Testing support categories lookup...');
    const start4 = Date.now();
    const { data: categories, error: catError } = await supabaseAdmin
      .from('support_categories')
      .select('id, name')
      .eq('name', 'Mental Health');
    const time4 = Date.now() - start4;
    console.log(`✅ Support categories: ${time4}ms, found ${categories?.length || 0} categories`);
    
    // Test 5: Count total users (to check table size)
    console.log('\n5. Testing user count...');
    const start5 = Date.now();
    const { count, error: countError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });
    const time5 = Date.now() - start5;
    console.log(`✅ User count: ${time5}ms, total users: ${count}`);
    
    // Test 6: Test bcrypt performance with different rounds
    console.log('\n6. Testing bcrypt performance...');
    const testPassword = 'testpassword123';
    
    const start6a = Date.now();
    const hash10 = await bcrypt.hash(testPassword, 10);
    const time6a = Date.now() - start6a;
    console.log(`✅ bcrypt(10 rounds): ${time6a}ms`);
    
    const start6b = Date.now();
    const hash12 = await bcrypt.hash(testPassword, 12);
    const time6b = Date.now() - start6b;
    console.log(`✅ bcrypt(12 rounds): ${time6b}ms`);
    
    const start6c = Date.now();
    const isValidTest = await bcrypt.compare(testPassword, hash12);
    const time6c = Date.now() - start6c;
    console.log(`✅ bcrypt compare: ${time6c}ms, valid: ${isValidTest}`);
    
  } catch (error) {
    console.error('❌ User performance test failed:', error.message);
  }
}

testUserPerformance();