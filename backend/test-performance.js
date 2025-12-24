const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testPerformance() {
  console.log('🔍 Testing Supabase performance...');
  
  try {
    // Test 1: Simple query
    console.log('\n1. Testing simple users query...');
    const start1 = Date.now();
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .limit(10);
    const time1 = Date.now() - start1;
    console.log(`✅ Users query: ${time1}ms, found ${users?.length || 0} users`);
    
    // Test 2: Admin users query
    console.log('\n2. Testing admin_users query...');
    const start2 = Date.now();
    const { data: admins, error: adminsError } = await supabaseAdmin
      .from('admin_users')
      .select('*');
    const time2 = Date.now() - start2;
    console.log(`✅ Admin users query: ${time2}ms, found ${admins?.length || 0} admins`);
    
    // Test 3: Event payments query (this might be slow)
    console.log('\n3. Testing event_payments query...');
    const start3 = Date.now();
    const { data: payments, error: paymentsError } = await supabaseAdmin
      .from('event_payments')
      .select('*')
      .order('created_at', { ascending: false });
    const time3 = Date.now() - start3;
    console.log(`✅ Event payments query: ${time3}ms, found ${payments?.length || 0} payments`);
    
    // Test 4: Check if scheduled_events table exists (might be causing issues)
    console.log('\n4. Testing scheduled_events query...');
    const start4 = Date.now();
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('scheduled_events')
      .select('*')
      .limit(5);
    const time4 = Date.now() - start4;
    
    if (eventsError) {
      console.log(`❌ Scheduled events error: ${eventsError.message}`);
    } else {
      console.log(`✅ Scheduled events query: ${time4}ms, found ${events?.length || 0} events`);
    }
    
    // Test 5: Check admin_profiles table
    console.log('\n5. Testing admin_profiles query...');
    const start5 = Date.now();
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('admin_profiles')
      .select('*')
      .limit(5);
    const time5 = Date.now() - start5;
    
    if (profilesError) {
      console.log(`❌ Admin profiles error: ${profilesError.message}`);
    } else {
      console.log(`✅ Admin profiles query: ${time5}ms, found ${profiles?.length || 0} profiles`);
    }
    
    // Test 6: List all tables to see what exists
    console.log('\n6. Listing all tables...');
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.log(`❌ Tables listing error: ${tablesError.message}`);
    } else {
      console.log(`📋 Available tables: ${tables.map(t => t.table_name).join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
  }
}

testPerformance();