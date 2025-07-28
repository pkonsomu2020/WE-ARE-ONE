import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import Chart from 'chart.js/auto';

const moods = [
  { label: 'Very Bad', icon: '😢', value: 1 },
  { label: 'Bad', icon: '😞', value: 2 },
  { label: 'Neutral', icon: '😐', value: 3 },
  { label: 'Good', icon: '🙂', value: 4 },
  { label: 'Very Good', icon: '😃', value: 5 },
];

const ChatMood: React.FC = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/mood/${user.id}`);
      setHistory(res.moods || []);
    } catch (err: any) {
      setError('Failed to load mood history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (chartRef.current && history.length > 0) {
      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Prepare data for chart
        const chartData = history.slice(0, 7).reverse().map(entry => ({
          x: new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          y: entry.mood_value
        }));

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [{
              label: 'Mood Score',
              data: chartData,
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              borderWidth: 2,
              fill: false,
              tension: 0.4,
              pointBackgroundColor: '#8b5cf6',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                min: 1,
                max: 5,
                ticks: {
                  stepSize: 1,
                  color: '#ffffff',
                  font: {
                    size: 12
                  }
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              },
              x: {
                ticks: {
                  color: '#ffffff',
                  font: {
                    size: 12
                  }
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [history]);

  const handleLog = async () => {
    if (!selected || !user) return;
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/mood', {
        user_id: user.id,
        mood_value: selected,
        note,
      });
      setSelected(null);
      setNote('');
      fetchHistory();
    } catch (err: any) {
      setError('Failed to log mood');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/mood/${id}`);
      fetchHistory();
    } catch (err: any) {
      setError('Failed to delete mood entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full p-4 sm:p-6 md:p-8 gap-4 sm:gap-6 md:gap-8 bg-[#101522]">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 flex-1 text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">How are you feeling today?</h2>
        <p className="text-gray-300 mb-4 text-sm sm:text-base">Track your mood to identify patterns over time</p>
        <div className="flex justify-center sm:justify-start space-x-2 sm:space-x-4 mb-4">
          {moods.map(mood => (
            <button
              key={mood.value}
              className={`text-3xl sm:text-4xl px-2 py-1 rounded-full border-2 ${selected === mood.value ? 'border-ngo-orange' : 'border-transparent'}`}
              onClick={() => setSelected(mood.value)}
            >
              <span role="img" aria-label={mood.label}>{mood.icon}</span>
            </button>
          ))}
        </div>
        <div className="mb-4 text-gray-300 text-center sm:text-left">{selected ? moods.find(m => m.value === selected)?.label : 'Select your mood'}</div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Notes (optional)</label>
          <textarea
            className="w-full rounded bg-gray-700 text-white p-2 resize-none text-sm sm:text-base"
            rows={3}
            placeholder="What's contributing to your mood today?"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-gray-700 text-white py-2 rounded font-semibold mt-2 disabled:opacity-50 text-sm sm:text-base"
          onClick={handleLog}
          disabled={!selected || loading}
        >
          {loading ? 'Logging...' : "Log Today's Mood"}
        </button>
        {error && <div className="text-red-400 mt-2 text-sm">{error}</div>}
      </div>
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 flex-1 text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Your Mood History</h2>
        <p className="text-gray-300 mb-4 text-sm sm:text-base">View your mood patterns over the past week</p>
        {loading && <div className="text-gray-400">Loading...</div>}
        <div className="mb-6" style={{ height: '200px' }}>
          <canvas ref={chartRef}></canvas>
        </div>
        <div>
          <div className="font-semibold mb-2 text-sm sm:text-base">Recent entries:</div>
          {history.map((entry) => (
            <div key={entry.id} className="mb-2 p-2 bg-gray-900 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="text-xs sm:text-sm">{new Date(entry.created_at).toLocaleDateString()} <span className="ml-2">Mood: {entry.mood_value}/5</span></div>
                {entry.note && <div className="text-xs text-gray-400 mt-1">{entry.note}</div>}
              </div>
              <button
                className="mt-2 sm:mt-0 sm:ml-4 text-red-400 hover:text-red-600 text-xs sm:text-sm"
                onClick={() => handleDelete(entry.id)}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMood; 