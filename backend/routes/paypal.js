const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController');

// Route to create a payment
router.post('/create-payment', paypalController.createPayment);

// Optional routes for PayPal
router.get('/callback', paypalController.handleCallback);
router.get('/cancel', paypalController.handleCancel);
router.post('/webhook', express.json(), paypalController.handleWebhook);

module.exports = router; 