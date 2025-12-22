const { pool, supabase } = require('../config/database');
const nodemailer = require('nodemailer');

// Simple reminder service without node-cron dependency
class ReminderService {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.checkInterval = 5 * 60 * 1000; // Check every 5 minutes
    
    // Email transporter with better timeout settings
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000
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
      console.log('🔍 Checking for events needing reminders...');
      
      // Use Supabase client to get events needing reminders
      const { data: events, error } = await supabase
        .from('scheduled_events')
        .select('*')
        .eq('status', 'scheduled')
        .eq('reminder_sent', false)
        .gt('start_datetime', new Date().toISOString())
        .lte('start_datetime', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('❌ Error fetching events:', error.message);
        return;
      }

      if (!events || events.length === 0) {
        console.log('📭 No events need reminders at this time');
        return;
      }

      console.log(`📧 Found ${events.length} events needing reminders`);

      for (const event of events) {
        await this.sendEventReminder(event);
      }

    } catch (error) {
      console.error('❌ Error checking reminders:', error.message);
    }
  }

  async sendEventReminder(event) {
    try {
      const eventTitle = event.title || 'Untitled Event';
      console.log(`📧 Sending reminder for event: ${eventTitle}`);

      // Get all active admin profiles using Supabase
      const { data: adminProfiles, error: adminError } = await supabase
        .from('admin_profiles')
        .select('full_name, email')
        .eq('status', 'active')
        .eq('email_notifications', true);

      if (adminError) {
        console.error('❌ Error fetching admin profiles:', adminError.message);
        return;
      }

      if (!adminProfiles || adminProfiles.length === 0) {
        console.log('⚠️ No active admin profiles found for notifications');
        return;
      }

      // Create email content
      const subject = `🔔 Event Reminder: ${eventTitle}`;
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">📅 Event Reminder</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af;">${eventTitle}</h3>
            <p><strong>📅 Date:</strong> ${new Date(event.start_datetime).toLocaleDateString()}</p>
            <p><strong>⏰ Time:</strong> ${new Date(event.start_datetime).toLocaleTimeString()}</p>
            <p><strong>📍 Location:</strong> ${event.location || 'TBD'}</p>
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

      // Send to all active admins with better error handling
      let successCount = 0;
      let failureCount = 0;

      for (const admin of adminProfiles) {
        try {
          await this.transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: admin.email,
            subject: subject,
            html: emailBody
          });
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to send reminder to ${admin.email}:`, error.message);
          failureCount++;
        }
      }

      // Update reminder status using Supabase
      const { error: updateError } = await supabase
        .from('scheduled_events')
        .update({ 
          reminder_sent: true, 
          reminder_sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', event.id);

      if (updateError) {
        console.error('❌ Error updating reminder status:', updateError.message);
      }

      console.log(`✅ Reminder sent for "${eventTitle}" - Success: ${successCount}, Failed: ${failureCount}`);

    } catch (error) {
      console.error(`❌ Error sending reminder for event ${event.id}:`, error.message);
    }
  }

  // Manual reminder method (can be called from API)
  async sendManualReminder(eventId) {
    try {
      const { data: events, error } = await supabase
        .from('scheduled_events')
        .select('*')
        .eq('id', eventId)
        .eq('status', 'scheduled');

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      if (!events || events.length === 0) {
        throw new Error('Event not found or not scheduled');
      }

      await this.sendEventReminder(events[0]);
      return { success: true, message: 'Manual reminder sent successfully' };

    } catch (error) {
      console.error('Error sending manual reminder:', error.message);
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