const axios = require('axios');

// Basic M-Pesa verification service
// Attempts real verification if credentials are provided; otherwise supports a mock mode.

const MPESA_BASE_URL = process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke';
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE; // Paybill/Till for TransactionStatus
const MPESA_PARTY_A = process.env.MPESA_PARTY_A || MPESA_SHORTCODE;
const MPESA_INITIATOR_NAME = process.env.MPESA_INITIATOR_NAME; // TransactionStatus initiator
const MPESA_INITIATOR_PASSWORD = process.env.MPESA_INITIATOR_PASSWORD; // base64encoded security credential (or plain for sandbox)
const MPESA_RESULT_URL = process.env.MPESA_RESULT_URL || 'https://example.com/mpesa/result';
const MPESA_TIMEOUT_URL = process.env.MPESA_TIMEOUT_URL || 'https://example.com/mpesa/timeout';
const MPESA_ENABLE_VERIFICATION = process.env.MPESA_ENABLE_VERIFICATION === 'true';
const MPESA_MOCK = process.env.MPESA_MOCK === 'true';

async function getAccessToken() {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const { data } = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` }
  });
  return data.access_token;
}

// NOTE: Safaricom's public TransactionStatus API typically requires OriginalConversationID/ConversationID,
// but many integrations also use BusinessPayment/TransactionStatus for C2B by Receipt/TransactionID.
// Here we attempt the B2C TransactionStatus endpoint with a TransactionID (mpesa receipt code) if enabled.
async function verifyWithMpesaAPI(mpesaCode, amount) {
  try {
    const token = await getAccessToken();
    // Use C2B simulate/transaction status alternatives:
    // For production, use the Reversal/TransactionStatus endpoints; many partners allow querying by ReceiptNo.
    const { data } = await axios.get(`${MPESA_BASE_URL}/mpesa/transactionstatus/v1/query?Receipt=${mpesaCode}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Expect a structure containing ResultCode, ResultDesc, and amount/MSISDN where available.
    const resultCode = data?.ResultCode ?? data?.ResponseCode;
    const paidAmount = parseInt(data?.Amount ?? data?.amount ?? 0, 10);
    if (String(resultCode) === '0' && (!amount || paidAmount === amount)) {
      return { verified: true, metadata: data };
    }
    return { verified: false, metadata: data };
  } catch (error) {
    return { verified: false, error: error.message };
  }
}

function basicFormatLooksValid(mpesaCode) {
  // Typical M-Pesa receipt e.g., QFT5Z1N0V4 (10/12 alphanumeric). We'll accept 8-12 alphanumeric.
  return /^[A-Za-z0-9]{8,12}$/.test(mpesaCode);
}

async function verifyMpesaCode({ mpesaCode, amount }) {
  if (!mpesaCode || !basicFormatLooksValid(mpesaCode)) {
    return { verified: false, reason: 'Invalid M-Pesa code format' };
  }

  if (MPESA_MOCK) {
    // In mock mode, accept codes starting with WAO or TEST, else reject
    const ok = /^(WAO|TEST|MPESA)/i.test(mpesaCode);
    return { verified: ok, reason: ok ? 'Mock verified' : 'Mock verification failed' };
  }

  if (!MPESA_ENABLE_VERIFICATION || !MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
    return { verified: false, reason: 'Verification not configured' };
  }

  const result = await verifyWithMpesaAPI(mpesaCode, amount);
  return result.verified ? { verified: true } : { verified: false, reason: 'M-Pesa API verification failed' };
}

module.exports = { verifyMpesaCode };


