// Production environment - using correct Render backend URL
// Check if we have a custom API URL from environment, otherwise use the correct Render URL
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "https://wao-backend.onrender.com";
const ADMIN_KEY = (import.meta.env.VITE_ADMIN_API_KEY as string) || "3090375ecb2326add24b37c7fd9b5fce4959c766677cdd4fd32eb67fa383db44";

let ADMIN_TOKEN: string | null = (typeof localStorage !== 'undefined' && localStorage.getItem('wao_admin_token')) || null;

export function setAdminToken(token: string | null) {
  ADMIN_TOKEN = token;
  try {
    if (token) localStorage.setItem('wao_admin_token', token);
    else localStorage.removeItem('wao_admin_token');
  } catch { }
}

async function request(path: string, init?: RequestInit) {
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init?.headers as Record<string, string>) || {})
  };

  // PRIORITIZE JWT TOKEN - only use admin key as fallback
  if (ADMIN_TOKEN) {
    headers['Authorization'] = `Bearer ${ADMIN_TOKEN}`;
  } else {
    headers['x-admin-key'] = ADMIN_KEY;
  }

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: 'include'
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('❌ Admin API Error:', { status: res.status, text, url });
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getBaseUrl: () => API_BASE_URL,
  adminLogin: async (data: { email: string; password: string }) => {
    const res = await request('/api/admin/auth/login', { method: 'POST', body: JSON.stringify(data) });
    if (res?.token) {
      setAdminToken(res.token);
      // Store admin profile data
      if (res?.admin) {
        try {
          localStorage.setItem('wao_admin_profile', JSON.stringify(res.admin));
        } catch (e) {
          console.error('Failed to store admin profile:', e);
        }
      }
    }
    return res;
  },
  getAdminProfile: () => {
    try {
      const profile = localStorage.getItem('wao_admin_profile');
      return profile ? JSON.parse(profile) : null;
    } catch {
      return null;
    }
  },
  clearAdminProfile: () => {
    try {
      localStorage.removeItem('wao_admin_profile');
    } catch {}
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

  // Dashboard and organization data
  getDashboardStats: () => request('/api/admin/dashboard/stats'),
  getMissionVision: async () => {
    try {
      // Try to fetch from admin settings first
      const res = await request('/api/admin/dashboard/mission-vision');
      return res;
    } catch (error) {
      // Fallback to hardcoded values from the main website
      return {
        success: true,
        data: {
          mission: "To provide comprehensive mental health support, foster community connections, and create safe spaces for healing and growth through accessible resources, peer support, and professional guidance. We are committed to fostering mental wellness, building resilient communities, and ensuring that no one faces their challenges alone.",
          vision: "A world where mental health is prioritized, stigma is eliminated, and every individual has access to the support they need to thrive emotionally, mentally, and socially. We envision communities where mental wellness is valued equally with physical health.",
          lastUpdated: new Date().toLocaleDateString(),
          source: 'website',
          missionPoints: [
            {
              title: "Support & Community",
              description: "Creating safe spaces where individuals can share their experiences, find understanding, and build meaningful connections with others who understand their journey."
            },
            {
              title: "Education & Awareness",
              description: "Raising awareness about mental health issues, reducing stigma, and providing educational resources to empower individuals and families."
            },
            {
              title: "Advocacy & Policy Change",
              description: "Advocating for better mental health policies, improved access to services, and systemic changes that benefit our community."
            },
            {
              title: "Peer Mentorship",
              description: "Connecting individuals with trained peer mentors who can provide guidance, support, and hope based on lived experience."
            }
          ]
        }
      };
    }
  },

  // Event Scheduler API
  eventScheduler: {
    // Get all events
    getEvents: (params?: { startDate?: string; endDate?: string; type?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.type) queryParams.append('type', params.type);

      const queryString = queryParams.toString();
      return request(`/api/event-scheduler/events${queryString ? `?${queryString}` : ''}`);
    },

    // Create new event
    createEvent: (data: {
      title: string;
      type: 'meeting' | 'organization_event' | 'reminder';
      description?: string;
      date: string;
      startTime: string;
      endTime: string;
      location?: string;
      meetingLink?: string;
      attendees?: string;
      isRecurring?: boolean;
      recurrencePattern?: string;
    }) => request('/api/event-scheduler/events', { method: 'POST', body: JSON.stringify(data) }),

    // Update event
    updateEvent: (id: number, data: any) =>
      request(`/api/event-scheduler/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    // Delete event
    deleteEvent: (id: number) =>
      request(`/api/event-scheduler/events/${id}`, { method: 'DELETE' }),

    // Check date availability
    checkAvailability: (data: { startDateTime: string; endDateTime: string; excludeEventId?: number }) =>
      request('/api/event-scheduler/check-availability', { method: 'POST', body: JSON.stringify(data) }),

    // Send manual reminder
    sendReminder: (id: number) =>
      request(`/api/event-scheduler/events/${id}/send-reminder`, { method: 'POST' }),

    // Get statistics
    getStats: () => request('/api/event-scheduler/stats'),

    // Get notification history
    getNotifications: (params?: { eventId?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.eventId) queryParams.append('eventId', params.eventId.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      return request(`/api/event-scheduler/notifications${queryString ? `?${queryString}` : ''}`);
    },

    // Process reminders manually (for testing)
    processReminders: () => request('/api/event-scheduler/process-reminders', { method: 'POST' })
  },

  // Admin Settings API
  settings: {
    // Profile Management
    getProfile: () => request('/api/admin-settings/profile'),
    updateProfile: (data: { fullName: string; email: string; phone: string }) =>
      request('/api/admin-settings/profile', { method: 'PUT', body: JSON.stringify(data) }),
    changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
      request('/api/admin-settings/profile/change-password', { method: 'POST', body: JSON.stringify(data) }),

    // System Settings
    getSystemSettings: () => request('/api/admin-settings/system'),
    updateSystemSettings: (data: any) =>
      request('/api/admin-settings/system', { method: 'PUT', body: JSON.stringify(data) }),

    // Notification Settings
    getNotificationSettings: () => request('/api/admin-settings/notifications'),
    updateNotificationSettings: (data: any) =>
      request('/api/admin-settings/notifications', { method: 'PUT', body: JSON.stringify(data) }),
    sendTestNotification: (data: { type: string; recipient: string }) =>
      request('/api/admin-settings/notifications/test', { method: 'POST', body: JSON.stringify(data) }),

    // Data Management
    exportData: (data: { type: string; format: string }) =>
      request('/api/admin-settings/data/export', { method: 'POST', body: JSON.stringify(data) }),
    createBackup: () => request('/api/admin-settings/data/backup', { method: 'POST' }),
    getStorageInfo: () => request('/api/admin-settings/data/storage'),

    // Danger Zone
    clearAllData: (data: { confirmation: string }) =>
      request('/api/admin-settings/data/clear-all', { method: 'POST', body: JSON.stringify(data) }),

    // Utility
    getStats: () => request('/api/admin-settings/stats'),
    getHealth: () => request('/api/admin-settings/health')
  },

  // Notifications API
  notifications: {
    getAll: (params?: { limit?: number; offset?: number }) => {
      const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
      return request(`/api/notifications${query}`);
    },
    getUnreadCount: () => request('/api/notifications/unread-count'),
    create: (data: {
      title: string;
      message: string;
      type?: 'success' | 'info' | 'warning' | 'error';
      source?: 'event' | 'feedback' | 'file' | 'settings' | 'system';
      actionUrl?: string;
    }) => request('/api/notifications', { method: 'POST', body: JSON.stringify(data) }),
    markAsRead: (id: number) => request(`/api/notifications/${id}/read`, { method: 'PUT' }),
    markAllAsRead: () => request('/api/notifications/mark-all-read', { method: 'PUT' }),
    delete: (id: number) => request(`/api/notifications/${id}`, { method: 'DELETE' }),
    clearAll: () => request('/api/notifications', { method: 'DELETE' }),
    cleanOld: (daysOld?: number) =>
      request('/api/notifications/clean-old', {
        method: 'POST',
        body: JSON.stringify({ daysOld: daysOld || 30 })
      })
  },
};

