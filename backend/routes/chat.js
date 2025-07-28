const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Chat with AI
router.post('/message', chatController.chatWithAI);

// Health check for Ollama connection
router.get('/health', chatController.checkOllamaHealth);

module.exports = router; 