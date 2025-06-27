const express = require('express');
const router = express.Router();
const paydController = require('../controllers/paydController');

// Route to create a payment
router.post('/create-payment', paydController.createPayment);

// Optional routes you may want to include
router.get('/callback', paydController.handleCallback);
router.get('/cancel', paydController.handleCancel);
router.post('/webhook', express.json(), paydController.handleWebhook);

module.exports = router;