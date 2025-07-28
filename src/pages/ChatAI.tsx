import React, { useState, useRef, useEffect } from 'react';
import { Plus, MessageCircle, Trash2, Edit3, MoreVertical } from 'lucide-react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface Message {
  id?: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp?: string;
}

interface ChatSession {
  id: number;
  session_name: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message_time: string;
}

const initialMessages = [
  {
    sender: 'ai' as const,
    text: "Hi there! How are you feeling today? I'm here to listen and help."
  }
];

const ChatAI: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const [editingSessionName, setEditingSessionName] = useState<number | null>(null);
  const [newSessionName, setNewSessionName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    loadChatSessions();
  }, []);

  const loadChatSessions = async () => {
    try {
      const response = await api.get('/api/chat-history/sessions');
      if (response.success) {
        setChatSessions(response.sessions);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await api.post('/api/chat-history/sessions', {
        sessionName: 'New Chat'
      });
      
      if (response.success) {
        setCurrentSessionId(response.sessionId);
        setMessages(initialMessages);
        await loadChatSessions();
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const loadChatSession = async (sessionId: number) => {
    try {
      const response = await api.get(`/api/chat-history/sessions/${sessionId}/messages`);
      if (response.success) {
        setMessages(response.messages);
        setCurrentSessionId(sessionId);
      }
    } catch (error) {
      console.error('Error loading chat session:', error);
    }
  };

  const deleteChatSession = async (sessionId: number) => {
    if (!confirm('Are you sure you want to delete this chat session?')) return;
    
    try {
      await api.delete(`/api/chat-history/sessions/${sessionId}`);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages(initialMessages);
      }
      await loadChatSessions();
    } catch (error) {
      console.error('Error deleting chat session:', error);
    }
  };

  const updateSessionName = async (sessionId: number, newName: string) => {
    try {
      await api.put(`/api/chat-history/sessions/${sessionId}`, {
        sessionName: newName
      });
      setEditingSessionName(null);
      setNewSessionName('');
      await loadChatSessions();
    } catch (error) {
      console.error('Error updating session name:', error);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const userMsg = { sender: 'user' as const, text: userMessage };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a new session if none exists
      let sessionId = currentSessionId;
      if (!sessionId) {
        const sessionResponse = await api.post('/api/chat-history/sessions', {
          sessionName: userMessage.substring(0, 30) + '...'
        });
        if (sessionResponse.success) {
          sessionId = sessionResponse.sessionId;
          setCurrentSessionId(sessionId);
          await loadChatSessions();
        }
      }

      // Prepare conversation history (excluding the initial greeting)
      const conversationHistory = messages.slice(1);
      
      const response = await api.post('/api/chat/message', {
        message: userMessage,
        conversationHistory: conversationHistory,
        sessionId: sessionId
      });

      if (response.success) {
        setMessages(prev => [...prev, { sender: 'ai', text: response.response }]);
        await loadChatSessions(); // Refresh session list to update message count
      } else {
        throw new Error('Failed to get response from AI');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackResponse = "I'm having trouble connecting right now, but I'm here for you. Would you like to try again or talk about what's on your mind?";
      setMessages(prev => [...prev, { sender: 'ai', text: fallbackResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex h-full w-full bg-[#101522]">
      {/* Chat History Sidebar - Hidden on mobile, shown on larger screens */}
      {showHistory && (
        <div className="hidden md:flex w-80 lg:w-80 md:w-72 bg-[#1a1f2e] border-r border-[#2d3748] flex-col">
          <div className="p-3 sm:p-4 border-b border-[#2d3748]">
            <button
              onClick={createNewChat}
              className="w-full bg-ngo-orange text-white px-3 sm:px-4 py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center text-sm sm:text-base"
            >
              <Plus size={18} className="mr-2" />
              New Chat
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chatSessions.length === 0 ? (
              <div className="p-3 sm:p-4 text-gray-400 text-center">
                <MessageCircle size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm sm:text-base">No chat history yet</p>
                <p className="text-xs sm:text-sm">Start a new conversation to see it here</p>
              </div>
            ) : (
              <div className="p-2">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-2 sm:p-3 rounded-lg mb-2 cursor-pointer transition group ${
                      currentSessionId === session.id
                        ? 'bg-[#2d3748] text-white'
                        : 'hover:bg-[#2d3748] text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex-1 min-w-0"
                        onClick={() => loadChatSession(session.id)}
                      >
                        {editingSessionName === session.id ? (
                          <input
                            type="text"
                            value={newSessionName}
                            onChange={(e) => setNewSessionName(e.target.value)}
                            onBlur={() => updateSessionName(session.id, newSessionName)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateSessionName(session.id, newSessionName);
                              }
                            }}
                            className="w-full bg-transparent text-white border-none outline-none text-sm sm:text-base"
                            autoFocus
                          />
                        ) : (
                          <div className="truncate font-medium text-sm sm:text-base">
                            {session.session_name}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {session.message_count} messages • {formatDate(session.updated_at)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSessionName(session.id);
                            setNewSessionName(session.session_name);
                          }}
                          className="p-1 hover:bg-[#4a5568] rounded opacity-0 group-hover:opacity-100 transition"
                          title="Edit name"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChatSession(session.id);
                          }}
                          className="p-1 hover:bg-red-600 rounded opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-200"
                          title="Delete chat"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-[#1a1f2e] border-r border-[#2d3748] flex flex-col">
            <div className="p-3 sm:p-4 border-b border-[#2d3748]">
              <button
                onClick={createNewChat}
                className="w-full bg-ngo-orange text-white px-3 sm:px-4 py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center text-sm sm:text-base"
              >
                <Plus size={18} className="mr-2" />
                New Chat
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {chatSessions.length === 0 ? (
                <div className="p-3 sm:p-4 text-gray-400 text-center">
                  <MessageCircle size={40} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm sm:text-base">No chat history yet</p>
                  <p className="text-xs sm:text-sm">Start a new conversation to see it here</p>
                </div>
              ) : (
                <div className="p-2">
                  {chatSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-2 sm:p-3 rounded-lg mb-2 cursor-pointer transition group ${
                        currentSessionId === session.id
                          ? 'bg-[#2d3748] text-white'
                          : 'hover:bg-[#2d3748] text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="flex-1 min-w-0"
                          onClick={() => {
                            loadChatSession(session.id);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {editingSessionName === session.id ? (
                            <input
                              type="text"
                              value={newSessionName}
                              onChange={(e) => setNewSessionName(e.target.value)}
                              onBlur={() => updateSessionName(session.id, newSessionName)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  updateSessionName(session.id, newSessionName);
                                }
                              }}
                              className="w-full bg-transparent text-white border-none outline-none text-sm sm:text-base"
                              autoFocus
                            />
                          ) : (
                            <div className="truncate font-medium text-sm sm:text-base">
                              {session.session_name}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {session.message_count} messages • {formatDate(session.updated_at)}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSessionName(session.id);
                              setNewSessionName(session.session_name);
                            }}
                            className="p-1 hover:bg-[#4a5568] rounded opacity-0 group-hover:opacity-100 transition"
                            title="Edit name"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChatSession(session.id);
                            }}
                            className="p-1 hover:bg-red-600 rounded opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-200"
                            title="Delete chat"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 bg-[#232c36] border-b border-[#2d3748] flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="mr-2 sm:mr-4 p-2 hover:bg-[#2d3748] rounded-lg transition hidden md:block"
              >
                <MessageCircle size={20} className="text-white" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="mr-2 sm:mr-4 p-2 hover:bg-[#2d3748] rounded-lg transition md:hidden"
              >
                <MessageCircle size={20} className="text-white" />
              </button>
              <h1 className="text-white text-lg sm:text-xl font-semibold">Chat with AI Assistant</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-ngo-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm"
              >
                BACK HOME
              </button>
              {currentSessionId && (
                <div className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                  Session #{currentSessionId}
                </div>
              )}
            </div>
          </div>

                  {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.sender === 'user'
                  ? 'flex justify-end'
                  : 'flex justify-start'
              }
            >
              <div
                className={
                  msg.sender === 'user'
                    ? 'bg-ngo-orange text-white px-3 sm:px-5 py-3 rounded-lg max-w-xs sm:max-w-xl text-right'
                    : 'bg-[#232c36] text-white px-3 sm:px-5 py-3 rounded-lg max-w-xs sm:max-w-xl'
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#232c36] text-white px-5 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse">Thinking</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex items-center bg-[#232c36] px-4 sm:px-6 py-4 border-t border-[#2d3748]">
          <input
            type="text"
            className="flex-1 rounded-l-lg px-3 sm:px-4 py-3 bg-[#2d3748] text-white focus:outline-none placeholder-gray-400 border-none text-sm sm:text-base"
            placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-ngo-orange text-white px-4 sm:px-8 py-3 rounded-r-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAI; 