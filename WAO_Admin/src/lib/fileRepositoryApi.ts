const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "https://weareone.co.ke";
const ADMIN_KEY = (import.meta.env.VITE_ADMIN_API_KEY as string) || "3090375ecb2326add24b37c7fd9b5fce4959c766677cdd4fd32eb67fa383db44";

async function request(path: string, init?: RequestInit) {
  let ADMIN_TOKEN: string | null = null;
  try {
    ADMIN_TOKEN = localStorage.getItem('wao_admin_token');
  } catch { }

  const url = `${API_BASE_URL}${path}`;
  
  // Add adminEmail as query parameter instead of header to avoid CORS issues
  const separator = url.includes('?') ? '&' : '?';
  const urlWithAdmin = `${url}${separator}adminEmail=admin@weareone.co.ke`;

  const headers: Record<string, string> = {
    ...(init?.headers || {})
  };

  // PRIORITIZE JWT TOKEN - only use admin key as fallback
  if (ADMIN_TOKEN) {
    headers['Authorization'] = `Bearer ${ADMIN_TOKEN}`;
  } else {
    headers['x-admin-key'] = ADMIN_KEY;
  }

  const res = await fetch(urlWithAdmin, {
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

export interface FileCategory {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FileItem {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  category_id?: number;
  uploaded_by: string;
  uploaded_by_email?: string;
  uploader_name?: string;
  description?: string;
  tags?: string;
  is_public: boolean;
  download_count: number;
  status: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
  };
}

export interface FilesResponse {
  success: boolean;
  data: {
    files: FileItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface FileStatsResponse {
  success: boolean;
  data: {
    totalFiles: number;
    totalSize: number;
    filesByCategory: Array<{
      name: string;
      color: string;
      count: number;
    }>;
    recentUploads: Array<{
      original_name: string;
      file_size: number;
      uploaded_by: string;
      created_at: string;
      category_name?: string;
    }>;
  };
}

export interface ShareLinkResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    shareToken: string;
    shareUrl: string;
  };
}

export interface SearchFilters {
  query?: string;
  category?: string;
  uploadedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  minSize?: number;
  maxSize?: number;
  mimeType?: string;
  isPublic?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

class FileRepositoryAPI {
  private baseUrl = '/api/file-repository';
  private advancedUrl = '/api/file-repository-advanced';

  // Categories
  async getCategories(): Promise<FileCategory[]> {
    const response = await request(`${this.baseUrl}/categories`);
    return response.data;
  }

  async createCategory(category: Partial<FileCategory>): Promise<FileCategory> {
    const response = await request(`${this.baseUrl}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    return response.data;
  }

  async updateCategory(id: number, category: Partial<FileCategory>): Promise<void> {
    await request(`${this.advancedUrl}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
  }

  async deleteCategory(id: number): Promise<void> {
    await request(`${this.advancedUrl}/categories/${id}`, {
      method: 'DELETE'
    });
  }

  // Files
  async getFiles(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<FilesResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    const url = `${this.baseUrl}/files${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await request(url);
  }

  async getFile(id: number): Promise<FileItem> {
    const response = await request(`${this.baseUrl}/files/${id}`);
    return response.data;
  }

  async uploadFile(formData: FormData): Promise<FileUploadResponse> {
    formData.append('adminEmail', 'admin@weareone.co.ke');
    return await request(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData
    });
  }

  async uploadMultipleFiles(formData: FormData): Promise<{
    success: boolean;
    message: string;
    data: Array<{
      id: number;
      filename: string;
      originalName: string;
      size: number;
      mimeType: string;
    }>;
  }> {
    formData.append('adminEmail', 'admin@weareone.co.ke');
    return await request(`${this.baseUrl}/upload-multiple`, {
      method: 'POST',
      body: formData
    });
  }

  async updateFile(id: number, data: {
    originalName?: string;
    categoryId?: number;
    description?: string;
    tags?: string;
    isPublic?: boolean;
  }): Promise<void> {
    await request(`${this.baseUrl}/files/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, adminEmail: 'admin@weareone.co.ke' })
    });
  }

  async deleteFile(id: number): Promise<void> {
    await request(`${this.baseUrl}/files/${id}?adminEmail=admin@weareone.co.ke`, {
      method: 'DELETE'
    });
  }

  async downloadFile(id: number): Promise<Blob> {
    const url = `${API_BASE_URL}${this.baseUrl}/download/${id}?adminEmail=admin@weareone.co.ke`;
    const response = await fetch(url, {
      headers: {
        'x-admin-key': ADMIN_KEY,
      }
    });
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  }

  // Statistics
  async getStats(): Promise<FileStatsResponse> {
    return await request(`${this.baseUrl}/stats?adminEmail=admin@weareone.co.ke`);
  }

  // Advanced features
  async searchFiles(filters: SearchFilters): Promise<FilesResponse> {
    return await request(`${this.advancedUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...filters, adminEmail: 'admin@weareone.co.ke' })
    });
  }

  async createShareLink(fileId: number, options?: {
    sharedWith?: string;
    expiresAt?: string;
    downloadLimit?: number;
  }): Promise<ShareLinkResponse> {
    return await request(`${this.advancedUrl}/files/${fileId}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...options, adminEmail: 'admin@weareone.co.ke' })
    });
  }

  async getFileHistory(fileId: number, limit?: number): Promise<Array<{
    id: number;
    action: string;
    accessed_by: string;
    admin_name?: string;
    ip_address?: string;
    created_at: string;
  }>> {
    const queryParams = new URLSearchParams({ adminEmail: 'admin@weareone.co.ke' });
    if (limit) queryParams.append('limit', String(limit));
    const response = await request(`${this.advancedUrl}/files/${fileId}/history?${queryParams.toString()}`);
    return response.data;
  }

  async bulkUpdateCategory(fileIds: number[], categoryId: number): Promise<{
    success: boolean;
    message: string;
    data: { updatedCount: number };
  }> {
    return await request(`${this.advancedUrl}/bulk/category`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileIds, categoryId, adminEmail: 'admin@weareone.co.ke' })
    });
  }

  async bulkDelete(fileIds: number[]): Promise<{
    success: boolean;
    message: string;
    data: { deletedCount: number };
  }> {
    return await request(`${this.advancedUrl}/bulk`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileIds, adminEmail: 'admin@weareone.co.ke' })
    });
  }

  async getStorageStats(): Promise<{
    success: boolean;
    data: {
      overview: {
        total_files: number;
        total_size: number;
        avg_size: number;
        max_size: number;
        min_size: number;
      };
      byCategory: Array<{
        name: string;
        color: string;
        file_count: number;
        total_size: number;
      }>;
      monthly: Array<{
        month: string;
        uploads: number;
        size: number;
      }>;
    };
  }> {
    return await request(`${this.advancedUrl}/storage/stats?adminEmail=admin@weareone.co.ke`);
  }

  async cleanupExpiredShares(): Promise<{
    success: boolean;
    message: string;
    data: { cleanedCount: number };
  }> {
    return await request(`${this.advancedUrl}/cleanup/expired-shares`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminEmail: 'admin@weareone.co.ke' })
    });
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'music';
    if (mimeType.includes('pdf')) return 'file-text';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'file-text';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'table';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'presentation';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) return 'archive';
    return 'file';
  }

  getFileTypeColor(mimeType: string): string {
    if (mimeType.startsWith('image/')) return '#10B981';
    if (mimeType.startsWith('video/')) return '#F59E0B';
    if (mimeType.startsWith('audio/')) return '#8B5CF6';
    if (mimeType.includes('pdf')) return '#EF4444';
    if (mimeType.includes('word') || mimeType.includes('document')) return '#3B82F6';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '#059669';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '#DC2626';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '#6B7280';
    return '#64748B';
  }
}

export const fileRepositoryAPI = new FileRepositoryAPI();