const fetch = require('node-fetch'); // Make sure node-fetch is available, or use native fetch if Node 18+

// Native fetch is available in Node 18+, but just in case, we can use it directly as global.fetch or require it if it's older.
// Assuming Node 18+ based on typical modern setups.

exports.initiateStkPush = async (req, res) => {
  try {
    const { amount, msisdn, reference } = req.body;

    if (!amount || !msisdn) {
      return res.status(400).json({
        success: false,
        message: 'Amount and msisdn are required.'
      });
    }

    // Format MSISDN to start with 254 if it starts with 0
    let formattedMsisdn = msisdn.trim();
    if (formattedMsisdn.startsWith('0')) {
      formattedMsisdn = '254' + formattedMsisdn.slice(1);
    } else if (formattedMsisdn.startsWith('+')) {
      formattedMsisdn = formattedMsisdn.slice(1);
    }

    // Amount is coming from the frontend in USD, converting to approximate KES
    // Alternatively, if the frontend sends KES, just use amount directly.
    // For now, assuming $1 = 130 KES for the M-Pesa push
    const amountInKes = Math.round(parseFloat(amount) * 130);

    const apiKey = process.env.MEGAPAY_API_KEY || 'MGPYAb3WCvhc'; // fallback if not in env
    const email = process.env.MEGAPAY_EMAIL || 'pkonsomu2021@gmail.com'; // fallback if not in env

    const payload = {
      api_key: apiKey,
      email: email,
      amount: amountInKes,
      msisdn: formattedMsisdn,
      reference: reference || 'WAO Donation'
    };

    console.log('Initiating Megapay STK Push with payload:', { ...payload, api_key: '***' });

    // Use global fetch (Node 18+)
    const response = await fetch('https://megapay.co.ke/backend/v1/initiatestk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Megapay response:', responseText);
      throw new Error('Invalid response from Megapay');
    }

    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: 'STK Push initiated successfully',
        data
      });
    } else {
      console.error('Megapay STK Push error:', data);
      return res.status(response.status).json({
        success: false,
        message: data.message || 'Failed to initiate STK Push',
        error: data
      });
    }

  } catch (error) {
    console.error('Megapay initiateStkPush error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while initiating STK Push',
      error: error.message
    });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const payload = req.body;
    console.log('Megapay Webhook received:', payload);

    // Here you would typically check the payment status in the payload
    // and update your database accordingly.
    // Example:
    // if (payload.status === 'success') {
    //    await Database.updateDonationStatus(payload.reference, 'completed');
    // }

    // Respond to Megapay that the webhook was received successfully
    return res.status(200).json({
      success: true,
      message: 'Webhook received'
    });
  } catch (error) {
    console.error('Megapay Webhook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error processing webhook'
    });
  }
};
