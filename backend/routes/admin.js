const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const adminAuth = require('../middleware/adminAuth');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// Bootstrap a default admin from env if provided (runs once at startup)
(async function ensureDefaultAdmin() {
  try {
    // Ensure table exists
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_admin_email (email)
      )
    `);

    const email = process.env.ADMIN_DEFAULT_EMAIL;
    const password = process.env.ADMIN_DEFAULT_PASSWORD;
    const fullName = process.env.ADMIN_DEFAULT_NAME || 'WAO Admin';
    if (!email || !password) return; // nothing to seed
    const [exists] = await pool.execute('SELECT id FROM admin_users WHERE email = ?', [email]);
    if (exists.length > 0) return;
    const hash = await bcrypt.hash(password, 12);
    await pool.execute('INSERT INTO admin_users (full_name, email, password_hash) VALUES (?, ?, ?)', [fullName, email, hash]);
    console.log(`✅ Seeded default admin: ${email}`);
  } catch (e) {
    console.error('⚠️ Failed to seed default admin:', e.message);
  }
})();

// Ensure necessary event tables exist (so admin endpoints don't 500 on first run)
(async function ensureEventTables() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS event_payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id VARCHAR(100) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        ticket_type ENUM('WAO Members','Public') NOT NULL,
        amount INT NOT NULL,
        mpesa_code VARCHAR(32) NOT NULL,
        status ENUM('pending_verification','paid','failed') DEFAULT 'pending_verification',
        confirmation_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_event_status (event_id, status),
        UNIQUE KEY uniq_mpesa_code (mpesa_code)
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS event_tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id VARCHAR(100) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        ticket_type ENUM('WAO Members','Public') NOT NULL,
        amount_paid INT NOT NULL,
        mpesa_code VARCHAR(32) NOT NULL,
        ticket_number VARCHAR(32) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_event_email (event_id, user_email),
        INDEX idx_mpesa_code (mpesa_code)
      )
    `);

    console.log('✅ Event tables ready');
  } catch (e) {
    console.error('⚠️ Failed ensuring event tables:', e.message);
  }
})();

// --- Public admin auth endpoints ---
router.post('/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body || {};
    if (!fullName || !email || !password) return res.status(400).json({ success: false, message: 'fullName, email, password are required' });

    const [exists] = await pool.execute('SELECT id FROM admin_users WHERE email = ?', [email]);
    if (exists.length > 0) return res.status(400).json({ success: false, message: 'Admin already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      'INSERT INTO admin_users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [fullName, email, passwordHash]
    );

    const token = jwt.sign({ adminId: result.insertId }, process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, admin: { id: result.insertId, fullName, email } });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, message: 'email and password are required' });

    const [rows] = await pool.execute('SELECT id, full_name, email, password_hash FROM admin_users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const admin = rows[0];

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ adminId: admin.id }, process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, admin: { id: admin.id, fullName: admin.full_name, email: admin.email } });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// --- Protected admin endpoints ---
router.use(adminAuth);

// List payments
router.get('/event-payments', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM event_payments ORDER BY created_at DESC');
    res.json({ success: true, payments: rows || [] });
  } catch (e) {
    console.error('List payments error:', e);
    res.status(500).json({ success: false, message: 'Failed to load payments' });
  }
});

// Get payment
router.get('/event-payments/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM event_payments WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, payment: rows[0] });
  } catch (e) {
    console.error('Get payment error:', e);
    res.status(500).json({ success: false, message: 'Failed to load payment' });
  }
});

// Update status; allocate ticket if paid; email user
router.put('/event-payments/:id', async (req, res) => {
  const { status, reason } = req.body; // status: 'paid' | 'failed' | 'pending_verification'
  if (!['paid', 'failed', 'pending_verification'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  try {
    const [rows] = await pool.execute('SELECT * FROM event_payments WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    const payment = rows[0];

    await pool.execute('UPDATE event_payments SET status = ?, confirmation_message = ? WHERE id = ?', [status, reason || null, req.params.id]);

    let ticketNumber = null;
    if (status === 'paid') {
      // Generate ticket like WAO-516679-65
      const generateTicket = () => {
        const six = Math.floor(Math.random() * 900000) + 100000; // 100000-999999
        const two = Math.floor(Math.random() * 90) + 10; // 10-99
        return `WAO-${six}-${two}`;
      };

      // Ensure uniqueness with a few retries
      for (let i = 0; i < 5; i++) {
        const candidate = generateTicket();
        try {
          await pool.execute(
            `INSERT INTO event_tickets (event_id, user_email, full_name, ticket_type, amount_paid, mpesa_code, ticket_number)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [payment.event_id, payment.email, payment.full_name, payment.ticket_type, payment.amount, payment.mpesa_code, candidate]
          );
          ticketNumber = candidate;
          break;
        } catch (err) {
          // On duplicate key, try again; otherwise throw
          if (!/duplicate/i.test(String(err?.message))) throw err;
        }
      }
      if (!ticketNumber) {
        throw new Error('Could not allocate unique ticket number');
      }
    }

    // Notify user
    const subject = status === 'paid' ? 'Your WAO Ticket is Confirmed' : status === 'failed' ? 'Payment Verification Failed' : 'Payment Pending Verification';
    const body = status === 'paid'
      ? `
        <p>Hi ${payment.full_name},</p>
        <p>Your payment has been verified.</p>
        <p><strong>Event:</strong> ${payment.event_id}</p>
        <p><strong>Ticket Type:</strong> ${payment.ticket_type} (KES ${payment.amount})</p>
        <p><strong>Ticket Number:</strong> <span style="font-weight:bold;">${ticketNumber}</span></p>
        <p>Keep this ticket number safe and present it at entry.</p>
      `
      : status === 'failed'
        ? `
          <p>Hi ${payment.full_name},</p>
          <p>We could not verify your payment.</p>
          <p><strong>Reason:</strong> ${reason || 'Not provided'}</p>
          <p>Please re-check your M-Pesa code or contact support.</p>
        `
        : `
          <p>Hi ${payment.full_name},</p>
          <p>Your payment is still pending verification. We will get back to you shortly.</p>
        `;

    transporter.sendMail({ from: process.env.EMAIL_FROM, to: payment.email, subject, html: body }).catch((err) => {
      console.warn('Email send failed (non-blocking):', err?.message);
    });

    res.json({ success: true, status, ticketNumber });
  } catch (e) {
    console.error('Update payment error:', e);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

module.exports = router;


