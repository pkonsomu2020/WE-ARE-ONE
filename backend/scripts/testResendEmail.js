#!/usr/bin/env node

/**
 * Test script to verify Resend email configuration
 * Usage: node backend/scripts/testResendEmail.js [recipient-email]
 */

require('dotenv').config();
const { Resend } = require('resend');

async function testResendEmail(recipientEmail = 'weareone0624@gmail.com') {
  console.log('🧪 Testing Resend Email Configuration...\n');

  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY environment variable is not set');
    console.log('💡 Please set RESEND_API_KEY in your .env file');
    process.exit(1);
  }

  console.log('✅ RESEND_API_KEY is configured');
  console.log(`📧 Sending test email to: ${recipientEmail}`);

  // Initialize Resend
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: 'We Are One Test <weareone0624@gmail.com>',
      to: [recipientEmail],
      subject: '🧪 Resend Email Test - WAO System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">We Are One (WAO)</h1>
            <p style="color: white; margin: 5px 0;">Email System Test</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333;">🧪 Resend Integration Test</h2>
            <p>This is a test email to verify that the Resend email service is working correctly.</p>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #2d5a2d;">✅ If you received this email, the Resend integration is working!</p>
            </div>
            
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Sent at: ${new Date().toLocaleString()}</li>
              <li>From: weareone0624@gmail.com</li>
              <li>Service: Resend API</li>
              <li>Environment: ${process.env.NODE_ENV || 'development'}</li>
            </ul>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0;">We Are One (WAO) - Mental Health Support Community</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      process.exit(1);
    }

    console.log('✅ Test email sent successfully!');
    console.log(`📧 Email ID: ${data.id}`);
    console.log(`📬 Check ${recipientEmail} for the test email`);
    
  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
    process.exit(1);
  }
}

// Get recipient email from command line argument or use default
const recipientEmail = process.argv[2];
testResendEmail(recipientEmail);