const getApiBaseUrl = () => {
  const hostname = window.location.hostname;

  // Development environment
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }

  // Production environment - ALWAYS use Render backend
  // Check if we have a custom API URL from environment
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Default to correct Render backend URL
  return 'https://we-are-one-api.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

// Debug logging for production
console.log('🔍 API Configuration:', {
  hostname: window.location.hostname,
  envVar: import.meta.env.VITE_API_BASE_URL,
  finalUrl: API_BASE_URL
});

export const api = {
  get: async (url: string) => {
    const res = await fetch(`${API_BASE_URL}${url}`, { credentials: 'include' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  post: async (url: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  put: async (url: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  delete: async (url: string) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Helper method to get the base URL
  getBaseUrl: () => API_BASE_URL,
}; 