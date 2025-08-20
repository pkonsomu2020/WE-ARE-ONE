const { pool } = require('../config/database');
const nodemailer = require('nodemailer');
const { verifyMpesaCode } = require('../services/mpesaService');

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
      ticketType, // 'WAO Members' | 'Public'
      mpesaCode,
      amount
    } = req.body;

    if (!eventId || !fullName || !email || !phone || !acceptTerms || !ticketType || !mpesaCode || !amount) {
      return res.status(400).json({
        success: false,
        message: 'eventId, fullName, email, phone, ticketType, mpesaCode, amount and acceptTerms are required',
      });
    }

    // Ensure email belongs to a registered user
    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length === 0) {
      return res.status(400).json({ success: false, message: 'Please create an account and sign in with this email before booking a ticket.' });
    }

    // Validate expected amount
    const expectedAmount = ticketType === 'WAO Members' ? 800 : 1000;
    if (parseInt(amount, 10) !== expectedAmount) {
      return res.status(400).json({ success: false, message: `Amount mismatch. Expected KES ${expectedAmount}` });
    }

    // Manual verification workflow: store payment as pending for admin review
    const [existingPayments] = await pool.execute('SELECT id FROM event_payments WHERE mpesa_code = ?', [mpesaCode]);
    if (existingPayments.length > 0) {
      return res.status(400).json({ success: false, message: 'This M-Pesa code has already been submitted.' });
    }

    await pool.execute(
      `INSERT INTO event_payments (event_id, full_name, email, phone, ticket_type, amount, mpesa_code, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_verification')`,
      [eventId, fullName, email, phone, ticketType, expectedAmount, mpesaCode]
    );

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

    // Ticket number allocation will occur after admin marks payment as paid

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
          <p><strong>Ticket:</strong> ${ticketType} (KES ${expectedAmount})</p>
          <p><strong>M-Pesa Code:</strong> ${mpesaCode}</p>
          
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
        subject: 'We received your ticket request – Pending Verification',
        html: `
          <p>Hi ${fullName},</p>
          <p>Thank you for registering for our event. We have received your details and M-Pesa code.</p>
          <p><strong>Event:</strong> ${eventId}</p>
          <p><strong>Ticket Type:</strong> ${ticketType} (KES ${expectedAmount})</p>
          <p><strong>M-Pesa Code:</strong> ${mpesaCode}</p>
          <p>Our team will verify the payment and send your unique ticket number shortly. If verification fails, we will notify you.</p>
          <p>— We Are One</p>
        `,
      })
      .catch((err) => console.error('Event registration user email error:', err.message));

    return res.json({ success: true, message: 'Registration received! We will get back to you shortly.' });
  } catch (error) {
    console.error('Event registration error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save registration' });
  }
}

// Optional: Endpoint to log asynchronous callbacks if you wire Daraja TransactionStatus properly
// exports.mpesaCallback = async (req, res) => {
//   try {
//     const payload = req.body;
//     await pool.execute(
//       'INSERT INTO mpesa_verifications (mpesa_code, amount, msisdn, payer_name, status, raw_response) VALUES (?, ?, ?, ?, ?, ?)',
//       [payload?.ReceiptNo || '', payload?.Amount || 0, payload?.MSISDN || '', payload?.FirstName || '', payload?.ResultDesc || 'callback', JSON.stringify(payload)]
//     );
//     res.status(200).json({ received: true });
//   } catch (e) {
//     res.status(200).json({ received: true });
//   }
// };

module.exports = { registerForEvent };
