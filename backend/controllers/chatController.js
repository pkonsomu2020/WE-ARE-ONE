const axios = require('axios');
const { pool } = require('../config/database');
require('dotenv').config();

// Ollama API configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:0.6b';

// System prompt for comprehensive AI assistant
const systemPrompt = `You are WAO-CHAT, a comprehensive AI assistant designed to help with a wide range of topics. Your capabilities include:

MENTAL HEALTH & WELLNESS:
- Provide empathetic support for mental health challenges
- Offer coping strategies for stress, anxiety, depression, and addiction
- Guide users to professional help when needed
- Promote self-care and emotional well-being

PHYSICAL HEALTH & SAFETY:
- Provide general health information and wellness tips
- Offer safety advice for various situations
- Share first aid and emergency response guidance
- Discuss healthy lifestyle choices (nutrition, exercise, sleep)

GENERAL KNOWLEDGE & ASSISTANCE:
- Answer questions about various topics
- Provide educational information
- Help with problem-solving and decision-making
- Offer practical advice for daily life

CONVERSATION STYLE:
- Be warm, understanding, and non-judgmental
- Keep responses concise but helpful (2-4 sentences)
- Adapt your tone to the topic and user's needs
- Be informative while remaining supportive

IMPORTANT GUIDELINES:
- Respond directly and naturally without special tags like <think>
- For medical emergencies, always recommend contacting professionals
- For mental health crises, provide crisis hotline information
- Be honest about limitations and encourage professional consultation when appropriate
- Maintain a helpful, friendly tone across all topics

Remember: You are a supportive companion, not a replacement for professional medical, mental health, or emergency services.`;

exports.chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory = [], sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Prepare conversation history for Ollama (limit to last 8 messages for better context)
    let fullPrompt = systemPrompt + '\n\n';
    
    // Add only the last 8 messages for better context while maintaining speed
    const recentHistory = conversationHistory.slice(-8);
    recentHistory.forEach(msg => {
      if (msg.sender === 'user') {
        fullPrompt += `User: ${msg.text}\n`;
      } else {
        fullPrompt += `Assistant: ${msg.text}\n`;
      }
    });
    
    // Add current message
    fullPrompt += `User: ${message}\nAssistant:`;

    // Call Ollama API
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: OLLAMA_MODEL,
      prompt: fullPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 200, // Slightly increased for more detailed responses
      }
    });

    let aiResponse = response.data.response.trim();
    
    // Clean up any thinking tags or internal reasoning
    aiResponse = aiResponse.replace(/<think>.*?<\/think>/gs, '').trim();
    aiResponse = aiResponse.replace(/<reasoning>.*?<\/reasoning>/gs, '').trim();
    aiResponse = aiResponse.replace(/<internal>.*?<\/internal>/gs, '').trim();
    
    // If response is empty after cleaning, provide a fallback
    if (!aiResponse) {
      aiResponse = "I'm here to listen and support you. How are you feeling right now?";
    }

    // Save messages to database if sessionId is provided
    if (sessionId) {
      try {
        // Save user message
        await pool.execute(
          'INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)',
          [sessionId, 'user', message]
        );
        
        // Save AI response
        await pool.execute(
          'INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)',
          [sessionId, 'ai', aiResponse]
        );
        
        // Update session timestamp
        await pool.execute(
          'UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [sessionId]
        );
      } catch (dbError) {
        console.error('Error saving to database:', dbError);
        // Continue with response even if database save fails
      }
    }

    res.json({
      success: true,
      response: aiResponse,
      conversationHistory: [
        ...conversationHistory,
        { sender: 'user', text: message },
        { sender: 'ai', text: aiResponse }
      ]
    });

  } catch (error) {
    console.error('Ollama API Error:', error);
    
    // Fallback response if Ollama fails
    const fallbackResponse = "I'm having trouble connecting right now, but I'm here for you. Would you like to try again or talk about what's on your mind?";
    
    res.json({
      success: true,
      response: fallbackResponse,
      conversationHistory: [
        ...(req.body.conversationHistory || []),
        { sender: 'user', text: req.body.message },
        { sender: 'ai', text: fallbackResponse }
      ]
    });
  }
};

// Health check for Ollama connection
exports.checkOllamaHealth = async (req, res) => {
  try {
    // First check if Ollama is running
    const healthResponse = await axios.get(`${OLLAMA_BASE_URL}/api/tags`);
    
    // Test the model with a simple prompt
    const testResponse = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: OLLAMA_MODEL,
      prompt: 'Hello, how are you?',
      stream: false,
      options: {
        max_tokens: 10,
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Ollama connection is working',
      model: OLLAMA_MODEL,
      response: testResponse.data.response.trim(),
      availableModels: healthResponse.data.models
    });
  } catch (error) {
    console.error('Ollama Health Check Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ollama connection failed',
      error: error.message,
      suggestion: 'Make sure Ollama is running with: ollama serve'
    });
  }
}; 