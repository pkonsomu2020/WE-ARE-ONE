const axios = require('axios');

// Payd API Configuration
const PAYD_BASE_URL = 'https://api.mypayd.app/api/v1';
const PAYD_USERNAME = process.env.PAYD_USERNAME;
const PAYD_PASSWORD = process.env.PAYD_PASSWORD;
const PAYD_API_SECRET = process.env.PAYD_API_SECRET;

// Create payment
const createPayment = async (req, res) => {
  try {
    const {
      amount,
      email,
      first_name,
      last_name,
      location,
      username,
      payment_method = 'card',
      provider = 'peach',
      callback_url,
      reason,
      phone
    } = req.body;

    // Validation (add more as needed)
    if (!amount || !email || !first_name || !last_name || !location || !username || !callback_url || !reason || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (!PAYD_USERNAME || !PAYD_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: 'Payd API credentials not configured'
      });
    }

    // Basic Auth
    const authHeader = Buffer.from(`${PAYD_USERNAME}:${PAYD_PASSWORD}`).toString('base64');

    const paymentData = {
      amount,
      email,
      first_name,
      last_name,
      location,
      username,
      payment_method,
      provider,
      callback_url,
      reason,
      phone
    };

    // Debug: log paymentData
    console.log('Sending paymentData to Payd:', paymentData);

    const response = await axios.post(
      `${PAYD_BASE_URL}/payments`,
      paymentData,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.success && response.data.checkout_url) {
      res.json({
        success: true,
        checkout_url: response.data.checkout_url,
        message: response.data.message
      });
    } else {
      throw new Error(response.data.message || 'Invalid response from Payd API');
    }
  } catch (error) {
    console.error('Payd payment creation error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Handle payment callback (success)
const handleCallback = async (req, res) => {
  try {
    const { payment_id, status } = req.query;

    if (!payment_id) {
      const cancelUrl = 'frontend_cancel' in req.query ? req.query.frontend_cancel : process.env.FRONTEND_URL;
      return res.redirect(`${cancelUrl}?error=missing_payment_id`);
    }

    // Create Basic Auth header
    const authHeader = Buffer.from(`${PAYD_USERNAME}:${PAYD_PASSWORD}`).toString('base64');

    // Verify payment status with Payd
    const response = await axios.get(`${PAYD_BASE_URL}/payments/${payment_id}`, {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'X-API-Secret': PAYD_API_SECRET
      }
    });

    const payment = response.data;

    if (payment.status === 'completed' || payment.status === 'paid') {
      // Payment successful
      console.log('Payment completed:', {
        payment_id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status
      });

      // Here you would typically:
      // 1. Save payment details to your database
      // 2. Send confirmation email
      // 3. Update donation records

      const returnUrl = payment.metadata?.frontend_return || `${process.env.FRONTEND_URL}/donation-success`;
      res.redirect(`${returnUrl}?payment_id=${payment.id}&status=completed`);
    } else {
      const cancelUrl = payment.metadata?.frontend_cancel || process.env.FRONTEND_URL;
      res.redirect(`${cancelUrl}?error=payment_not_completed&status=${payment.status}`);
    }

  } catch (error) {
    console.error('Payment callback error:', error.response?.data || error.message);
    const cancelUrl = process.env.FRONTEND_URL;
    res.redirect(`${cancelUrl}?error=callback_error`);
  }
};

// Handle payment cancellation
const handleCancel = async (req, res) => {
  try {
    console.log('Payment cancelled by user');
    
    const cancelUrl = req.query.frontend_cancel || `${process.env.FRONTEND_URL}/donation-cancelled`;
    res.redirect(`${cancelUrl}?status=cancelled`);

  } catch (error) {
    console.error('Cancel payment error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=cancel_error`);
  }
};

// Webhook handler for Payd notifications
const handleWebhook = async (req, res) => {
  try {
    const { event, data } = req.body;

    console.log('Payd webhook received:', { event, payment_id: data?.id });

    // Verify webhook signature if needed
    // const signature = req.headers['x-payd-signature'];
    
    switch (event) {
      case 'payment.completed':
        // Handle successful payment
        console.log('Payment completed via webhook:', data);
        break;
      case 'payment.failed':
        // Handle failed payment
        console.log('Payment failed via webhook:', data);
        break;
      default:
        console.log('Unhandled webhook event:', event);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
};

module.exports = {
  createPayment,
  handleCallback,
  handleCancel,
  handleWebhook
};