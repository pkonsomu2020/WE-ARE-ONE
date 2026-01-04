const express = require('express');
const router = express.Router();
const { register, login, getProfile, forgotPassword, resetPassword, getResetToken, testEmail } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/get-reset-token', getResetToken); // Temporary endpoint for testing
router.post('/test-email', testEmail); // Temporary endpoint for email testing

// Protected routes
router.get('/profile', authenticateToken, getProfile);

module.exports = router;