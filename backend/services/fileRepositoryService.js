const { pool } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class FileRepositoryService {
  
  // Generate secure share token
  static generateShareToken() {
    return crypto.randomBytes(32).toString('hex');
  }
  
  // Create file share link
  static async createShareLink(fileId, adminEmail, options = {}) {
    try {
      const {
        sharedWith = null,
        expiresAt = null,
        downloadLimit = null
      } = options;
      
      const shareToken = this.generateShareToken();
      
      const [result] = await pool.execute(
        `INSERT INTO file_shares 
         (file_id, shared_by, shared_with, share_token, expires_at, download_limit) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [fileId, adminEmail, sharedWith, shareToken, expiresAt, downloadLimit]
      );
      
      return {
        id: result.insertId,
        shareToken,
        shareUrl: `${process.env.BASE_URL}/api/file-repository/shared/${shareToken}`
      };
    } catch (error) {
      throw new Error(`Failed to create share link: ${error.message}`);
    }
  }
  
  // Get file by share token
  static async getFileByShareToken(shareToken) {
    try {
      const [shares] = await pool.execute(
        `SELECT 
          fs.*,
          f.filename,
          f.original_name,
          f.file_path,
          f.file_size,
          f.mime_type
         FROM file_shares fs
         JOIN files f ON fs.file_id = f.id
         WHERE fs.share_token = ? 
         AND fs.is_active = 1 
         AND f.status = "active"
         AND (fs.expires_at IS NULL OR fs.expires_at > NOW())`,
        [shareToken]
      );
      
      if (shares.length === 0) {
        throw new Error('Share link not found or expired');
      }
      
      const share = shares[0];
      
      // Check download limit
      if (share.download_limit && share.download_count >= share.download_limit) {
        throw new Error('Download limit exceeded');
      }
      
      return share;
    } catch (error) {
      throw new Error(`Failed to get shared file: ${error.message}`);
    }
  }
  
  // Update share download count
  static async updateShareDownloadCount(shareId) {
    try {
      await pool.execute(
        'UPDATE file_shares SET download_count = download_count + 1 WHERE id = ?',
        [shareId]
      );
    } catch (error) {
      console.error('Error updating share download count:', error);
    }
  }
  
  // Get file storage statistics
  static async getStorageStats() {
    try {
      const [stats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_files,
          SUM(file_size) as total_size,
          AVG(file_size) as avg_size,
          MAX(file_size) as max_size,
          MIN(file_size) as min_size
        FROM files 
        WHERE status = "active"
      `);
      
      const [categoryStats] = await pool.execute(`
        SELECT 
          fc.name,
          fc.color,
          COUNT(f.id) as file_count,
          SUM(f.file_size) as total_size
        FROM file_categories fc
        LEFT JOIN files f ON fc.id = f.category_id AND f.status = "active"
        GROUP BY fc.id, fc.name, fc.color
        ORDER BY file_count DESC
      `);
      
      const [monthlyStats] = await pool.execute(`
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          COUNT(*) as uploads,
          SUM(file_size) as size
        FROM files 
        WHERE status = "active" 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month DESC
      `);
      
      return {
        overview: stats[0],
        byCategory: categoryStats,
        monthly: monthlyStats
      };
    } catch (error) {
      throw new Error(`Failed to get storage stats: ${error.message}`);
    }
  }
  
  // Clean up expired shares
  static async cleanupExpiredShares() {
    try {
      const [result] = await pool.execute(
        'UPDATE file_shares SET is_active = 0 WHERE expires_at < NOW() AND is_active = 1'
      );
      
      return result.affectedRows;
    } catch (error) {
      console.error('Error cleaning up expired shares:', error);
      return 0;
    }
  }
  
  // Get file access history
  static async getFileAccessHistory(fileId, limit = 50) {
    try {
      const [history] = await pool.execute(
        `SELECT 
          fal.*,
          ap.full_name as admin_name
         FROM file_access_log fal
         LEFT JOIN admin_profiles ap ON fal.accessed_by = ap.email
         WHERE fal.file_id = ?
         ORDER BY fal.created_at DESC
         LIMIT ?`,
        [fileId, limit]
      );
      
      return history;
    } catch (error) {
      throw new Error(`Failed to get file access history: ${error.message}`);
    }
  }
  
  // Search files with advanced filters
  static async searchFiles(filters = {}) {
    try {
      const {
        query = '',
        category = null,
        uploadedBy = null,
        dateFrom = null,
        dateTo = null,
        minSize = null,
        maxSize = null,
        mimeType = null,
        isPublic = null,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        page = 1,
        limit = 20
      } = filters;
      
      let whereClause = 'WHERE f.status = "active"';
      let queryParams = [];
      
      if (query) {
        whereClause += ' AND (f.original_name LIKE ? OR f.description LIKE ? OR f.tags LIKE ?)';
        const searchTerm = `%${query}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
      }
      
      if (category) {
        whereClause += ' AND f.category_id = ?';
        queryParams.push(category);
      }
      
      if (uploadedBy) {
        whereClause += ' AND f.uploaded_by = ?';
        queryParams.push(uploadedBy);
      }
      
      if (dateFrom) {
        whereClause += ' AND f.created_at >= ?';
        queryParams.push(dateFrom);
      }
      
      if (dateTo) {
        whereClause += ' AND f.created_at <= ?';
        queryParams.push(dateTo);
      }
      
      if (minSize) {
        whereClause += ' AND f.file_size >= ?';
        queryParams.push(minSize);
      }
      
      if (maxSize) {
        whereClause += ' AND f.file_size <= ?';
        queryParams.push(maxSize);
      }
      
      if (mimeType) {
        whereClause += ' AND f.mime_type LIKE ?';
        queryParams.push(`%${mimeType}%`);
      }
      
      if (isPublic !== null) {
        whereClause += ' AND f.is_public = ?';
        queryParams.push(isPublic ? 1 : 0);
      }
      
      const offset = (page - 1) * limit;
      
      const searchQuery = `
        SELECT 
          f.*,
          fc.name as category_name,
          fc.color as category_color,
          fc.icon as category_icon,
          ap.full_name as uploader_name
        FROM files f
        LEFT JOIN file_categories fc ON f.category_id = fc.id
        LEFT JOIN admin_profiles ap ON f.uploaded_by = ap.email
        ${whereClause}
        ORDER BY f.${sortBy} ${sortOrder}
        LIMIT ? OFFSET ?
      `;
      
      queryParams.push(limit, offset);
      
      const [files] = await pool.execute(searchQuery, queryParams);
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM files f
        ${whereClause}
      `;
      
      const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2));
      const total = countResult[0].total;
      
      return {
        files,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to search files: ${error.message}`);
    }
  }
  
  // Bulk operations
  static async bulkUpdateCategory(fileIds, categoryId, adminEmail) {
    try {
      const placeholders = fileIds.map(() => '?').join(',');
      const [result] = await pool.execute(
        `UPDATE files SET category_id = ? WHERE id IN (${placeholders}) AND status = "active"`,
        [categoryId, ...fileIds]
      );
      
      // Log bulk update
      for (const fileId of fileIds) {
        await pool.execute(
          'INSERT INTO file_access_log (file_id, accessed_by, action) VALUES (?, ?, ?)',
          [fileId, adminEmail, 'bulk_update_category']
        );
      }
      
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Failed to bulk update category: ${error.message}`);
    }
  }
  
  static async bulkDelete(fileIds, adminEmail) {
    try {
      const placeholders = fileIds.map(() => '?').join(',');
      const [result] = await pool.execute(
        `UPDATE files SET status = "deleted" WHERE id IN (${placeholders}) AND status = "active"`,
        fileIds
      );
      
      // Log bulk delete
      for (const fileId of fileIds) {
        await pool.execute(
          'INSERT INTO file_access_log (file_id, accessed_by, action) VALUES (?, ?, ?)',
          [fileId, adminEmail, 'bulk_delete']
        );
      }
      
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Failed to bulk delete files: ${error.message}`);
    }
  }
}

module.exports = FileRepositoryService;