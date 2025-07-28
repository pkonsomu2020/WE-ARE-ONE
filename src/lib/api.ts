const API_BASE_URL = 'http://localhost:3000';

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
}; 