const paypal = require('@paypal/checkout-server-sdk');

// PayPal environment setup
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (process.env.PAYPAL_MODE === 'live') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  }
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

// Create payment (order)
const createPayment = async (req, res) => {
  try {
    const { amount, currency = 'USD', reason } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount
        },
        description: reason || 'Donation'
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/paypal-callback`,
        cancel_url: `${process.env.FRONTEND_URL}/donation-cancelled`
      }
    });

    const order = await client().execute(request);
    const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;

    res.json({
      success: true,
      approval_url: approvalUrl,
      orderID: order.result.id
    });
  } catch (error) {
    console.error('PayPal createPayment error:', error);
    res.status(500).json({ success: false, message: 'Failed to create PayPal payment', error: error.message });
  }
};

// Handle payment callback (success)
const handleCallback = async (req, res) => {
  try {
    const { token } = req.query; // PayPal returns 'token' as the order ID
    if (!token) {
      return res.redirect(`${process.env.FRONTEND_URL}/donation-cancelled?provider=paypal&error=missing_token`);
    }

    // Capture the order
    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});
    const capture = await client().execute(request);

    // You can save capture.result to your DB here

    // Redirect to success page
    res.redirect(`${process.env.FRONTEND_URL}/donation-success?provider=paypal&orderID=${token}`);
  } catch (error) {
    console.error('PayPal handleCallback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/donation-cancelled?provider=paypal&error=${encodeURIComponent(error.message)}`);
  }
};

// Handle payment cancellation
const handleCancel = async (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/donation-cancelled?provider=paypal&status=cancelled`);
};

// Webhook handler for PayPal notifications (optional, for advanced use)
const handleWebhook = async (req, res) => {
  // For most donation flows, you may not need this unless you want to process PayPal webhooks
  console.log('PayPal webhook received:', req.body);
  res.status(200).json({ received: true });
};

module.exports = {
  createPayment,
  handleCallback,
  handleCancel,
  handleWebhook
}; 