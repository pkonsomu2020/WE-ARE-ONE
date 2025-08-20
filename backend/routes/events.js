const express = require('express');
const router = express.Router();
const { registerForEvent } = require('../controllers/eventsController');

// Test endpoint to verify route is working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Events route is working',
    timestamp: new Date().toISOString()
  });
});

router.post('/register', registerForEvent);

// Simple test endpoint used by frontend health checks
router.get('/test', (req, res) => res.json({ ok: true }));

module.exports = router;
