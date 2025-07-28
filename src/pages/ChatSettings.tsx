import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const ChatSettings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    darkMode: true,
    moodReminders: false,
    dataRetentionDays: 30
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get(`/api/settings/${user.id}`);
      if (response.success) {
        setSettings(response.settings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedSettings = { ...settings, [key]: value };
      const response = await api.put(`/api/settings/${user.id}`, updatedSettings);
      if (response.success) {
        setSettings(updatedSettings);
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const exportData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get(`/api/settings/${user.id}/export`);
      if (response.success) {
        // Create and download file
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wao-chat-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setMessage({ type: 'success', text: 'Data exported successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export data' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const deleteAccount = async () => {
    if (!user || !confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    setLoading(true);
    try {
      const response = await api.delete(`/api/settings/${user.id}/account`);
      if (response.success) {
        setMessage({ type: 'success', text: 'Account deleted successfully' });
        // Redirect to logout or home page
        window.location.href = '/';
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete account' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };
  return (
    <div className="w-full h-full p-4 sm:p-6 md:p-8 text-white flex flex-col items-center bg-[#101522]">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Settings</h2>
      
      {/* Message Display */}
      {message && (
        <div className={`mb-4 px-4 py-2 rounded text-sm sm:text-base ${
          message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-3xl w-full mx-auto mb-6 sm:mb-8 px-4">
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
          <div className="font-bold text-base sm:text-lg mb-2">Appearance</div>
          <div className="mb-2 text-gray-300 text-sm sm:text-base">Customize how the application looks</div>
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base">Dark Mode</span>
            <button
              onClick={() => updateSetting('darkMode', !settings.darkMode)}
              disabled={loading}
              className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                settings.darkMode ? 'bg-ngo-orange' : 'bg-gray-700'
              }`}
            >
              <span className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.darkMode ? 'ml-5' : 'ml-1'
              }`}></span>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
          <div className="font-bold text-base sm:text-lg mb-2">Notifications</div>
          <div className="mb-2 text-gray-300 text-sm sm:text-base">Manage your notification preferences</div>
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base">Mood Check-in Reminders</span>
            <button
              onClick={() => updateSetting('moodReminders', !settings.moodReminders)}
              disabled={loading}
              className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                settings.moodReminders ? 'bg-ngo-orange' : 'bg-gray-700'
              }`}
            >
              <span className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.moodReminders ? 'ml-5' : 'ml-1'
              }`}></span>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 md:col-span-2">
          <div className="font-bold text-base sm:text-lg mb-2">Privacy & Data</div>
          <div className="mb-2 text-gray-300 text-sm sm:text-base">Control your data and privacy settings</div>
          <div className="mb-2 text-sm sm:text-base">Data Retention Period</div>
          <select 
            className="w-full bg-gray-700 text-white p-2 rounded mb-4 text-sm sm:text-base"
            value={settings.dataRetentionDays}
            onChange={(e) => updateSetting('dataRetentionDays', parseInt(e.target.value))}
            disabled={loading}
          >
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={365}>1 year</option>
            <option value={0}>Forever</option>
          </select>
          <button 
            onClick={exportData}
            disabled={loading}
            className="w-full bg-gray-700 text-white py-2 rounded mb-2 text-sm sm:text-base hover:bg-gray-600 transition disabled:opacity-50"
          >
            {loading ? 'Exporting...' : 'Export Your Data'}
          </button>
          <button 
            onClick={deleteAccount}
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded text-sm sm:text-base hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Account & Data'}
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="text-gray-400 text-sm sm:text-base">
          Saving settings...
        </div>
      )}
    </div>
  );
};

export default ChatSettings; 