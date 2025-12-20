const { pool } = require('../config/database');
const nodemailer = require('nodemailer');
const notificationService = require('../services/notificationService');
require('dotenv').config();

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Get all admin profiles for notifications
const getAllAdminProfiles = async () => {
  try {
    const [profiles] = await pool.execute(
      'SELECT id, full_name, email, phone_number, email_notifications FROM admin_profiles WHERE status = "active" AND email_notifications = 1'
    );
    return profiles;
  } catch (error) {
    console.error('Error fetching admin profiles:', error);
    return [];
  }
};

// Check if date/time slot is available (prevent double booking)
const checkDateAvailability = async (startDateTime, endDateTime, excludeEventId = null) => {
  try {
    let query = `
      SELECT id, title, start_datetime, end_datetime 
      FROM scheduled_events 
      WHERE status != 'cancelled' 
      AND (
        (start_datetime <= ? AND end_datetime > ?) OR
        (start_datetime < ? AND end_datetime >= ?) OR
        (start_datetime >= ? AND start_datetime < ?)
      )
    `;
    
    const params = [startDateTime, startDateTime, endDateTime, endDateTime, startDateTime, endDateTime];
    
    if (excludeEventId) {
      query += ' AND id != ?';
      params.push(excludeEventId);
    }
    
    const [conflicts] = await pool.execute(query, params);
    return conflicts;
  } catch (error) {
    console.error('Error checking date availability:', error);
    return [];
  }
};

// Send event notification emails
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
  if (!template) return;

  for (const recipient of recipients) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: recipient.email,
        subject: template.subject,
        html: template.getBody(event, recipient)
      });

      // Log the notification
      await pool.execute(
        `INSERT INTO event_notifications (event_id, notification_type, recipient_email, recipient_name, sent_at, email_subject, email_status)
         VALUES (?, ?, ?, ?, NOW(), ?, 'sent')`,
        [event.id, notificationType, recipient.email, recipient.full_name || recipient.name, template.subject]
      );

      console.log(`✅ ${notificationType} notification sent to:`, recipient.email);
    } catch (error) {
      console.error(`❌ Failed to send ${notificationType} notification to ${recipient.email}:`, error.message);
      
      // Log the failed notification
      await pool.execute(
        `INSERT INTO event_notifications (event_id, notification_type, recipient_email, recipient_name, sent_at, email_subject, email_status, error_message)
         VALUES (?, ?, ?, ?, NOW(), ?, 'failed', ?)`,
        [event.id, notificationType, recipient.email, recipient.full_name || recipient.name, template.subject, error.message]
      );
    }
  }
};

// Create new event
const createEvent = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

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
    const [eventResult] = await connection.execute(
      `INSERT INTO scheduled_events (title, type, description, start_datetime, end_datetime, location, meeting_link, is_recurring, recurrence_pattern)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, type, description, startDateTime, endDateTime, location, meetingLink, isRecurring ? 1 : 0, recurrencePattern]
    );

    const eventId = eventResult.insertId;

    // Get all admin profiles for notifications
    const adminProfiles = await getAllAdminProfiles();

    // Add admin attendees
    for (const admin of adminProfiles) {
      await connection.execute(
        `INSERT INTO event_attendees (event_id, admin_profile_id, attendance_status, notification_sent)
         VALUES (?, ?, 'invited', 0)`,
        [eventId, admin.id]
      );
    }

    // Add external attendees if provided
    if (attendees && attendees.trim()) {
      const externalAttendees = attendees.split(',').map(email => email.trim()).filter(email => email);
      for (const email of externalAttendees) {
        await connection.execute(
          `INSERT INTO event_attendees (event_id, external_email, attendance_status, notification_sent)
           VALUES (?, ?, 'invited', 0)`,
          [eventId, email]
        );
      }
    }

    // Create automatic reminders
    const reminderTimes = [
      { type: '24_hours', hours: 24 },
      { type: '1_hour', hours: 1 }
    ];

    for (const reminder of reminderTimes) {
      const reminderDateTime = new Date(startDateTime.getTime() - (reminder.hours * 60 * 60 * 1000));
      
      // Only create reminder if it's in the future
      if (reminderDateTime > new Date()) {
        await connection.execute(
          `INSERT INTO event_reminders (event_id, reminder_type, reminder_datetime)
           VALUES (?, ?, ?)`,
          [eventId, reminder.type, reminderDateTime]
        );
      }
    }

    await connection.commit();

    // Get the created event with full details
    const [createdEvent] = await connection.execute(
      'SELECT * FROM scheduled_events WHERE id = ?',
      [eventId]
    );

    // Create notification for event creation
    await notificationService.createEventNotification(title, date, startTime);

    // Send invitation notifications (async, don't wait)
    const eventData = createdEvent[0];
    const allRecipients = [
      ...adminProfiles,
      ...externalAttendees.map(email => ({ email, name: email }))
    ];

    sendEventNotification(eventData, 'invitation', allRecipients).catch(err => 
      console.error('Error sending invitation notifications:', err)
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully and invitations sent',
      data: {
        event: eventData,
        attendeesNotified: allRecipients.length
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    let query = `
      SELECT 
        se.*,
        COUNT(ea.id) as attendee_count,
        GROUP_CONCAT(
          CASE 
            WHEN ea.admin_profile_id IS NOT NULL THEN ap.full_name
            ELSE ea.external_email
          END
          SEPARATOR ', '
        ) as attendees_list
      FROM scheduled_events se
      LEFT JOIN event_attendees ea ON se.id = ea.event_id
      LEFT JOIN admin_profiles ap ON ea.admin_profile_id = ap.id
      WHERE se.status != 'cancelled'
    `;
    
    const params = [];
    
    if (startDate && endDate) {
      query += ' AND se.start_datetime BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    if (type) {
      query += ' AND se.type = ?';
      params.push(type);
    }
    
    query += ' GROUP BY se.id ORDER BY se.start_datetime ASC';
    
    const [events] = await pool.execute(query, params);
    
    // Format events for frontend
    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      type: event.type,
      start: event.start_datetime,
      end: event.end_datetime,
      description: event.description,
      location: event.location,
      meetingLink: event.meeting_link,
      attendees: event.attendees_list ? event.attendees_list.split(', ') : [],
      attendeeCount: event.attendee_count,
      createdBy: event.created_by,
      reminderSent: event.reminder_sent === 1,
      isRecurring: event.is_recurring === 1,
      status: event.status
    }));

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
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

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
    const [existingEvent] = await connection.execute(
      'SELECT * FROM scheduled_events WHERE id = ?',
      [id]
    );

    if (existingEvent.length === 0) {
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

    // Update the event
    const updateFields = [];
    const updateValues = [];

    if (title) { updateFields.push('title = ?'); updateValues.push(title); }
    if (type) { updateFields.push('type = ?'); updateValues.push(type); }
    if (description !== undefined) { updateFields.push('description = ?'); updateValues.push(description); }
    if (startDateTime) { updateFields.push('start_datetime = ?'); updateValues.push(startDateTime); }
    if (endDateTime) { updateFields.push('end_datetime = ?'); updateValues.push(endDateTime); }
    if (location !== undefined) { updateFields.push('location = ?'); updateValues.push(location); }
    if (meetingLink !== undefined) { updateFields.push('meeting_link = ?'); updateValues.push(meetingLink); }
    if (isRecurring !== undefined) { updateFields.push('is_recurring = ?'); updateValues.push(isRecurring ? 1 : 0); }
    if (recurrencePattern !== undefined) { updateFields.push('recurrence_pattern = ?'); updateValues.push(recurrencePattern); }

    if (updateFields.length > 0) {
      updateValues.push(id);
      await connection.execute(
        `UPDATE scheduled_events SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Event updated successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const [existingEvent] = await pool.execute(
      'SELECT * FROM scheduled_events WHERE id = ?',
      [id]
    );

    if (existingEvent.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Soft delete by updating status
    await pool.execute(
      'UPDATE scheduled_events SET status = "cancelled" WHERE id = ?',
      [id]
    );

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
    const [events] = await pool.execute(
      'SELECT * FROM scheduled_events WHERE id = ? AND status = "scheduled"',
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or not scheduled'
      });
    }

    const event = events[0];

    // Get all attendees
    const [attendees] = await pool.execute(
      `SELECT 
        ea.*,
        ap.full_name,
        ap.email as admin_email
       FROM event_attendees ea
       LEFT JOIN admin_profiles ap ON ea.admin_profile_id = ap.id
       WHERE ea.event_id = ?`,
      [id]
    );

    const recipients = attendees.map(attendee => ({
      email: attendee.admin_email || attendee.external_email,
      full_name: attendee.full_name || attendee.external_email
    }));

    // Send reminder notifications
    await sendEventNotification(event, 'reminder', recipients);

    // Update reminder sent status
    await pool.execute(
      'UPDATE scheduled_events SET reminder_sent = 1, reminder_sent_at = NOW() WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: `Reminder sent to ${recipients.length} attendees`
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
    const [pendingReminders] = await pool.execute(
      `SELECT 
        er.*,
        se.title,
        se.type,
        se.description,
        se.start_datetime,
        se.end_datetime,
        se.location,
        se.meeting_link
       FROM event_reminders er
       JOIN scheduled_events se ON er.event_id = se.id
       WHERE er.is_sent = 0 
       AND er.reminder_datetime <= NOW()
       AND se.status = 'scheduled'`
    );

    let processedCount = 0;

    for (const reminder of pendingReminders) {
      try {
        // Get attendees for this event
        const [attendees] = await pool.execute(
          `SELECT 
            ea.*,
            ap.full_name,
            ap.email as admin_email
           FROM event_attendees ea
           LEFT JOIN admin_profiles ap ON ea.admin_profile_id = ap.id
           WHERE ea.event_id = ?`,
          [reminder.event_id]
        );

        const recipients = attendees.map(attendee => ({
          email: attendee.admin_email || attendee.external_email,
          full_name: attendee.full_name || attendee.external_email
        }));

        // Send reminder notifications
        await sendEventNotification(reminder, 'reminder', recipients);

        // Mark reminder as sent
        await pool.execute(
          'UPDATE event_reminders SET is_sent = 1, sent_at = NOW() WHERE id = ?',
          [reminder.id]
        );

        // Update event reminder status if this is the main reminder
        if (reminder.reminder_type === '24_hours') {
          await pool.execute(
            'UPDATE scheduled_events SET reminder_sent = 1, reminder_sent_at = NOW() WHERE id = ?',
            [reminder.event_id]
          );
        }

        processedCount++;
        console.log(`✅ Processed reminder for event: ${reminder.title}`);

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

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  sendManualReminder,
  processAutomaticReminders,
  checkDateAvailability
};