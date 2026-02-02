const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  sendManualReminder,
  processAutomaticReminders,
  checkDateAvailability,
  getStats
} = require('../controllers/eventSchedulerController');
const { authenticateAdmin } = require('../middleware/auth');
const { supabase, supabaseAdmin } = require('../config/database');

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Test endpoint to verify route is working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Event Scheduler route is working',
    timestamp: new Date().toISOString()
  });
});

// Event CRUD operations
router.post('/events', createEvent);
router.get('/events', getEvents);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Check date availability (prevent double booking)
router.post('/check-availability', async (req, res) => {
  try {
    const { startDateTime, endDateTime, excludeEventId } = req.body;
    
    if (!startDateTime || !endDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Start and end datetime are required'
      });
    }

    const conflicts = await checkDateAvailability(startDateTime, endDateTime, excludeEventId);
    
    res.json({
      success: true,
      available: conflicts.length === 0,
      conflicts: conflicts
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability'
    });
  }
});

// Reminder operations
router.post('/events/:id/send-reminder', sendManualReminder);
router.post('/process-reminders', processAutomaticReminders);

// Get event statistics
router.get('/stats', getStats);

// Get notification history
router.get('/notifications', async (req, res) => {
  try {
    const { eventId, limit = 50 } = req.query;
    
    let query = supabase
      .from('event_notifications')
      .select(`
        *,
        scheduled_events (
          title
        )
      `)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data: notifications, error } = await query;

    if (error) {
      throw error;
    }

    // Format the response
    const formattedNotifications = (notifications || []).map(notification => ({
      ...notification,
      event_title: notification.scheduled_events?.title || 'Unknown Event'
    }));
    
    res.json({
      success: true,
      data: formattedNotifications
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

module.exports = router;
