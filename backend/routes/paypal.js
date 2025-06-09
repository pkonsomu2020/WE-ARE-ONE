
const express = require('express');
const router = express.Router();
const { createPayment, executePayment, cancelPayment } = require('../controllers/paypalController');

// Create payment route
router.post('/create-payment', createPayment);

// Execute payment route
router.get('/execute-payment', executePayment);

// Cancel payment route
router.get('/cancel-payment', cancelPayment);

module.exports = router;
