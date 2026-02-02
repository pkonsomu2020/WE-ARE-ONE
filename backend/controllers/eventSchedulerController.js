const { supabase, supabaseAdmin } = require('../config/database');
const { Resend } = require('resend');
const notificationService = require('../services/notificationService');
require('dotenv').config();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email validation and filtering function
const validateAndFilterEmails = (recipients) => {
  const validEmails = [];
  const invalidEmails = [];
  
  recipients.forEach(recipient => {
    const email = recipient.email;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      invalidEmails.push({ ...recipient, reason: 'Invalid email format' });
      return;
    }
    
    // For now, we'll try to send to all valid emails
    // Resend will handle domain verification errors
    validEmails.push(recipient);
  });
  
  if (invalidEmails.length > 0) {
    console.log(`⚠️ Skipping ${invalidEmails.length} invalid emails:`, invalidEmails.map(e => e.email));
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

// Send event notification emails with rate limiting and domain handling
const sendEventNotification = async (event, notificationType, recipients) => {
  const emailTemplates = {
    invitation: {
      subject: `📅 New ${event.type === 'meeting' ? 'Meeting' : 'Event'}: ${event.title}`,
      getBody: (event, recipient) => `
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
              <p><strong>📝 Type:</strong> ${event.type.replace('_', ' ').toUpperCase()}</p>
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
      getBody: (event, recipient) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ffc107, #ff8f00); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">⏰ Event Reminder</h1>
            <p style="color: white; margin: 5px 0;">We Are One (WAO)</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">📅 ${event.title}</h2>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #856404; margin-top: 0;">⚠️ Event Tomorrow!</h3>
              <p style="color: #856404; margin-bottom: 0;">Don't forget about this upcoming ${event.type.replace('_', ' ')}.</p>
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
  };

  const template = emailTemplates[notificationType];
  if (!template) return { successCount: 0, failureCount: 0, totalCount: 0 };

  // Validate and filter emails
  const { validEmails, invalidEmails } = validateAndFilterEmails(recipients);
  
  let successCount = 0;
  let failureCount = invalidEmails.length; // Count invalid emails as failures

  // Process emails with rate limiting (1 email per 600ms to stay under 2/second limit)
  for (let i = 0; i < validEmails.length; i++) {
    const recipient = validEmails[i];
    
    try {
      // Add delay between emails to respect rate limits (600ms = 1.67 emails/second)
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      const { data, error } = await resend.emails.send({
        from: 'We Are One Events <weareone0624@gmail.com>',
        to: [recipient.email],
        subject: template.subject,
        html: template.getBody(event, recipient)
      });

      if (error) {
        console.error(`❌ Failed to send email to ${recipient.email}:`, error);
        failureCount++;
        
        // Log the failed notification
        await supabase
          .from('event_notifications')
          .insert({
            event_id: event.id,
            notification_type: notificationType,
            recipient_email: recipient.email,
            recipient_name: recipient.full_name || recipient.name,
            sent_at: new Date().toISOString(),
            email_subject: template.subject,
            email_status: 'failed',
            error_message: error.message || JSON.stringify(error)
          })
          .catch(logError => console.error('Error logging failed notification:', logError));
        
        continue;
      }

      console.log(`✅ Email sent to ${recipient.email} - Email ID: ${data.id}`);
      successCount++;

      // Log the successful notification
      await supabase
        .from('event_notifications')
        .insert({
          event_id: event.id,
          notification_type: notificationType,
          recipient_email: recipient.email,
          recipient_name: recipient.full_name || recipient.name,
          sent_at: new Date().toISOString(),
          email_subject: template.subject,
          email_status: 'sent',
          email_id: data.id
        })
        .catch(logError => console.error('Error logging notification:', logError));

    } catch (error) {
      console.error(`❌ Failed to send ${notificationType} notification to ${recipient.email}:`, error.message);
      failureCount++;
      
      // Log the failed notification
      await supabase
        .from('event_notifications')
        .insert({
          event_id: event.id,
          notification_type: notificationType,
          recipient_email: recipient.email,
          recipient_name: recipient.full_name || recipient.name,
          sent_at: new Date().toISOString(),
          email_subject: template.subject,
          email_status: 'failed',
          error_message: error.message
        })
        .catch(logError => console.error('Error logging failed notification:', logError));
    }
  }

  console.log(`📧 Email summary: ${successCount} sent, ${failureCount} failed out of ${recipients.length} total`);
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
        created_by: 'Admin',
        created_by_profile_id: null,
        created_by_name: null,
        created_by_email: null,
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

    // Send invitation notifications with rate limiting (simplified for testing)
    const allRecipients = [
      ...adminProfiles,
      ...(attendees ? attendees.split(',').map(email => ({ email: email.trim(), name: email.trim() })) : [])
    ];

    console.log(`📧 Sending invitations to ${allRecipients.length} recipients:`, allRecipients.map(r => r.email));

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

    // Soft delete by updating status
    const { error: updateError } = await supabase
      .from('scheduled_events')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    res.json({
      success: true,
      message: 'Event cancelled successfully'
    });

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
    const emailResults = await sendEventNotification(event, 'reminder', recipients);

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
      message: `Reminder sent: ${emailResults.successCount} delivered, ${emailResults.failureCount} failed out of ${recipients.length} recipients`
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
        const emailResults = await sendEventNotification(event, 'reminder', recipients);

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