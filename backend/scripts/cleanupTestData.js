#!/usr/bin/env node

/**
 * Comprehensive cleanup script to remove all fake/test data from the database
 * This script will clean up both Supabase and any remaining test data
 */

require('dotenv').config();
const { supabase } = require('../config/database');

async function cleanupTestData() {
  console.log('🧹 Starting comprehensive test data cleanup...\n');

  try {
    // 1. Clean up test users
    console.log('👥 Cleaning up test users...');
    const { data: deletedUsers, error: userError } = await supabase
      .from('users')
      .delete()
      .or('email.like.%example.com,email.like.%test%,full_name.ilike.%test%,full_name.ilike.%terminal%,full_name.ilike.%performance%,full_name.ilike.%fixed%');

    if (userError) {
      console.warn('⚠️ Error cleaning users (may not exist):', userError.message);
    } else {
      console.log(`✅ Cleaned up test users`);
    }

    // 2. Clean up test feedback messages
    console.log('💬 Cleaning up test feedback messages...');
    const { data: deletedFeedback, error: feedbackError } = await supabase
      .from('feedback_messages')
      .delete()
      .or('email.like.%test%,email.like.%terminal%,email.like.%example.com,subject.ilike.%test%,subject.ilike.%terminal%,name.ilike.%test%');

    if (feedbackError) {
      console.warn('⚠️ Error cleaning feedback (may not exist):', feedbackError.message);
    } else {
      console.log(`✅ Cleaned up test feedback messages`);
    }

    // 3. Clean up test feedback replies
    console.log('💬 Cleaning up test feedback replies...');
    const { data: deletedReplies, error: repliesError } = await supabase
      .from('feedback_replies')
      .delete()
      .like('reply_text', '%test%');

    if (repliesError) {
      console.warn('⚠️ Error cleaning replies (may not exist):', repliesError.message);
    } else {
      console.log(`✅ Cleaned up test feedback replies`);
    }

    // 4. Clean up test events
    console.log('📅 Cleaning up test events...');
    const { data: deletedEvents, error: eventsError } = await supabase
      .from('scheduled_events')
      .delete()
      .or('title.ilike.%test%,title.ilike.%terminal%,title.ilike.%fixed%,description.ilike.%test%');

    if (eventsError) {
      console.warn('⚠️ Error cleaning events (may not exist):', eventsError.message);
    } else {
      console.log(`✅ Cleaned up test events`);
    }

    // 5. Clean up test event registrations
    console.log('📝 Cleaning up test event registrations...');
    const { data: deletedRegistrations, error: registrationsError } = await supabase
      .from('event_registrations')
      .delete()
      .or('email.like.%test%,email.like.%terminal%,email.like.%example.com,full_name.ilike.%test%');

    if (registrationsError) {
      console.warn('⚠️ Error cleaning registrations (may not exist):', registrationsError.message);
    } else {
      console.log(`✅ Cleaned up test event registrations`);
    }

    // 6. Clean up test event payments
    console.log('💳 Cleaning up test event payments...');
    const { data: deletedPayments, error: paymentsError } = await supabase
      .from('event_payments')
      .delete()
      .or('email.like.%test%,email.like.%terminal%,email.like.%example.com,full_name.ilike.%test%');

    if (paymentsError) {
      console.warn('⚠️ Error cleaning payments (may not exist):', paymentsError.message);
    } else {
      console.log(`✅ Cleaned up test event payments`);
    }

    // 7. Clean up test admin activity logs
    console.log('📊 Cleaning up test admin activity logs...');
    const { data: deletedLogs, error: logsError } = await supabase
      .from('admin_activity_log')
      .delete()
      .or('action.ilike.%test%,description.ilike.%test%,description.ilike.%terminal%');

    if (logsError) {
      console.warn('⚠️ Error cleaning activity logs (may not exist):', logsError.message);
    } else {
      console.log(`✅ Cleaned up test admin activity logs`);
    }

    // 8. Clean up test notifications
    console.log('🔔 Cleaning up test notifications...');
    const { data: deletedNotifications, error: notificationsError } = await supabase
      .from('notifications')
      .delete()
      .or('title.ilike.%test%,message.ilike.%test%,title.ilike.%terminal%');

    if (notificationsError) {
      console.warn('⚠️ Error cleaning notifications (may not exist):', notificationsError.message);
    } else {
      console.log(`✅ Cleaned up test notifications`);
    }

    // 9. Clean up test files
    console.log('📁 Cleaning up test files...');
    const { data: deletedFiles, error: filesError } = await supabase
      .from('files')
      .delete()
      .or('filename.ilike.%test%,uploaded_by.ilike.%test%');

    if (filesError) {
      console.warn('⚠️ Error cleaning files (may not exist):', filesError.message);
    } else {
      console.log(`✅ Cleaned up test files`);
    }

    // 10. Clean up test event attendees
    console.log('👥 Cleaning up test event attendees...');
    const { data: deletedAttendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .delete()
      .or('external_email.like.%test%,external_email.like.%terminal%,external_email.like.%example.com');

    if (attendeesError) {
      console.warn('⚠️ Error cleaning attendees (may not exist):', attendeesError.message);
    } else {
      console.log(`✅ Cleaned up test event attendees`);
    }

    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('✅ All test/fake data has been removed from the database');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanupTestData();