const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
// const { authenticate } = require('../middleware/auth'); // Uncomment if you have auth middleware

// Log a new mood
router.post('/', /*authenticate,*/ moodController.logMood);
// Get mood history for a user
router.get('/:userId', /*authenticate,*/ moodController.getMoodHistory);
// Delete a mood entry
router.delete('/:id', /*authenticate,*/ moodController.deleteMood);

module.exports = router; 