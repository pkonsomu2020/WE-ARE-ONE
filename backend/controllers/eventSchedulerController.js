const { supabase, supabaseAdmin } = require('../config/database');
const { Resend } = require('resend');
const notificationService = require('../services/notificationService');
require('dotenv').config();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// ─────────────────────────────────────────────────────────────
// RESEND PLAN DETECTION
// Free tier  → 100 emails/day, send one-by-one with 600 ms gap
// Pro tier   → no daily cap,   use Batch API (up to 100/call)
//
// Set RESEND_PLAN=pro in your .env when you upgrade.
// ─────────────────────────────────────────────────────────────
const IS_PRO_PLAN = (process.env.RESEND_PLAN || 'free').toLowerCase() === 'pro';
console.log(`📧 Resend plan detected: ${IS_PRO_PLAN ? 'PRO (batch sending enabled)' : 'FREE (sequential sending)'}`);

// Email validation and filtering function
const validateAndFilterEmails = (recipients) => {
  const validEmails = [];
  const invalidEmails = [];

  // Deduplicate by email address first
  const seen = new Set();

  recipients.forEach(recipient => {
    const email = (recipient.email || '').trim().toLowerCase();

    // Skip empty
    if (!email) {
      invalidEmails.push({ ...recipient, reason: 'Empty email address' });
      return;
    }

    // Skip duplicates
    if (seen.has(email)) {
      console.log(`⚠️ Skipping duplicate email: ${email}`);
      return;
    }
    seen.add(email);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      invalidEmails.push({ ...recipient, reason: 'Invalid email format' });
      return;
    }

    // Check for non-ASCII characters (Resend requirement)
    // eslint-disable-next-line no-control-regex
    const asciiRegex = /^[\x00-\x7F]*$/;
    if (!asciiRegex.test(email)) {
      console.log(`⚠️ Skipping email with non-ASCII characters: ${email}`);
      invalidEmails.push({ ...recipient, reason: 'Contains non-ASCII characters' });
      return;
    }

    // Store normalised email back on the object
    validEmails.push({ ...recipient, email });
  });

  if (invalidEmails.length > 0) {
    console.log(`⚠️ Skipping ${invalidEmails.length} invalid/duplicate emails:`,
      invalidEmails.map(e => `${e.email} (${e.reason})`));
  }

  return { validEmails, invalidEmails };
};

// Get all admin profiles for notifications
const getAllAdminProfiles = async () => {
  try {
    const { data: profiles, error } = await supabase
      .from('admin_profiles')
      .select('id, full_name, email, phone_number, email_notifications')
      .eq('status', 'active')
      .eq('email_notifications', true);

    if (error) {
      console.error('Error fetching admin profiles:', error);
      return [];
    }

    console.log(`✅ Found ${profiles?.length || 0} admin profiles for notifications`);
    return profiles || [];
  } catch (error) {
    console.error('Error fetching admin profiles:', error);
    return [];
  }
};

// Check if date/time slot is available (prevent double booking)
const checkDateAvailability = async (startDateTime, endDateTime, excludeEventId = null) => {
  try {
    const startISO = new Date(startDateTime).toISOString();
    const endISO = new Date(endDateTime).toISOString();
    
    let query = supabase
      .from('scheduled_events')
      .select('id, title, start_datetime, end_datetime')
      .neq('status', 'cancelled');
    
    if (excludeEventId) {
      query = query.neq('id', excludeEventId);
    }
    
    const { data: allEvents, error } = await query;
    
    if (error) {
      console.error('Error checking date availability:', error);
      return [];
    }
    
    // Filter for conflicts in JavaScript since Supabase OR queries can be complex
    const conflicts = (allEvents || []).filter(event => {
      const eventStart = new Date(event.start_datetime);
      const eventEnd = new Date(event.end_datetime);
      const newStart = new Date(startISO);
      const newEnd = new Date(endISO);
      
      // Check for overlap: events overlap if one starts before the other ends
      return (
        (newStart < eventEnd && newEnd > eventStart) ||
        (eventStart < newEnd && eventEnd > newStart)
      );
    });
    
    return conflicts;
  } catch (error) {
    console.error('Error checking date availability:', error);
    return [];
  }
};

// ─────────────────────────────────────────────────────────────
// EMAIL TEMPLATES
// ─────────────────────────────────────────────────────────────
const getEmailTemplates = (event) => ({
  invitation: {
    subject: `📅 New ${event.type === 'organization_event' ? 'Organization Event' : event.type === 'meeting' ? 'Meeting' : 'Event'}: ${event.title}`,
    getBody: (recipient) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">We Are One (WAO)</h1>
          <p style="color: white; margin: 5px 0;">Event Invitation</p>
        </div>
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">📅 ${event.title}</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>📅 Date & Time:</strong> ${new Date(event.start_datetime).toLocaleString()}</p>
            <p><strong>⏰ Duration:</strong> ${new Date(event.start_datetime).toLocaleString()} - ${new Date(event.end_datetime).toLocaleString()}</p>
            <p><strong>📍 Location:</strong> ${event.location || 'TBD'}</p>
            ${event.meeting_link ? `<p><strong>🔗 Meeting Link:</strong> <a href="${event.meeting_link}">${event.meeting_link}</a></p>` : ''}
            <p><strong>📝 Type:</strong> ${event.type.replace(/_/g, ' ').toUpperCase()}</p>
          </div>
          ${event.description ? `
            <div style="margin-bottom: 20px;">
              <h3 style="color: #333;">📋 Description:</h3>
              <p style="color: #666; line-height: 1.6;">${event.description}</p>
            </div>
          ` : ''}
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #2d5a2d;"><strong>📧 This invitation was sent to:</strong> ${recipient.email}</p>
            <p style="margin: 5px 0 0 0; color: #2d5a2d;">Please mark your calendar and prepare accordingly.</p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">If you have any questions, please contact the admin team.</p>
          </div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #666; margin: 0;">We Are One (WAO) - Mental Health Support Community</p>
          <p style="color: #999; margin: 5px 0 0 0; font-size: 12px;">This is an automated notification from the WAO Event Scheduler</p>
        </div>
      </div>
    `
  },
  reminder: {
    subject: `⏰ Reminder: ${event.title} - Tomorrow`,
    getBody: (recipient) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ffc107, #ff8f00); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">⏰ Event Reminder</h1>
          <p style="color: white; margin: 5px 0;">We Are One (WAO)</p>
        </div>
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">📅 ${event.title}</h2>
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #856404; margin-top: 0;">⚠️ Event Tomorrow!</h3>
            <p style="color: #856404; margin-bottom: 0;">Don't forget about this upcoming ${event.type.replace(/_/g, ' ')}.</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>📅 Date & Time:</strong> ${new Date(event.start_datetime).toLocaleString()}</p>
            <p><strong>⏰ Duration:</strong> ${new Date(event.start_datetime).toLocaleString()} - ${new Date(event.end_datetime).toLocaleString()}</p>
            <p><strong>📍 Location:</strong> ${event.location || 'TBD'}</p>
            ${event.meeting_link ? `<p><strong>🔗 Meeting Link:</strong> <a href="${event.meeting_link}">${event.meeting_link}</a></p>` : ''}
          </div>
          ${event.description ? `
            <div style="margin-bottom: 20px;">
              <h3 style="color: #333;">📋 Agenda:</h3>
              <p style="color: #666; line-height: 1.6;">${event.description}</p>
            </div>
          ` : ''}
          <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #155724;"><strong>✅ Action Required:</strong></p>
            <p style="margin: 5px 0 0 0; color: #155724;">Please prepare any necessary materials and confirm your attendance.</p>
          </div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #666; margin: 0;">We Are One (WAO) - Mental Health Support Community</p>
          <p style="color: #999; margin: 5px 0 0 0; font-size: 12px;">This is an automated reminder from the WAO Event Scheduler</p>
        </div>
      </div>
    `
  }
});

// ─────────────────────────────────────────────────────────────
// HELPER: bulk-insert notification logs in one DB call
// ─────────────────────────────────────────────────────────────
const bulkLogNotifications = async (rows) => {
  if (!rows || rows.length === 0) return;
  const { error } = await supabase.from('event_notifications').insert(rows);
  if (error) console.error('⚠️ Failed to bulk-log notifications:', error.message);
};

// ─────────────────────────────────────────────────────────────
// CORE SEND FUNCTION
// Supports two modes controlled by RESEND_PLAN env var:
//
//  FREE  → sequential, 1 email per 600 ms (≤100/day limit)
//  PRO   → Resend Batch API, 100 emails per API call,
//           batches separated by 200 ms to respect 5 req/s
//
// All successes AND failures are logged to event_notifications.
// ─────────────────────────────────────────────────────────────
const sendEventNotification = async (event, notificationType, recipients) => {
  const templates = getEmailTemplates(event);
  const template = templates[notificationType];
  if (!template) return { successCount: 0, failureCount: 0, totalCount: 0 };

  // Validate + deduplicate
  const { validEmails, invalidEmails } = validateAndFilterEmails(recipients);

  let successCount = 0;
  let failureCount = invalidEmails.length;

  // Pre-build log rows for invalid emails so they are always recorded
  const failedLogRows = invalidEmails.map(r => ({
    event_id: event.id,
    notification_type: notificationType,
    recipient_email: r.email || 'unknown',
    recipient_name: r.full_name || r.name || r.email || 'Unknown',
    sent_at: new Date().toISOString(),
    email_subject: template.subject,
    email_status: 'failed',
    error_message: r.reason || 'Invalid email'
  }));
  await bulkLogNotifications(failedLogRows);

  console.log(`📧 Sending ${notificationType} to ${validEmails.length} valid recipients via Resend ${IS_PRO_PLAN ? 'PRO (batch)' : 'FREE (sequential)'}`);

  if (IS_PRO_PLAN) {
    // ── PRO: Batch API ──────────────────────────────────────
    // Resend batch allows up to 100 emails per call.
    // We chunk the list and fire each chunk as one API request.
    const BATCH_SIZE = 100;

    for (let i = 0; i < validEmails.length; i += BATCH_SIZE) {
      const chunk = validEmails.slice(i, i + BATCH_SIZE);

      // Build the batch payload — one object per recipient
      const batchPayload = chunk.map(recipient => ({
        from: 'We Are One Events <events@weareone.co.ke>',
        to: [recipient.email],
        subject: template.subject,
        html: template.getBody(recipient)
      }));

      try {
        // Small pause between batches to stay within 5 req/s rate limit
        if (i > 0) await new Promise(resolve => setTimeout(resolve, 200));

        const { data: batchData, error: batchError } = await resend.batch.send(batchPayload);

        const logRows = [];

        if (batchError) {
          // Entire batch failed
          console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, batchError.message);
          failureCount += chunk.length;
          chunk.forEach(recipient => {
            logRows.push({
              event_id: event.id,
              notification_type: notificationType,
              recipient_email: recipient.email,
              recipient_name: recipient.full_name || recipient.name || recipient.email,
              sent_at: new Date().toISOString(),
              email_subject: template.subject,
              email_status: 'failed',
              error_message: batchError.message || 'Batch send failed'
            });
          });
        } else {
          // batchData is an array of results, one per email in the batch
          const results = Array.isArray(batchData) ? batchData : (batchData?.data || []);

          chunk.forEach((recipient, idx) => {
            const result = results[idx];
            const sent = result && !result.error;
            if (sent) {
              successCount++;
              console.log(`✅ [PRO] Email sent to ${recipient.email}`);
            } else {
              failureCount++;
              console.error(`❌ [PRO] Failed for ${recipient.email}:`, result?.error?.message || 'Unknown error');
            }
            logRows.push({
              event_id: event.id,
              notification_type: notificationType,
              recipient_email: recipient.email,
              recipient_name: recipient.full_name || recipient.name || recipient.email,
              sent_at: new Date().toISOString(),
              email_subject: template.subject,
              email_status: sent ? 'sent' : 'failed',
              error_message: sent ? null : (result?.error?.message || 'Batch item failed')
            });
          });
        }

        // Bulk-log this batch's results in one DB call
        await bulkLogNotifications(logRows);

      } catch (err) {
        console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} threw an exception:`, err.message);
        failureCount += chunk.length;
        const logRows = chunk.map(recipient => ({
          event_id: event.id,
          notification_type: notificationType,
          recipient_email: recipient.email,
          recipient_name: recipient.full_name || recipient.name || recipient.email,
          sent_at: new Date().toISOString(),
          email_subject: template.subject,
          email_status: 'failed',
          error_message: err.message
        }));
        await bulkLogNotifications(logRows);
      }
    }

  } else {
    // ── FREE: Sequential with 600 ms delay ─────────────────
    for (let i = 0; i < validEmails.length; i++) {
      const recipient = validEmails[i];

      if (i > 0) await new Promise(resolve => setTimeout(resolve, 600));

      try {
        const { data, error } = await resend.emails.send({
          from: 'We Are One Events <events@weareone.co.ke>',
          to: [recipient.email],
          subject: template.subject,
          html: template.getBody(recipient)
        });

        const sent = !error;
        if (sent) {
          successCount++;
          console.log(`✅ [FREE] Email sent to ${recipient.email} - ID: ${data.id}`);
        } else {
          failureCount++;
          console.error(`❌ [FREE] Failed to send to ${recipient.email}:`, error);
        }

        await supabase.from('event_notifications').insert({
          event_id: event.id,
          notification_type: notificationType,
          recipient_email: recipient.email,
          recipient_name: recipient.full_name || recipient.name || recipient.email,
          sent_at: new Date().toISOString(),
          email_subject: template.subject,
          email_status: sent ? 'sent' : 'failed',
          error_message: sent ? null : (error?.message || JSON.stringify(error))
        });

      } catch (err) {
        failureCount++;
        console.error(`❌ [FREE] Exception sending to ${recipient.email}:`, err.message);
        await supabase.from('event_notifications').insert({
          event_id: event.id,
          notification_type: notificationType,
          recipient_email: recipient.email,
          recipient_name: recipient.full_name || recipient.name || recipient.email,
          sent_at: new Date().toISOString(),
          email_subject: template.subject,
          email_status: 'failed',
          error_message: err.message
        });
      }
    }
  }

  console.log(`📧 Email summary [${IS_PRO_PLAN ? 'PRO' : 'FREE'}]: ${successCount} sent, ${failureCount} failed out of ${recipients.length} total`);
  return { successCount, failureCount, totalCount: recipients.length };
};

// ─────────────────────────────────────────────────────────────
// CANCELLATION EMAILS  (also uses batch on Pro plan)
// ─────────────────────────────────────────────────────────────
const sendEventCancellationNotification = async (event, recipients) => {
  const subject = `🚫 Event Cancelled: ${event.title}`;
  const getBody = (recipient) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #dc3545, #c82333); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">🚫 Event Cancelled</h1>
        <p style="color: white; margin: 5px 0;">We Are One (WAO)</p>
      </div>
      <div style="padding: 30px; background: white;">
        <h2 style="color: #333; margin-bottom: 20px;">📅 ${event.title}</h2>
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #721c24; margin-top: 0;">⚠️ Event Cancellation Notice</h3>
          <p style="color: #721c24; margin-bottom: 0;">This event has been cancelled and will no longer take place as scheduled.</p>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">📋 Original Event Details:</h3>
          <p><strong>📅 Date & Time:</strong> ${new Date(event.start_datetime).toLocaleString()}</p>
          <p><strong>⏰ Duration:</strong> ${new Date(event.start_datetime).toLocaleString()} - ${new Date(event.end_datetime).toLocaleString()}</p>
          <p><strong>📍 Location:</strong> ${event.location || 'TBD'}</p>
          ${event.meeting_link ? `<p><strong>🔗 Meeting Link:</strong> <span style="text-decoration: line-through;">${event.meeting_link}</span> (No longer active)</p>` : ''}
          <p><strong>📝 Type:</strong> ${event.type.replace(/_/g, ' ').toUpperCase()}</p>
        </div>
        ${event.description ? `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">📋 Original Description:</h3>
            <p style="color: #666; line-height: 1.6;">${event.description}</p>
          </div>
        ` : ''}
        <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #0c5460;"><strong>📧 Notification sent to:</strong> ${recipient.email}</p>
          <p style="margin: 5px 0 0 0; color: #0c5460;">Please update your calendar and notify any external participants if applicable.</p>
        </div>
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #856404;"><strong>📝 Action Required:</strong></p>
          <p style="margin: 5px 0 0 0; color: #856404;">
            • Remove this event from your calendar<br>
            • Inform any external participants you may have invited<br>
            • Contact the admin team if you have questions about the cancellation
          </p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666;">If you have any questions about this cancellation, please contact the admin team.</p>
        </div>
      </div>
      <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
        <p style="color: #666; margin: 0;">We Are One (WAO) - Mental Health Support Community</p>
        <p style="color: #999; margin: 5px 0 0 0; font-size: 12px;">This is an automated cancellation notification from the WAO Event Scheduler</p>
      </div>
    </div>
  `;

  const { validEmails, invalidEmails } = validateAndFilterEmails(recipients);
  let successCount = 0;
  let failureCount = invalidEmails.length;

  console.log(`📧 Sending cancellation to ${validEmails.length} valid recipients [${IS_PRO_PLAN ? 'PRO batch' : 'FREE sequential'}]`);

  if (IS_PRO_PLAN) {
    const BATCH_SIZE = 100;
    for (let i = 0; i < validEmails.length; i += BATCH_SIZE) {
      const chunk = validEmails.slice(i, i + BATCH_SIZE);
      const batchPayload = chunk.map(r => ({
        from: 'We Are One Events <events@weareone.co.ke>',
        to: [r.email],
        subject,
        html: getBody(r)
      }));
      try {
        if (i > 0) await new Promise(resolve => setTimeout(resolve, 200));
        const { data: batchData, error: batchError } = await resend.batch.send(batchPayload);
        if (batchError) {
          console.error(`❌ Cancellation batch failed:`, batchError.message);
          failureCount += chunk.length;
        } else {
          const results = Array.isArray(batchData) ? batchData : (batchData?.data || []);
          chunk.forEach((r, idx) => {
            if (results[idx] && !results[idx].error) {
              successCount++;
              console.log(`✅ [PRO] Cancellation sent to ${r.email}`);
            } else {
              failureCount++;
              console.error(`❌ [PRO] Cancellation failed for ${r.email}`);
            }
          });
        }
      } catch (err) {
        console.error(`❌ Cancellation batch exception:`, err.message);
        failureCount += chunk.length;
      }
    }
  } else {
    for (let i = 0; i < validEmails.length; i++) {
      const recipient = validEmails[i];
      if (i > 0) await new Promise(resolve => setTimeout(resolve, 600));
      try {
        const { data, error } = await resend.emails.send({
          from: 'We Are One Events <events@weareone.co.ke>',
          to: [recipient.email],
          subject,
          html: getBody(recipient)
        });
        if (error) {
          console.error(`❌ [FREE] Cancellation failed for ${recipient.email}:`, error);
          failureCount++;
        } else {
          console.log(`✅ [FREE] Cancellation sent to ${recipient.email} - ID: ${data.id}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ [FREE] Cancellation exception for ${recipient.email}:`, err.message);
        failureCount++;
      }
    }
  }

  console.log(`📧 Cancellation summary [${IS_PRO_PLAN ? 'PRO' : 'FREE'}]: ${successCount} sent, ${failureCount} failed out of ${recipients.length} total`);
  return { successCount, failureCount, totalCount: recipients.length };
};

// Create new event
const createEvent = async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      date,
      startTime,
      endTime,
      location,
      meetingLink,
      attendees,
      isRecurring,
      recurrencePattern
    } = req.body;

    // Validate required fields
    if (!title || !type || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Title, type, date, start time, and end time are required'
      });
    }

    // Create datetime objects
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    // Validate datetime
    if (startDateTime >= endDateTime) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Check for conflicts (prevent double booking)
    const conflicts = await checkDateAvailability(startDateTime, endDateTime);
    if (conflicts.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Time slot conflicts with existing event: "${conflicts[0].title}"`,
        conflictingEvent: conflicts[0]
      });
    }

    // Get the admin's full name from admin_users table
    let adminName = 'Admin';
    let adminEmail = null;
    
    if (req.adminId) {
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('full_name, email')
        .eq('id', req.adminId)
        .single();
      
      if (!adminError && adminUser) {
        // Extract first name from full name (e.g., "Mary Deckline" -> "Mary")
        adminName = adminUser.full_name ? adminUser.full_name.split(' ')[0] : 'Admin';
        adminEmail = adminUser.email;
        console.log(`✅ Event created by: ${adminName} (${adminEmail})`);
      }
    }

    // Insert the event
    const { data: eventData, error: eventError } = await supabase
      .from('scheduled_events')
      .insert({
        title,
        type,
        description,
        start_datetime: startDateTime.toISOString(),
        end_datetime: endDateTime.toISOString(),
        location,
        meeting_link: meetingLink,
        created_by: adminName,
        created_by_profile_id: req.adminId || null,
        created_by_name: adminName,
        created_by_email: adminEmail,
        updated_by_profile_id: null,
        is_recurring: isRecurring || false,
        recurrence_pattern: recurrencePattern || null,
        status: 'scheduled',
        reminder_sent: false,
        reminder_sent_at: null
      })
      .select()
      .single();

    if (eventError) {
      console.error('Event creation error:', eventError);
      throw new Error(`Failed to create event: ${eventError.message}`);
    }

    const eventId = eventData.id;

    // Get all admin profiles for notifications
    const adminProfiles = await getAllAdminProfiles();

    // Add admin attendees
    if (adminProfiles.length > 0) {
      const adminAttendees = adminProfiles.map(admin => ({
        event_id: eventId,
        admin_profile_id: admin.id,
        attendance_status: 'invited',
        notification_sent: false
      }));

      const { error: attendeesError } = await supabase
        .from('event_attendees')
        .insert(adminAttendees);

      if (attendeesError) {
        console.error('Error adding admin attendees:', attendeesError);
      }
    }

    // Add external attendees if provided
    if (attendees && attendees.trim()) {
      const externalAttendees = attendees.split(',').map(email => email.trim()).filter(email => email);
      if (externalAttendees.length > 0) {
        const externalAttendeesData = externalAttendees.map(email => ({
          event_id: eventId,
          external_email: email,
          external_name: email, // Use email as name for external attendees
          attendance_status: 'invited',
          notification_sent: false
        }));

        const { error: externalError } = await supabase
          .from('event_attendees')
          .insert(externalAttendeesData);

        if (externalError) {
          console.error('Error adding external attendees:', externalError);
        }
      }
    }

    // Create automatic reminders
    const reminderTimes = [
      { type: '24_hours', hours: 24 },
      { type: '1_hour', hours: 1 }
    ];

    const reminders = [];
    for (const reminder of reminderTimes) {
      const reminderDateTime = new Date(startDateTime.getTime() - (reminder.hours * 60 * 60 * 1000));
      
      // Only create reminder if it's in the future
      if (reminderDateTime > new Date()) {
        reminders.push({
          event_id: eventId,
          reminder_type: reminder.type,
          reminder_datetime: reminderDateTime.toISOString(),
          is_sent: false
        });
      }
    }

    if (reminders.length > 0) {
      const { error: remindersError } = await supabase
        .from('event_reminders')
        .insert(reminders);

      if (remindersError) {
        console.error('Error creating reminders:', remindersError);
      }
    }

    // Create notification for event creation
    await notificationService.createEventNotification(title, date, startTime);

    // ── Build recipient list based on event type ──────────────
    let allRecipients = [];

    if (type === 'organization_event') {
      // Organization Event → ALL admins (admin_users) + ALL regular users
      console.log('📧 Organization Event: Fetching ALL admins and ALL users...');

      // 1. All admin_users (the actual login accounts, not just admin_profiles)
      const { data: allAdminUsers, error: adminUsersError } = await supabase
        .from('admin_users')
        .select('id, email, full_name');

      if (adminUsersError) {
        console.error('⚠️ Error fetching admin_users:', adminUsersError.message);
      } else {
        console.log(`✅ Found ${allAdminUsers?.length || 0} admin users`);
      }

      // 2. All regular users
      const { data: regularUsers, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name');

      if (usersError) {
        console.error('⚠️ Error fetching regular users:', usersError.message);
      } else {
        console.log(`✅ Found ${regularUsers?.length || 0} regular users`);
      }

      // Merge both lists — validateAndFilterEmails will deduplicate
      allRecipients = [
        ...(allAdminUsers || []).map(a => ({
          email: a.email,
          full_name: a.full_name || a.email,
          name: a.full_name || a.email
        })),
        ...(regularUsers || []).map(u => ({
          email: u.email,
          full_name: u.full_name || u.email,
          name: u.full_name || u.email
        }))
      ];

      console.log(`📧 Organization Event total before dedup: ${allRecipients.length}`);

    } else {
      // Internal Meeting / Reminder → admins only (admin_profiles with email_notifications=true)
      console.log(`📧 ${type === 'meeting' ? 'Internal Meeting' : 'Reminder'}: Sending to admins ONLY`);
      allRecipients = adminProfiles;
    }

    // Add any manually specified external attendees (all event types)
    if (attendees && attendees.trim()) {
      const externalAttendees = attendees.split(',')
        .map(e => e.trim())
        .filter(e => e);
      if (externalAttendees.length > 0) {
        allRecipients = [
          ...allRecipients,
          ...externalAttendees.map(email => ({ email, name: email, full_name: email }))
        ];
      }
    }

    console.log(`📧 Total recipients: ${allRecipients.length} (Event type: ${type})`);

    // Simplified email sending for testing
    let emailResults = { successCount: 0, failureCount: 0, totalCount: allRecipients.length };
    
    try {
      // Send emails with proper rate limiting and error handling
      emailResults = await sendEventNotification(eventData, 'invitation', allRecipients);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue with event creation even if emails fail
      emailResults = { successCount: 0, failureCount: allRecipients.length, totalCount: allRecipients.length };
    }

    // Log activity to admin_activity_log
    try {
      const activityLogService = require('../services/activityLogService');
      
      // Get admin profile ID from admin_profiles table
      let adminProfileId = null;
      if (req.adminId) {
        const { data: adminProfile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('id')
          .eq('user_id', req.adminId)
          .single();
        
        if (!profileError && adminProfile) {
          adminProfileId = adminProfile.id;
        }
      }
      
      if (adminProfileId) {
        await activityLogService.logActivity({
          adminProfileId: adminProfileId,
          action: 'event_created',
          description: `${adminName} created event: ${title} - ${date}`,
          ipAddress: req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown',
          userAgent: req.headers['user-agent'] || 'unknown'
        });
        console.log('✅ Activity logged for event creation');
      }
    } catch (activityError) {
      console.error('⚠️ Failed to log activity (non-blocking):', activityError.message);
    }

    res.status(201).json({
      success: true,
      message: `Event created successfully. ${emailResults.successCount} invitations sent, ${emailResults.failureCount} failed.`,
      data: {
        event: eventData,
        attendeesNotified: emailResults.successCount,
        emailResults: {
          sent: emailResults.successCount,
          failed: emailResults.failureCount,
          total: emailResults.totalCount
        }
      }
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    let query = supabase
      .from('scheduled_events')
      .select('*')
      .neq('status', 'cancelled');
    
    if (startDate && endDate) {
      query = query.gte('start_datetime', startDate).lte('start_datetime', endDate);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    query = query.order('start_datetime', { ascending: true });
    
    const { data: events, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Get attendees separately for each event
    const formattedEvents = [];
    
    for (const event of events || []) {
      // Get attendees for this event
      const { data: attendees, error: attendeesError } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', event.id);

      let attendeesList = [];
      let attendeeCount = 0;

      if (!attendeesError && attendees) {
        attendeeCount = attendees.length;
        
        // Get admin profile names for admin attendees
        const adminIds = attendees
          .filter(a => a.admin_profile_id)
          .map(a => a.admin_profile_id);

        let adminProfiles = [];
        if (adminIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('admin_profiles')
            .select('id, full_name')
            .in('id', adminIds);

          if (!profilesError && profiles) {
            adminProfiles = profiles;
          }
        }

        // Build attendees list
        attendeesList = attendees.map(attendee => {
          if (attendee.admin_profile_id) {
            const profile = adminProfiles.find(p => p.id === attendee.admin_profile_id);
            return profile ? profile.full_name : `Admin ${attendee.admin_profile_id}`;
          } else {
            return attendee.external_name || attendee.external_email;
          }
        }).filter(Boolean);
      }

      formattedEvents.push({
        id: event.id,
        title: event.title,
        type: event.type,
        start: event.start_datetime,
        end: event.end_datetime,
        description: event.description,
        location: event.location,
        meetingLink: event.meeting_link,
        attendees: attendeesList,
        attendeeCount: attendeeCount,
        createdBy: event.created_by,
        createdByProfileId: event.created_by_profile_id,
        createdByName: event.created_by_name,
        createdByEmail: event.created_by_email,
        reminderSent: event.reminder_sent === true,
        isRecurring: event.is_recurring === true,
        status: event.status
      });
    }

    res.json({
      success: true,
      data: formattedEvents
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      type,
      description,
      date,
      startTime,
      endTime,
      location,
      meetingLink,
      attendees,
      isRecurring,
      recurrencePattern
    } = req.body;

    // Check if event exists
    const { data: existingEvent, error: fetchError } = await supabase
      .from('scheduled_events')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Create datetime objects if date/time provided
    let startDateTime, endDateTime;
    if (date && startTime && endTime) {
      startDateTime = new Date(`${date}T${startTime}`);
      endDateTime = new Date(`${date}T${endTime}`);

      // Validate datetime
      if (startDateTime >= endDateTime) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time'
        });
      }

      // Check for conflicts (exclude current event)
      const conflicts = await checkDateAvailability(startDateTime, endDateTime, id);
      if (conflicts.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Time slot conflicts with existing event: "${conflicts[0].title}"`,
          conflictingEvent: conflicts[0]
        });
      }
    }

    // Build update object
    const updateData = {};
    if (title) updateData.title = title;
    if (type) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (startDateTime) updateData.start_datetime = startDateTime.toISOString();
    if (endDateTime) updateData.end_datetime = endDateTime.toISOString();
    if (location !== undefined) updateData.location = location;
    if (meetingLink !== undefined) updateData.meeting_link = meetingLink;
    if (isRecurring !== undefined) updateData.is_recurring = isRecurring;
    if (recurrencePattern !== undefined) updateData.recurrence_pattern = recurrencePattern;

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('scheduled_events')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }
    }

    // Log activity to admin_activity_log
    try {
      const activityLogService = require('../services/activityLogService');
      
      // Get admin profile ID and name
      let adminProfileId = null;
      let adminName = 'Admin';
      if (req.adminId) {
        const { data: adminProfile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('id, full_name')
          .eq('user_id', req.adminId)
          .single();
        
        if (!profileError && adminProfile) {
          adminProfileId = adminProfile.id;
          adminName = adminProfile.full_name ? adminProfile.full_name.split(' ')[0] : 'Admin';
        }
      }
      
      if (adminProfileId) {
        await activityLogService.logActivity({
          adminProfileId: adminProfileId,
          action: 'event_updated',
          description: `${adminName} updated event: ${title || existingEvent.title}`,
          ipAddress: req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown',
          userAgent: req.headers['user-agent'] || 'unknown'
        });
        console.log('✅ Activity logged for event update');
      }
    } catch (activityError) {
      console.error('⚠️ Failed to log activity (non-blocking):', activityError.message);
    }

    res.json({
      success: true,
      message: 'Event updated successfully'
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists and get full event details
    const { data: existingEvent, error: fetchError } = await supabase
      .from('scheduled_events')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get all attendees before cancelling
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', id);

    if (attendeesError) {
      console.error('Error fetching attendees for cancellation:', attendeesError);
    }

    // Get admin profiles for admin attendees
    const adminIds = (attendees || [])
      .filter(a => a.admin_profile_id)
      .map(a => a.admin_profile_id);

    let adminProfiles = [];
    if (adminIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('admin_profiles')
        .select('id, full_name, email')
        .in('id', adminIds);

      if (!profilesError && profiles) {
        adminProfiles = profiles;
      }
    }

    // Get all admin profiles for cancellation notification (not just attendees)
    const { data: allAdminProfiles, error: allAdminsError } = await supabase
      .from('admin_profiles')
      .select('id, full_name, email, phone_number')
      .eq('status', 'active')
      .eq('email_notifications', true);

    if (allAdminsError) {
      console.error('Error fetching all admin profiles for cancellation:', allAdminsError);
    }

    // Soft delete by updating status
    const { error: updateError } = await supabase
      .from('scheduled_events')
      .update({ 
        status: 'cancelled'
      })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    // Send cancellation notifications to all admins
    if (allAdminProfiles && allAdminProfiles.length > 0) {
      try {
        console.log(`📧 Sending cancellation notifications to ${allAdminProfiles.length} admins`);
        
        const emailResults = await sendEventCancellationNotification(existingEvent, allAdminProfiles);
        
        console.log(`✅ Cancellation notifications: ${emailResults.successCount} sent, ${emailResults.failureCount} failed`);
        
        // Log the cancellation notification
        const { error: logError } = await supabase
          .from('event_notifications')
          .insert({
            event_id: id,
            notification_type: 'cancellation',
            recipient_email: 'all_admins',
            recipient_name: 'All Admin Team',
            sent_at: new Date().toISOString(),
            email_subject: `🚫 Event Cancelled: ${existingEvent.title}`,
            email_status: emailResults.successCount > 0 ? 'sent' : 'failed',
            error_message: emailResults.failureCount > 0 ? `${emailResults.failureCount} emails failed` : null
          });

        if (logError) {
          console.error('Error logging cancellation notification:', logError);
        }

        // Create system notification for the cancellation
        await notificationService.createNotification({
          title: 'Event Cancelled',
          message: `"${existingEvent.title}" scheduled for ${new Date(existingEvent.start_datetime).toLocaleDateString()} has been cancelled. All admins have been notified.`,
          type: 'warning',
          source: 'event'
        });

        // Log activity to admin_activity_log
        try {
          const activityLogService = require('../services/activityLogService');
          
          // Get admin profile ID from admin_profiles table
          let adminProfileId = null;
          let adminName = 'Admin';
          if (req.adminId) {
            const { data: adminProfile, error: profileError } = await supabase
              .from('admin_profiles')
              .select('id, full_name')
              .eq('user_id', req.adminId)
              .single();
            
            if (!profileError && adminProfile) {
              adminProfileId = adminProfile.id;
              adminName = adminProfile.full_name ? adminProfile.full_name.split(' ')[0] : 'Admin';
            }
          }
          
          if (adminProfileId) {
            await activityLogService.logActivity({
              adminProfileId: adminProfileId,
              action: 'event_deleted',
              description: `${adminName} deleted event #${id}`,
              ipAddress: req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown',
              userAgent: req.headers['user-agent'] || 'unknown'
            });
            console.log('✅ Activity logged for event deletion');
          }
        } catch (activityError) {
          console.error('⚠️ Failed to log activity (non-blocking):', activityError.message);
        }

        res.json({
          success: true,
          message: `Event cancelled successfully. Cancellation notifications sent to ${emailResults.successCount} admins.`,
          data: {
            event: existingEvent,
            notificationResults: {
              sent: emailResults.successCount,
              failed: emailResults.failureCount,
              total: emailResults.totalCount
            }
          }
        });

      } catch (emailError) {
        console.error('Error sending cancellation notifications:', emailError);
        
        // Still return success for the cancellation, but mention email failure
        res.json({
          success: true,
          message: 'Event cancelled successfully, but failed to send some cancellation notifications.',
          data: {
            event: existingEvent,
            notificationResults: {
              sent: 0,
              failed: allAdminProfiles.length,
              total: allAdminProfiles.length,
              error: emailError.message
            }
          }
        });
      }
    } else {
      res.json({
        success: true,
        message: 'Event cancelled successfully',
        data: {
          event: existingEvent
        }
      });
    }

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Send manual reminder
const sendManualReminder = async (req, res) => {
  try {
    const { id } = req.params;

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('scheduled_events')
      .select('*')
      .eq('id', id)
      .eq('status', 'scheduled')
      .single();

    if (eventError || !event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or not scheduled'
      });
    }

    // Get all attendees
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', id);

    if (attendeesError) {
      throw attendeesError;
    }

    // Get admin profiles separately for admin attendees
    const adminIds = (attendees || [])
      .filter(a => a.admin_profile_id)
      .map(a => a.admin_profile_id);

    let adminProfiles = [];
    if (adminIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('admin_profiles')
        .select('id, full_name, email')
        .in('id', adminIds);

      if (!profilesError && profiles) {
        adminProfiles = profiles;
      }
    }

    // Build recipients list
    const recipients = [];
    
    for (const attendee of attendees || []) {
      if (attendee.admin_profile_id) {
        const profile = adminProfiles.find(p => p.id === attendee.admin_profile_id);
        if (profile && profile.email) {
          recipients.push({
            email: profile.email,
            full_name: profile.full_name || `Admin ${attendee.admin_profile_id}`
          });
        }
      } else if (attendee.external_email) {
        recipients.push({
          email: attendee.external_email,
          full_name: attendee.external_name || attendee.external_email
        });
      }
    }

    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid recipients found for this event'
      });
    }

    // Send reminder notifications with rate limiting
    let emailResults = { successCount: 0, failureCount: recipients.length, totalCount: recipients.length };
    
    try {
      emailResults = await sendEventNotification(event, 'reminder', recipients);
    } catch (emailError) {
      console.error('Email sending error in reminder:', emailError);
      // Continue with reminder processing even if emails fail
    }

    // Update notification sent status for attendees
    if (attendees && attendees.length > 0) {
      const { error: updateAttendeesError } = await supabase
        .from('event_attendees')
        .update({ 
          notification_sent: true,
          notification_sent_at: new Date().toISOString()
        })
        .eq('event_id', id);

      if (updateAttendeesError) {
        console.error('Error updating attendees notification status:', updateAttendeesError);
      }
    }

    // Update reminder sent status
    const { error: updateError } = await supabase
      .from('scheduled_events')
      .update({ 
        reminder_sent: true, 
        reminder_sent_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating reminder status:', updateError);
    }

    res.json({
      success: true,
      message: `Reminder processed: ${emailResults.successCount} delivered, ${emailResults.failureCount} failed out of ${recipients.length} recipients`
    });

  } catch (error) {
    console.error('Send manual reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reminder',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Process automatic reminders (to be called by cron job)
const processAutomaticReminders = async (req, res) => {
  try {
    // Get reminders that need to be sent
    const { data: pendingReminders, error: remindersError } = await supabase
      .from('event_reminders')
      .select('*')
      .eq('is_sent', false)
      .lte('reminder_datetime', new Date().toISOString());

    if (remindersError) {
      throw remindersError;
    }

    let processedCount = 0;

    for (const reminder of pendingReminders || []) {
      try {
        // Get event details
        const { data: event, error: eventError } = await supabase
          .from('scheduled_events')
          .select('*')
          .eq('id', reminder.event_id)
          .eq('status', 'scheduled')
          .single();

        if (eventError || !event) {
          console.log(`Event ${reminder.event_id} not found or not scheduled, skipping reminder`);
          continue;
        }

        // Get attendees for this event
        const { data: attendees, error: attendeesError } = await supabase
          .from('event_attendees')
          .select('*')
          .eq('event_id', reminder.event_id);

        if (attendeesError) {
          console.error(`Error getting attendees for event ${reminder.event_id}:`, attendeesError);
          continue;
        }

        // Get admin profiles separately for admin attendees
        const adminIds = (attendees || [])
          .filter(a => a.admin_profile_id)
          .map(a => a.admin_profile_id);

        let adminProfiles = [];
        if (adminIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('admin_profiles')
            .select('id, full_name, email')
            .in('id', adminIds);

          if (!profilesError && profiles) {
            adminProfiles = profiles;
          }
        }

        // Build recipients list
        const recipients = [];
        
        for (const attendee of attendees || []) {
          if (attendee.admin_profile_id) {
            const profile = adminProfiles.find(p => p.id === attendee.admin_profile_id);
            if (profile && profile.email) {
              recipients.push({
                email: profile.email,
                full_name: profile.full_name || `Admin ${attendee.admin_profile_id}`
              });
            }
          } else if (attendee.external_email) {
            recipients.push({
              email: attendee.external_email,
              full_name: attendee.external_name || attendee.external_email
            });
          }
        }

        // Send reminder notifications with rate limiting
        let emailResults = { successCount: 0, failureCount: recipients.length, totalCount: recipients.length };
        
        try {
          emailResults = await sendEventNotification(event, 'reminder', recipients);
        } catch (emailError) {
          console.error('Email sending error in automatic reminder:', emailError);
          // Continue with reminder processing even if emails fail
        }

        // Mark reminder as sent
        const { error: updateReminderError } = await supabase
          .from('event_reminders')
          .update({ 
            is_sent: true, 
            sent_at: new Date().toISOString() 
          })
          .eq('id', reminder.id);

        if (updateReminderError) {
          console.error(`Error updating reminder ${reminder.id}:`, updateReminderError);
        }

        // Update event reminder status if this is the main reminder
        if (reminder.reminder_type === '24_hours') {
          const { error: updateEventError } = await supabase
            .from('scheduled_events')
            .update({ 
              reminder_sent: true, 
              reminder_sent_at: new Date().toISOString() 
            })
            .eq('id', reminder.event_id);

          if (updateEventError) {
            console.error(`Error updating event ${reminder.event_id}:`, updateEventError);
          }
        }

        processedCount++;
        console.log(`✅ Processed reminder for event: ${event.title} (${emailResults.successCount} sent, ${emailResults.failureCount} failed)`);

      } catch (error) {
        console.error(`❌ Failed to process reminder for event ${reminder.event_id}:`, error.message);
      }
    }

    if (res) {
      res.json({
        success: true,
        message: `Processed ${processedCount} reminders`,
        processedCount
      });
    }

    return processedCount;

  } catch (error) {
    console.error('Process automatic reminders error:', error);
    if (res) {
      res.status(500).json({
        success: false,
        message: 'Failed to process reminders',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    return 0;
  }
};

// Get event statistics
const getStats = async (req, res) => {
  try {
    // Get various statistics using Supabase
    const { data: allEvents, error: allEventsError } = await supabase
      .from('scheduled_events')
      .select('*')
      .eq('status', 'scheduled');

    if (allEventsError) {
      throw allEventsError;
    }

    const totalEvents = allEvents ? allEvents.length : 0;

    // Calculate this week's events
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

    const thisWeekEvents = allEvents ? allEvents.filter(event => {
      const eventDate = new Date(event.start_datetime);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    }).length : 0;

    // Count meetings
    const meetingsCount = allEvents ? allEvents.filter(event => event.type === 'meeting').length : 0;

    // Count pending reminders
    const pendingReminders = allEvents ? allEvents.filter(event => 
      !event.reminder_sent && new Date(event.start_datetime) > new Date()
    ).length : 0;

    // Get upcoming events
    const upcomingEvents = allEvents ? allEvents
      .filter(event => new Date(event.start_datetime) > new Date())
      .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime))
      .slice(0, 5)
      .map(event => ({
        id: event.id,
        title: event.title,
        type: event.type,
        start: event.start_datetime,
        end: event.end_datetime,
        location: event.location,
        attendeeCount: 0 // We'll need to implement attendee counting separately
      })) : [];

    res.json({
      success: true,
      data: {
        totalEvents,
        thisWeekEvents,
        meetingsCount,
        pendingReminders,
        upcomingEvents
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  sendManualReminder,
  processAutomaticReminders,
  checkDateAvailability,
  getStats
};