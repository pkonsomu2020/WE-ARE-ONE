// Create our own request function since api.request doesn't exist
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "https://weareone.co.ke";
const ADMIN_KEY = (import.meta.env.VITE_ADMIN_API_KEY as string) || "3090375ecb2326add24b37c7fd9b5fce4959c766677cdd4fd32eb67fa383db44";

async function request(path: string, init?: RequestInit) {
  let ADMIN_TOKEN: string | null = null;
  try {
    ADMIN_TOKEN = localStorage.getItem('wao_admin_token');
  } catch { }

  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // Add any custom headers from init
  if (init?.headers) {
    const initHeaders = init.headers as Record<string, string>;
    Object.keys(initHeaders).forEach(key => {
      headers[key] = initHeaders[key];
    });
  }

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
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface AdminProfile {
  id: number | null;
  fullName: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  role?: string;
  status?: string;
}

export interface FeedbackMessage {
  id: number;
  admin_profile_id?: number;
  name: string;
  email: string;
  phone: string;
  type: 'complaint' | 'suggestion' | 'announcement';
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'in_progress' | 'resolved';
  subject: string;
  message: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  admin_name?: string;
  replies_count?: number;
  last_reply_by?: string;
  last_reply_at?: string;
}

export interface FeedbackReply {
  id: number;
  message_id: number;
  admin_profile_id?: number;
  reply_text: string;
  created_at: string;
  admin_name?: string;
  responder_name?: string;
  responder_email?: string;
  responder_role?: string;
}

export interface FeedbackStats {
  totalMessages: number;
  byStatus: Array<{ status: string; count: number }>;
  byType: Array<{ type: string; count: number }>;
  byPriority: Array<{ priority: string; count: number }>;
}

class FeedbackAPI {
  private baseUrl = '/api/feedback';

  // Get current admin profile for auto-filling forms
  async getAdminProfile(): Promise<AdminProfile> {
    const response = await request(`${this.baseUrl}/admin-profile`);
    return response.data;
  }

  // Get all messages with filtering and pagination
  async getMessages(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<{
    success: boolean;
    data: {
      messages: FeedbackMessage[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }

    const url = `${this.baseUrl}/messages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await request(url);
  }

  // Create new message
  async createMessage(messageData: {
    name: string;
    email: string;
    phone: string;
    type: 'complaint' | 'suggestion' | 'announcement';
    priority: 'low' | 'medium' | 'high';
    subject: string;
    message: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: { id: number };
  }> {
    return await request(`${this.baseUrl}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }

  // Get single message with replies
  async getMessage(id: number): Promise<{
    success: boolean;
    data: {
      message: FeedbackMessage;
      replies: FeedbackReply[];
    };
  }> {
    return await request(`${this.baseUrl}/messages/${id}`);
  }

  // Update message status
  async updateMessageStatus(id: number, status: 'new' | 'in_progress' | 'resolved', assignedTo?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return await request(`${this.baseUrl}/messages/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, assignedTo })
    });
  }

  // Update message priority
  async updateMessagePriority(id: number, priority: 'low' | 'medium' | 'high'): Promise<{
    success: boolean;
    message: string;
  }> {
    return await request(`${this.baseUrl}/messages/${id}/priority`, {
      method: 'PUT',
      body: JSON.stringify({ priority })
    });
  }

  // Add reply to message
  async addReply(messageId: number, replyText: string): Promise<{
    success: boolean;
    message: string;
    data: { id: number };
  }> {
    return await request(`${this.baseUrl}/messages/${messageId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ replyText })
    });
  }

  // Get feedback statistics
  async getStats(): Promise<{
    success: boolean;
    data: FeedbackStats;
  }> {
    return await request(`${this.baseUrl}/stats`);
  }

  // Delete message
  async deleteMessage(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    return await request(`${this.baseUrl}/messages/${id}`, {
      method: 'DELETE'
    });
  }

  // Utility methods
  getTypeColor(type: string): string {
    switch (type) {
      case 'complaint':
        return 'bg-red-100 text-red-800';
      case 'suggestion':
        return 'bg-blue-100 text-blue-800';
      case 'announcement':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}



export const feedbackAPI = new FeedbackAPI();