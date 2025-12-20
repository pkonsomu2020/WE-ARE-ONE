const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  sendManualReminder,
  processAutomaticReminders,
  checkDateAvailability
} = require('../controllers/eventSchedulerController');
const { authenticateAdmin } = require('../middleware/auth');

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
router.get('/stats', async (req, res) => {
  try {
    const { pool } = require('../config/database');
    
    // Get various statistics
    const [totalEvents] = await pool.execute(
      'SELECT COUNT(*) as count FROM scheduled_events WHERE status = "scheduled"'
    );
    
    const [thisWeekEvents] = await pool.execute(
      `SELECT COUNT(*) as count FROM scheduled_events 
       WHERE status = "scheduled" 
       AND start_datetime >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
       AND start_datetime < DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY)`
    );
    
    const [meetingsCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM scheduled_events WHERE type = "meeting" AND status = "scheduled"'
    );
    
    const [pendingReminders] = await pool.execute(
      `SELECT COUNT(*) as count FROM scheduled_events 
       WHERE status = "scheduled" AND reminder_sent = 0 
       AND start_datetime > NOW()`
    );
    
    const [upcomingEvents] = await pool.execute(
      `SELECT 
        se.*,
        COUNT(ea.id) as attendee_count
       FROM scheduled_events se
       LEFT JOIN event_attendees ea ON se.id = ea.event_id
       WHERE se.status = "scheduled" 
       AND se.start_datetime > NOW()
       GROUP BY se.id
       ORDER BY se.start_datetime ASC
       LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        totalEvents: totalEvents[0].count,
        thisWeekEvents: thisWeekEvents[0].count,
        meetingsCount: meetingsCount[0].count,
        pendingReminders: pendingReminders[0].count,
        upcomingEvents: upcomingEvents.map(event => ({
          id: event.id,
          title: event.title,
          type: event.type,
          start: event.start_datetime,
          end: event.end_datetime,
          location: event.location,
          attendeeCount: event.attendee_count
        }))
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Get notification history
router.get('/notifications', async (req, res) => {
  try {
    const { pool } = require('../config/database');
    const { eventId, limit = 50 } = req.query;
    
    let query = `
      SELECT 
        en.*,
        se.title as event_title
      FROM event_notifications en
      JOIN scheduled_events se ON en.event_id = se.id
    `;
    
    const params = [];
    
    if (eventId) {
      query += ' WHERE en.event_id = ?';
      params.push(eventId);
    }
    
    query += ' ORDER BY en.created_at DESC LIMIT ?';
    params.push(parseInt(limit));
    
    const [notifications] = await pool.execute(query, params);
    
    res.json({
      success: true,
      data: notifications
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
