const express = require('express');
const router = express.Router();
const { registerForEvent } = require('../controllers/eventsController');
const { supabase } = require('../config/database');

// Test endpoint to verify route is working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Events route is working',
    timestamp: new Date().toISOString()
  });
});

// PUBLIC: Get all public events (no authentication required)
router.get('/public', async (req, res) => {
  try {
    console.log('📅 Fetching public events...');
    
    res.json({
      success: true,
      message: 'Public events endpoint working',
      data: []
    });

  } catch (error) {
    console.error('❌ Error in public events endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Helper function to format event dates
function formatEventDate(startDateTime, endDateTime) {
  try {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    const dateStr = start.toLocaleDateString('en-US', options).toUpperCase();
    const startTime = start.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
    const endTime = end.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
    
    return `${dateStr} ${startTime} - ${endTime}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date TBD';
  }
}

router.post('/register', registerForEvent);

module.exports = router;
