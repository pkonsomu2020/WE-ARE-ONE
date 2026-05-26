const express = require('express');
const router = express.Router();
const megapayController = require('../controllers/megapayController');

// Route to initiate the STK push
router.post('/stkpush', megapayController.initiateStkPush);

// Route for Megapay callback/webhook
router.post('/webhook', express.json(), megapayController.handleWebhook);

module.exports = router;
