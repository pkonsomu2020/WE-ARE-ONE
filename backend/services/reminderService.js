const { pool } = require('../config/database');
const nodemailer = require('nodemailer');

// Simple reminder service without node-cron dependency
class ReminderService {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.checkInterval = 5 * 60 * 1000; // Check every 5 minutes
    
    // Email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ Reminder service is already running');
      return;
    }

    console.log('🚀 Starting reminder service...');
    this.isRunning = true;
    
    // Run immediately, then every 5 minutes
    this.checkReminders();
    this.intervalId = setInterval(() => {
      this.checkReminders();
    }, this.checkInterval);
    
    console.log('✅ Reminder service started (checks every 5 minutes)');
  }

  stop() {
    if (!this.isRunning) {
      console.log('⚠️ Reminder service is not running');
      return;
    }

    console.log('🛑 Stopping reminder service...');
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('✅ Reminder service stopped');
  }

  async checkReminders() {
    try {
      console.log('� Cheucking for events needing reminders...');
      
      // Get events that need reminders (24 hours before start time)
      const [events] = await pool.execute(`
        SELECT 
          se.*,
          COUNT(ea.id) as attendee_count
        FROM scheduled_events se
        LEFT JOIN event_attendees ea ON se.id = ea.event_id
        WHERE se.status = 'scheduled'
        AND se.reminder_sent = 0
        AND se.start_datetime > NOW()
        AND se.start_datetime <= DATE_ADD(NOW(), INTERVAL 24 HOUR)
        GROUP BY se.id
      `);

      if (events.length === 0) {
        console.log('📭 No events need reminders at this time');
        return;
      }

      console.log(`📧 Found ${events.length} events needing reminders`);

      for (const event of events) {
        await this.sendEventReminder(event);
      }

    } catch (error) {
      console.error('❌ Error checking reminders:', error);
    }
  }

  async sendEventReminder(event) {
    try {
      console.log(`📧 Sending reminder for event: ${event.title}`);

      // Get all active admin profiles for notifications
      const [adminProfiles] = await pool.execute(
        'SELECT full_name, email FROM admin_profiles WHERE status = "active" AND email_notifications = 1'
      );

      if (adminProfiles.length === 0) {
        console.log('⚠️ No active admin profiles found for notifications');
        return;
      }

      // Create email content
      const subject = `🔔 Event Reminder: ${event.title}`;
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">📅 Event Reminder</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af;">${event.title}</h3>
            <p><strong>📅 Date:</strong> ${new Date(event.start_datetime).toLocaleDateString()}</p>
            <p><strong>⏰ Time:</strong> ${new Date(event.start_datetime).toLocaleTimeString()}</p>
            <p><strong>📍 Location:</strong> ${event.location || 'TBD'}</p>
            <p><strong>👥 Attendees:</strong> ${event.attendee_count} registered</p>
          </div>

          ${event.description ? `
            <div style="margin: 20px 0;">
              <h4>📝 Description:</h4>
              <p style="background: #f1f5f9; padding: 15px; border-radius: 6px;">${event.description}</p>
            </div>
          ` : ''}

          <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;">
              <strong>⏰ This event starts in approximately 24 hours!</strong>
            </p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">
            This is an automated reminder from the WAO Admin Dashboard.<br>
            Event ID: ${event.id} | Generated: ${new Date().toLocaleString()}
          </p>
        </div>
      `;

      // Send to all active admins
      const emailPromises = adminProfiles.map(admin => 
        this.transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: admin.email,
          subject: subject,
          html: emailBody
        }).catch(error => {
          console.error(`❌ Failed to send reminder to ${admin.email}:`, error.message);
        })
      );

      await Promise.allSettled(emailPromises);

      // Mark reminder as sent
      await pool.execute(
        'UPDATE scheduled_events SET reminder_sent = 1, updated_at = NOW() WHERE id = ?',
        [event.id]
      );

      // Log the notification
      await pool.execute(`
        INSERT INTO event_notifications (event_id, type, message, recipients_count, created_at)
        VALUES (?, 'reminder', ?, ?, NOW())
      `, [
        event.id,
        `24-hour reminder sent for event: ${event.title}`,
        adminProfiles.length
      ]);

      console.log(`✅ Reminder sent for "${event.title}" to ${adminProfiles.length} admins`);

    } catch (error) {
      console.error(`❌ Error sending reminder for event ${event.id}:`, error);
    }
  }

  // Manual reminder method (can be called from API)
  async sendManualReminder(eventId) {
    try {
      const [events] = await pool.execute(
        'SELECT * FROM scheduled_events WHERE id = ? AND status = "scheduled"',
        [eventId]
      );

      if (events.length === 0) {
        throw new Error('Event not found or not scheduled');
      }

      await this.sendEventReminder(events[0]);
      return { success: true, message: 'Manual reminder sent successfully' };

    } catch (error) {
      console.error('Error sending manual reminder:', error);
      throw error;
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      checkInterval: this.checkInterval,
      nextCheck: this.intervalId ? new Date(Date.now() + this.checkInterval).toISOString() : null
    };
  }
}

// Export singleton instance
const reminderService = new ReminderService();
module.exports = reminderService;