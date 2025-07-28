import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, BarChart2, BookOpen, Settings, Menu, X, Plus, Trash2, Edit3 } from 'lucide-react';
import { api } from '../lib/api';

const menu = [
  { name: 'Home', icon: <Home size={20} />, path: '/chat/home' },
  { name: 'Chat', icon: <MessageCircle size={20} />, path: '/chat' },
  { name: 'Mood Tracker', icon: <BarChart2 size={20} />, path: '/chat/mood' },
  { name: 'Journal', icon: <BookOpen size={20} />, path: '/chat/journal' },
  { name: 'Settings', icon: <Settings size={20} />, path: '/chat/settings' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [editingSessionName, setEditingSessionName] = useState(null);
  const [newSessionName, setNewSessionName] = useState('');

  useEffect(() => {
    if (isMobileMenuOpen) {
      loadChatSessions();
    }
  }, [isMobileMenuOpen]);

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
        await loadChatSessions();
        setShowChatHistory(true);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const deleteChatSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this chat session?')) return;
    
    try {
      await api.delete(`/api/chat-history/sessions/${sessionId}`);
      await loadChatSessions();
    } catch (error) {
      console.error('Error deleting chat session:', error);
    }
  };

  const updateSessionName = async (sessionId, newName) => {
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

  const formatDate = (dateString) => {
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
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex bg-gray-900 text-white w-64 min-h-screen flex-col justify-between py-8 px-4">
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="text-2xl font-bold">WAO-CHAT</div>
            <button
              onClick={() => navigate('/')}
              className="px-3 py-2 bg-ngo-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm"
            >
              BACK HOME
            </button>
          </div>
          <nav className="space-y-2">
            {menu.map(item => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="mb-2">
          <hr className="border-gray-700 mb-4" />
          <div className="text-sm text-gray-400 mb-2">Need immediate help?</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-green-400">
              <span className="mr-2">📞</span>
              <span>Crisis Hotline: +254 7118 53928</span>
            </div>
            <div className="flex items-center text-blue-400">
              <span className="mr-2">📞</span>
              <span>Therapist: +254 79567 65298</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-gray-900 text-white flex flex-col py-8 px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="text-2xl font-bold">WAO-CHAT</div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate('/')}
                  className="px-3 py-2 bg-ngo-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm"
                >
                  BACK HOME
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <nav className="space-y-2 flex-1">
              {menu.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowChatHistory(false);
                  }}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Chat History Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-300">Chat History</h3>
                  <button
                    onClick={() => setShowChatHistory(!showChatHistory)}
                    className="text-gray-400 hover:text-white"
                  >
                    {showChatHistory ? '−' : '+'}
                  </button>
                </div>
                
                {showChatHistory && (
                  <div className="space-y-2">
                    <button
                      onClick={createNewChat}
                      className="w-full flex items-center justify-center px-3 py-2 bg-ngo-orange text-white rounded-lg text-sm hover:bg-orange-600 transition"
                    >
                      <Plus size={16} className="mr-2" />
                      New Chat
                    </button>
                    
                    {chatSessions.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm py-4">
                        <MessageCircle size={24} className="mx-auto mb-2 opacity-50" />
                        <p>No chat history yet</p>
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {chatSessions.map((session) => (
                          <div
                            key={session.id}
                            className="p-2 rounded bg-gray-800 hover:bg-gray-700 transition"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
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
                                    className="w-full bg-transparent text-white border-none outline-none text-sm"
                                    autoFocus
                                  />
                                ) : (
                                  <div className="truncate text-sm font-medium">
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
                                  className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white"
                                >
                                  <Edit3 size={12} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChatSession(session.id);
                                  }}
                                  className="p-1 hover:bg-red-600 rounded text-red-400 hover:text-red-200"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </nav>
            
            <div className="mb-2">
              <hr className="border-gray-700 mb-4" />
              <div className="text-sm text-gray-400 mb-2">Need immediate help?</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-green-400">
                  <span className="mr-2">📞</span>
                  <span>Crisis Hotline: +254 7118 53928</span>
                </div>
                <div className="flex items-center text-blue-400">
                  <span className="mr-2">📞</span>
                  <span>Therapist: +254 79567 65298</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ChatLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 flex flex-col md:ml-0">
        <Outlet />
      </main>
    </div>
  );
};

export default ChatLayout; 