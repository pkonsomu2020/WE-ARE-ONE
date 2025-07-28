import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const ChatJournal: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editEntry, setEditEntry] = useState<any | null>(null);

  const fetchEntries = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/journal/${user.id}`);
      setEntries(res.entries || []);
    } catch (err: any) {
      setError('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line
  }, [user]);

  const handleNew = () => {
    setFormData({ title: '', content: '' });
    setEditEntry(null);
    setShowModal(true);
  };

  const handleEdit = (entry: any) => {
    setFormData({ title: entry.title, content: entry.content });
    setEditEntry(entry);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!user || !formData.title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (editEntry) {
        await api.put(`/api/journal/${editEntry.id}`, { title: formData.title, content: formData.content });
      } else {
        await api.post('/api/journal', { 
          user_id: user.id, 
          title: formData.title, 
          content: formData.content 
        });
      }
      setShowModal(false);
      setFormData({ title: '', content: '' });
      setEditEntry(null);
      fetchEntries();
    } catch (err: any) {
      setError('Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/journal/${id}`);
      fetchEntries();
    } catch (err: any) {
      setError('Failed to delete entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-4 sm:p-6 md:p-8 bg-[#101522]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Journal</h2>
        <button
          className="flex items-center justify-center bg-white text-gray-900 font-semibold px-4 py-2 rounded shadow hover:bg-gray-200 transition text-sm sm:text-base"
          onClick={handleNew}
          disabled={loading}
        >
          <Plus size={18} className="mr-2" /> New Entry
        </button>
      </div>
      {error && <div className="text-red-400 mb-4 text-sm sm:text-base">{error}</div>}
      {loading && <div className="text-gray-400 mb-4 text-sm sm:text-base">Loading...</div>}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-gray-800 rounded-lg p-4 sm:p-6 text-white flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="text-lg sm:text-xl font-bold mb-1">{entry.title}</div>
              <div className="text-xs sm:text-sm text-gray-400 mb-2">{new Date(entry.created_at).toLocaleDateString()}</div>
              <div className="text-sm sm:text-base">{entry.content}</div>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <button className="hover:text-ngo-orange p-1" onClick={() => handleEdit(entry)} disabled={loading}><Edit size={18} /></button>
              <button className="hover:text-red-500 p-1" onClick={() => handleDelete(entry.id)} disabled={loading}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">{editEntry ? 'Edit Journal Entry' : 'New Journal Entry'}</h3>
              <button 
                onClick={() => { setShowModal(false); setEditEntry(null); }}
                className="text-gray-400 hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">Express your thoughts and feelings in a safe, private space.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">Title</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-ngo-orange text-sm sm:text-base"
                  placeholder="Give your entry a title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">Journal Entry</label>
                <textarea
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-ngo-orange resize-none text-sm sm:text-base"
                  rows={6}
                  placeholder="Write your thoughts here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setEditEntry(null); }}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title.trim() || loading}
                className="px-4 py-2 bg-white text-gray-900 rounded hover:bg-gray-200 transition disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? 'Saving...' : (editEntry ? 'Save Changes' : 'Save Entry')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatJournal; 