const { pool } = require('../config/database');
const { Resend } = require('resend');
const { verifyMpesaCode } = require('../services/mpesaService');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

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
      amount,
      isFree
    } = req.body;
    
    // DEBUG: Log received payload
    console.log('📥 RECEIVED REGISTRATION PAYLOAD:');
    console.log('   eventId:', eventId);
    console.log('   fullName:', fullName);
    console.log('   email:', email);
    console.log('   phone:', phone);
    console.log('   ticketType:', ticketType);
    console.log('   amount:', amount, '(type:', typeof amount, ')');
    console.log('   mpesaCode:', mpesaCode, '(type:', typeof mpesaCode, ')');
    console.log('   isFree:', isFree, '(type:', typeof isFree, ')');
    console.log('   Full body keys:', Object.keys(req.body));

    if (!eventId || !fullName || !email || !phone || !acceptTerms) {
      return res.status(400).json({
        success: false,
        message: 'eventId, fullName, email, phone and acceptTerms are required',
      });
    }

    // Ensure email belongs to a registered user
    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length === 0) {
      return res.status(400).json({ success: false, message: 'Please create an account and sign in with this email before booking a ticket.' });
    }

    // Determine if event is free based on presence of payment info
    // If mpesaCode and amount are provided, it's a paid event
    const isPaidEvent = mpesaCode && amount != null && amount > 0;
    const isFreeEvent = isFree === true || !isPaidEvent;
    
    // DEBUG: Log payment detection
    console.log('🔍 PAYMENT DETECTION DEBUG:');
    console.log('   mpesaCode:', mpesaCode);
    console.log('   amount:', amount);
    console.log('   isFree flag:', isFree);
    console.log('   isPaidEvent:', isPaidEvent);
    console.log('   isFreeEvent:', isFreeEvent);
    console.log('   Will insert payment?', isPaidEvent ? 'YES' : 'NO');

    if (isPaidEvent) {
      console.log('✅ PAID EVENT DETECTED - Will insert into event_payments table');
      // Validate expected amount
      if (!ticketType) {
        return res.status(400).json({ success: false, message: 'ticketType is required for paid events' });
      }
      // Handle different ticket types and their expected amounts
      let expectedAmount;
      
      // Normalize eventId to handle different formats (with debugging)
      const normalizedEventId = String(eventId).toLowerCase().trim();
      console.log('Debug - eventId:', eventId, 'normalized:', normalizedEventId, 'ticketType:', ticketType);
      
      // Define pricing for different events
      const kanungaFallsPricing = {
        'wao members': 1600,
        'public': 1600,
        'standard': 1600
      };
      
      const movieNightPricing = {
        'wao members': 800,
        'public': 1000,
        'standard': 800
      };
      
      const eldoretPicnicPricing = {
        'general admission': 150,
        'standard': 150
      };
      
      const gameNightPricing = {
        'standard': 750
      };
      
      const promNightPricing = {
        'standard': 1000
      };
      
      const kisumuMeetupPricing = {
        'standard': 150
      };
      
      const wrcSafariRallyPricing = {
        'standard': 1800
      };
      
      // Normalize ticket type for comparison
      const normalizedTicketType = String(ticketType).toLowerCase().trim();
      
      if (normalizedEventId === 'kanunga-falls') {
        expectedAmount = kanungaFallsPricing[normalizedTicketType] || parseInt(amount, 10);
      } else if (normalizedEventId === 'movie-night') {
        expectedAmount = movieNightPricing[normalizedTicketType] || parseInt(amount, 10);
      } else if (normalizedEventId === 'eldoret-picnic-kenmosa') {
        expectedAmount = eldoretPicnicPricing[normalizedTicketType] || parseInt(amount, 10);
      } else if (normalizedEventId === 'game-night-utawala') {
        expectedAmount = gameNightPricing[normalizedTicketType] || parseInt(amount, 10);
      } else if (normalizedEventId === 'prom-night-githegi') {
        expectedAmount = promNightPricing[normalizedTicketType] || parseInt(amount, 10);
      } else if (normalizedEventId === 'kisumu-meetup-valley-view') {
        expectedAmount = kisumuMeetupPricing[normalizedTicketType] || parseInt(amount, 10);
      } else if (normalizedEventId === 'wrc-safari-rally-naivasha') {
        expectedAmount = wrcSafariRallyPricing[normalizedTicketType] || parseInt(amount, 10);
      } else {
        // For unknown events, fall back to the provided amount
        expectedAmount = parseInt(amount, 10);
      }
      
      console.log('Debug - expectedAmount:', expectedAmount, 'providedAmount:', parseInt(amount, 10));
      
      if (parseInt(amount, 10) !== expectedAmount) {
        return res.status(400).json({ 
          success: false, 
          message: `Amount mismatch. Expected KES ${expectedAmount} for ${ticketType} ticket on ${eventId}. Received KES ${amount}`,
          debug: {
            eventId,
            normalizedEventId: String(eventId).toLowerCase().trim(),
            ticketType,
            normalizedTicketType: String(ticketType).toLowerCase().trim(),
            expectedAmount,
            providedAmount: parseInt(amount, 10)
          }
        });
      }
      // Manual verification workflow: store payment as pending for admin review
      const [existingPayments] = await pool.execute('SELECT id FROM event_payments WHERE mpesa_code = ?', [mpesaCode]);
      if (existingPayments.length > 0) {
        console.log('⚠️ M-pesa code already exists:', mpesaCode);
        return res.status(400).json({ success: false, message: 'This M-Pesa code has already been submitted.' });
      }
      
      console.log('💾 INSERTING PAYMENT INTO DATABASE:');
      console.log('   Event ID:', eventId);
      console.log('   Full Name:', fullName);
      console.log('   Email:', email);
      console.log('   Phone:', phone);
      console.log('   Ticket Type:', ticketType);
      console.log('   Amount:', expectedAmount);
      console.log('   M-pesa Code:', mpesaCode);
      console.log('   Status: pending_verification');
      
      const insertResult = await pool.execute(
        `INSERT INTO event_payments (event_id, full_name, email, phone, ticket_type, amount, mpesa_code, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [eventId, fullName, email, phone, ticketType, expectedAmount, mpesaCode, 'pending_verification']
      );
      
      console.log('✅ PAYMENT INSERTED SUCCESSFULLY');
      console.log('   Insert result:', insertResult);
    } else {
      console.log('⚠️ FREE EVENT - Skipping payment insert');
    }

    console.log('📝 Attempting to insert event registration...');
    console.log('📝 Insert parameters:', {
      eventId,
      fullName,
      email,
      phone,
      experience: experience || null,
      acceptTerms: acceptTerms ? 1 : 0,
      acceptUpdates: acceptUpdates ? 1 : 0,
    });

    // Test database connection first
    try {
      await pool.execute('SELECT 1 as test');
      console.log('✅ Database connection test passed');
    } catch (connError) {
      console.error('❌ Database connection test failed:', connError.message);
      throw new Error(`Database connection failed: ${connError.message}`);
    }

    let result;
    try {
      const [insertResult] = await pool.execute(
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

      result = insertResult;
      console.log('✅ Event registration saved successfully with ID:', result.insertId);
      console.log('📊 Database result object:', result);
      console.log('📊 Registration details:', { eventId, fullName, email, phone, isFree });
      
      // If insertId is still undefined, use a fallback but don't throw error
      if (!result.insertId) {
        console.log('⚠️ Database insert succeeded but no insertId returned - using fallback');
        result.insertId = Date.now(); // Use timestamp as fallback
        console.log('✅ Using fallback insertId:', result.insertId);
      }
    } catch (dbError) {
      console.error('❌ Database insert failed:', dbError.message);
      console.error('❌ Full database error:', dbError);
      throw new Error(`Database insert failed: ${dbError.message}`);
    }

    // Ticket number will be generated when admin marks payment as paid

    // Send admin notification (non-blocking)
    const adminEmail = 'weareone0624@gmail.com'; // Admin email for notifications
    
    console.log('📧 Attempting to send admin notification email...');
    console.log('📧 Admin email:', adminEmail);
    console.log('📧 Resend API key configured:', !!process.env.RESEND_API_KEY);
    
    resend.emails.send({
      from: 'We Are One Events <events@weareone.co.ke>',
      to: [adminEmail],
      subject: `New Event Registration - ${eventId} (from ${email})`,
      html: `
        <h2>New Event Registration</h2>
        <p><strong>Event:</strong> ${eventId}</p>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Experience (expectation):</strong> ${experience || 'N/A'}</p>
        ${isPaidEvent ? `<p><strong>Ticket:</strong> ${ticketType} (KES ${amount})</p>` : `<p><strong>Ticket:</strong> Free</p>`}
        ${isPaidEvent ? `<p><strong>M-Pesa Code:</strong> ${mpesaCode}</p>` : ''}
        <p><strong>Accept Terms:</strong> ${acceptTerms ? 'Yes' : 'No'}</p>
        <p><strong>Accept Updates:</strong> ${acceptUpdates ? 'Yes' : 'No'}</p>
        <p><em>Registration ID: ${result.insertId}</em></p>
      `,
    }).then((result) => {
      console.log('✅ Admin email sent successfully to:', adminEmail);
      console.log('📧 Email ID:', result?.data?.id || result?.id || 'No ID returned');
    }).catch((err) => {
      console.error('❌ Event registration admin email error:', err.message);
      console.error('❌ Full error:', err);
    });

    // Send user confirmation (non-blocking) - Now can send to actual user email!
    console.log('📧 Attempting to send user confirmation email to:', email);
    console.log('✅ Using verified domain: weareone.co.ke');
    
    resend.emails.send({
      from: 'We Are One Events <events@weareone.co.ke>',
      to: [email], // Now can send to actual user email!
      subject: isPaidEvent ? `Ticket Request – Pending Verification` : `Event Registration Confirmation`,
      html: `
        <p>Hi ${fullName},</p>
        ${isFreeEvent ? `
          <p>Thank you for registering for <strong>${eventId}</strong>. This is a free event—no payment is required.</p>
          <p>Your spot has been reserved. We look forward to seeing you!</p>
        ` : `
          <p>Thank you for registering for our event. We have received your details and M-Pesa code.</p>
          <p><strong>Event:</strong> ${eventId}</p>
          <p><strong>Ticket Type:</strong> ${ticketType} (KES ${amount})</p>
          <p><strong>M-Pesa Code:</strong> ${mpesaCode}</p>
          <p>Our team will verify the payment and send your unique ticket number shortly. If verification fails, we will notify you.</p>
        `}
        <p>— We Are One</p>
      `,
    }).then((result) => {
      console.log('✅ User confirmation email sent successfully to:', email);
      console.log('📧 Full Resend response:', JSON.stringify(result, null, 2));
      console.log('📧 Email ID:', result?.data?.id || result?.id || 'No ID returned');
    }).catch((err) => {
      console.error('❌ Event registration user email error:', err.message);
      console.error('❌ Full error object:', JSON.stringify(err, null, 2));
    });

    return res.json({ success: true, message: 'Registration received! We will get back to you shortly.' });
  } catch (error) {
    console.error('Event registration error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    // Return detailed error for debugging (remove in production)
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to save registration',
      debug: {
        error: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n') // First 3 lines of stack
      }
    });
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
