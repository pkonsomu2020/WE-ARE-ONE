const { pool } = require('../config/database');
const nodemailer = require('nodemailer');

// Email transporter setup (reuse env)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/events/register
async function registerForEvent(req, res) {
  try {
    const {
      eventId,
      fullName,
      email,
      phone,
      experience,
      acceptTerms,
      acceptUpdates,
    } = req.body;

    if (!eventId || !fullName || !email || !phone || !acceptTerms) {
      return res.status(400).json({
        success: false,
        message: 'eventId, fullName, email, phone, and acceptTerms are required',
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO event_registrations
        (event_id, full_name, email, phone, experience_text, accept_terms, accept_updates)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        eventId,
        fullName,
        email,
        phone,
        experience || null,
        acceptTerms ? 1 : 0,
        acceptUpdates ? 1 : 0,
      ]
    );

    // Send admin notification (non-blocking)
    const adminEmail = process.env.EVENTS_ADMIN_EMAIL || 'weareone0624@gmail.com';
    transporter
      .sendMail({
        from: process.env.EMAIL_FROM,
        to: adminEmail,
        subject: `New Event Registration - ${eventId}`,
        html: `
          <h2>New Event Registration</h2>
          <p><strong>Event:</strong> ${eventId}</p>
          <p><strong>Full Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Experience (expectation):</strong> ${experience || 'N/A'}</p>
          <p><strong>Accept Terms:</strong> ${acceptTerms ? 'Yes' : 'No'}</p>
          <p><strong>Accept Updates:</strong> ${acceptUpdates ? 'Yes' : 'No'}</p>
          <p><em>Registration ID: ${result.insertId}</em></p>
        `,
      })
      .catch((err) => console.error('Event registration admin email error:', err.message));

    // Send user confirmation (non-blocking)
    transporter
      .sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Your event registration was received',
        html: `
          <p>Hi ${fullName},</p>
          <p>Thank you for registering for our event. We have received your details and will keep you updated.</p>
          <p><strong>Event:</strong> ${eventId}</p>
          <p><strong>Your expectation:</strong> ${experience || 'N/A'}</p>
          <p>— We Are One</p>
        `,
      })
      .catch((err) => console.error('Event registration user email error:', err.message));

    return res.json({ success: true, message: 'Registration saved successfully' });
  } catch (error) {
    console.error('Event registration error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save registration' });
  }
}

module.exports = { registerForEvent };
