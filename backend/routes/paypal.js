
const express = require('express');
const router = express.Router();
const { createPayment, executePayment, cancelPayment } = require('../controllers/paypalController');

console.log('PayPal credentials:', process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_MODE);


// Create payment route
router.post('/create-payment', createPayment);

// Execute payment route
router.get('/execute-payment', executePayment);

// Cancel payment route
router.get('/cancel-payment', cancelPayment);

module.exports = router;
