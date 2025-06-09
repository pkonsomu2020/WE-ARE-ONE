
const paypal = require('paypal-rest-sdk');

// Configure PayPal SDK
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// Create payment
const createPayment = async (req, res) => {
  try {
    const { amount, currency = 'USD', description, return_url, cancel_url } = req.body;

    // Validation
    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Minimum amount is $1 USD'
      });
    }

    if (!return_url || !cancel_url) {
      return res.status(400).json({
        success: false,
        message: 'Return URL and Cancel URL are required'
      });
    }

    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `${req.protocol}://${req.get('host')}/api/paypal/execute-payment`,
        cancel_url: `${req.protocol}://${req.get('host')}/api/paypal/cancel-payment`
      },
      transactions: [{
        item_list: {
          items: [{
            name: 'Donation',
            sku: 'donation',
            price: amount.toString(),
            currency: currency,
            quantity: 1
          }]
        },
        amount: {
          currency: currency,
          total: amount.toString()
        },
        description: description || `Donation of $${amount} ${currency}`
      }]
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        console.error('PayPal Error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to create PayPal payment',
          error: process.env.NODE_ENV === 'development' ? error : undefined
        });
      } else {
        // Find approval URL
        const approval_url = payment.links.find(link => link.rel === 'approval_url');
        
        if (!approval_url) {
          return res.status(500).json({
            success: false,
            message: 'Failed to get PayPal approval URL'
          });
        }

        // Store payment details in session or database for later execution
        // For now, we'll include necessary data in the approval URL
        const modifiedApprovalUrl = `${approval_url.href}&frontend_return=${encodeURIComponent(return_url)}&frontend_cancel=${encodeURIComponent(cancel_url)}`;

        res.json({
          success: true,
          payment_id: payment.id,
          approval_url: modifiedApprovalUrl,
          message: 'Payment created successfully'
        });
      }
    });

  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Execute payment
const executePayment = async (req, res) => {
  try {
    const { paymentId, PayerID, frontend_return } = req.query;

    if (!paymentId || !PayerID) {
      const cancelUrl = req.query.frontend_cancel || process.env.FRONTEND_URL;
      return res.redirect(`${cancelUrl}?error=missing_payment_data`);
    }

    const execute_payment_json = {
      payer_id: PayerID
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
      if (error) {
        console.error('PayPal Execute Error:', error);
        const cancelUrl = req.query.frontend_cancel || process.env.FRONTEND_URL;
        return res.redirect(`${cancelUrl}?error=payment_execution_failed`);
      } else {
        if (payment.state === 'approved') {
          // Payment successful
          console.log('Payment completed:', {
            payment_id: payment.id,
            payer_email: payment.payer.payer_info.email,
            amount: payment.transactions[0].amount.total,
            currency: payment.transactions[0].amount.currency
          });

          // Here you would typically:
          // 1. Save payment details to your database
          // 2. Send confirmation email
          // 3. Update donation records

          const returnUrl = frontend_return || `${process.env.FRONTEND_URL}/donation-success`;
          res.redirect(`${returnUrl}?payment_id=${payment.id}&status=completed`);
        } else {
          const cancelUrl = req.query.frontend_cancel || process.env.FRONTEND_URL;
          res.redirect(`${cancelUrl}?error=payment_not_approved`);
        }
      }
    });

  } catch (error) {
    console.error('Execute payment error:', error);
    const cancelUrl = req.query.frontend_cancel || process.env.FRONTEND_URL;
    res.redirect(`${cancelUrl}?error=internal_error`);
  }
};

// Cancel payment
const cancelPayment = async (req, res) => {
  try {
    console.log('Payment cancelled by user');
    
    const cancelUrl = req.query.frontend_cancel || `${process.env.FRONTEND_URL}/donation-cancelled`;
    res.redirect(`${cancelUrl}?status=cancelled`);

  } catch (error) {
    console.error('Cancel payment error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=cancel_error`);
  }
};

module.exports = {
  createPayment,
  executePayment,
  cancelPayment
};
