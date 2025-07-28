const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
// const { authenticate } = require('../middleware/auth'); // Uncomment if you have auth middleware

// Get user settings
router.get('/:userId', /*authenticate,*/ settingsController.getUserSettings);
// Update user settings
router.put('/:userId', /*authenticate,*/ settingsController.updateUserSettings);
// Export user data
router.get('/:userId/export', /*authenticate,*/ settingsController.exportUserData);
// Delete user account
router.delete('/:userId/account', /*authenticate,*/ settingsController.deleteUserAccount);

module.exports = router; 