const express = require('express');
const router = express.Router();
const chatHistoryController = require('../controllers/chatHistoryController');

// Chat session routes
router.post('/sessions', chatHistoryController.createChatSession);
router.get('/sessions', chatHistoryController.getChatSessions);
router.put('/sessions/:sessionId', chatHistoryController.updateSessionName);
router.delete('/sessions/:sessionId', chatHistoryController.deleteChatSession);

// Chat messages routes
router.post('/messages', chatHistoryController.saveMessage);
router.get('/sessions/:sessionId/messages', chatHistoryController.getChatMessages);

module.exports = router; 