const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:3000";
const ADMIN_KEY = (import.meta.env.VITE_ADMIN_API_KEY as string) || "";

let ADMIN_TOKEN: string | null = (typeof localStorage !== 'undefined' && localStorage.getItem('wao_admin_token')) || null;

export function setAdminToken(token: string | null) {
  ADMIN_TOKEN = token;
  try {
    if (token) localStorage.setItem('wao_admin_token', token);
    else localStorage.removeItem('wao_admin_token');
  } catch {}
}

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': ADMIN_KEY,
      ...(ADMIN_TOKEN ? { 'Authorization': `Bearer ${ADMIN_TOKEN}` } : {}),
      ...(init?.headers || {})
    },
    credentials: 'include'
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getBaseUrl: () => API_BASE_URL,
  adminLogin: async (data: { email: string; password: string }) => {
    const res = await request('/api/admin/auth/login', { method: 'POST', body: JSON.stringify(data) });
    if (res?.token) setAdminToken(res.token);
    return res;
  },
  adminRegister: async (data: { fullName: string; email: string; password: string }) => {
    const res = await request('/api/admin/auth/register', { method: 'POST', body: JSON.stringify(data) });
    if (res?.token) setAdminToken(res.token);
    return res;
  },
  listPayments: () => request('/api/admin/event-payments'),
  getPayment: (id: number) => request(`/api/admin/event-payments/${id}`),
  updatePayment: (id: number, data: { status: 'paid' | 'failed' | 'pending_verification'; reason?: string }) =>
    request(`/api/admin/event-payments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

