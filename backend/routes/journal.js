const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
// const { authenticate } = require('../middleware/auth'); // Uncomment if you have auth middleware

// Create a new journal entry
router.post('/', /*authenticate,*/ journalController.createEntry);
// Get all journal entries for a user
router.get('/:userId', /*authenticate,*/ journalController.getEntries);
// Update a journal entry
router.put('/:id', /*authenticate,*/ journalController.updateEntry);
// Delete a journal entry
router.delete('/:id', /*authenticate,*/ journalController.deleteEntry);

module.exports = router; 