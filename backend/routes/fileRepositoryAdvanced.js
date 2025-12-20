const express = require('express');
const { pool } = require('../config/database');
const FileRepositoryService = require('../services/fileRepositoryService');
const path = require('path');
const router = express.Router();

// Middleware to verify admin
const verifyAdmin = async (req, res, next) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const adminEmail = req.body.adminEmail || req.query.adminEmail || 'admin@weareone.co.ke';
    req.adminEmail = adminEmail;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

// Create share link
router.post('/files/:id/share', verifyAdmin, async (req, res) => {
  try {
    const fileId = req.params.id;
    const { sharedWith, expiresAt, downloadLimit } = req.body;
    
    // Check if file exists
    const [files] = await pool.execute(
      'SELECT id FROM files WHERE id = ? AND status = "active"',
      [fileId]
    );
    
    if (files.length === 0) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    const shareLink = await FileRepositoryService.createShareLink(fileId, req.adminEmail, {
      sharedWith,
      expiresAt,
      downloadLimit
    });
    
    res.json({
      success: true,
      message: 'Share link created successfully',
      data: shareLink
    });
  } catch (error) {
    console.error('Error creating share link:', error);
    res.status(500).json({ success: false, message: 'Failed to create share link' });
  }
});

// Access shared file
router.get('/shared/:token', async (req, res) => {
  try {
    const shareToken = req.params.token;
    const share = await FileRepositoryService.getFileByShareToken(shareToken);
    
    // Update download count
    await FileRepositoryService.updateShareDownloadCount(share.id);
    
    // Send file
    res.setHeader('Content-Disposition', `attachment; filename="${share.original_name}"`);
    res.setHeader('Content-Type', share.mime_type);
    res.sendFile(path.resolve(share.file_path));
    
  } catch (error) {
    console.error('Error accessing shared file:', error);
    res.status(404).json({ success: false, message: error.message });
  }
});

// Get file access history
router.get('/files/:id/history', verifyAdmin, async (req, res) => {
  try {
    const fileId = req.params.id;
    const limit = parseInt(req.query.limit) || 50;
    
    const history = await FileRepositoryService.getFileAccessHistory(fileId, limit);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching file history:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch file history' });
  }
});

// Advanced search
router.post('/search', verifyAdmin, async (req, res) => {
  try {
    const filters = req.body;
    const results = await FileRepositoryService.searchFiles(filters);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error searching files:', error);
    res.status(500).json({ success: false, message: 'Failed to search files' });
  }
});

// Bulk update category
router.put('/bulk/category', verifyAdmin, async (req, res) => {
  try {
    const { fileIds, categoryId } = req.body;
    
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ success: false, message: 'File IDs are required' });
    }
    
    const updatedCount = await FileRepositoryService.bulkUpdateCategory(
      fileIds, 
      categoryId, 
      req.adminEmail
    );
    
    res.json({
      success: true,
      message: `${updatedCount} files updated successfully`,
      data: { updatedCount }
    });
  } catch (error) {
    console.error('Error bulk updating category:', error);
    res.status(500).json({ success: false, message: 'Failed to update files' });
  }
});

// Bulk delete
router.delete('/bulk', verifyAdmin, async (req, res) => {
  try {
    const { fileIds } = req.body;
    
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ success: false, message: 'File IDs are required' });
    }
    
    const deletedCount = await FileRepositoryService.bulkDelete(fileIds, req.adminEmail);
    
    res.json({
      success: true,
      message: `${deletedCount} files deleted successfully`,
      data: { deletedCount }
    });
  } catch (error) {
    console.error('Error bulk deleting files:', error);
    res.status(500).json({ success: false, message: 'Failed to delete files' });
  }
});

// Get storage statistics
router.get('/storage/stats', verifyAdmin, async (req, res) => {
  try {
    const stats = await FileRepositoryService.getStorageStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching storage stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch storage statistics' });
  }
});

// Clean up expired shares (admin utility)
router.post('/cleanup/expired-shares', verifyAdmin, async (req, res) => {
  try {
    const cleanedCount = await FileRepositoryService.cleanupExpiredShares();
    
    res.json({
      success: true,
      message: `${cleanedCount} expired shares cleaned up`,
      data: { cleanedCount }
    });
  } catch (error) {
    console.error('Error cleaning up expired shares:', error);
    res.status(500).json({ success: false, message: 'Failed to cleanup expired shares' });
  }
});

// Update category
router.put('/categories/:id', verifyAdmin, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, color, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    
    const [result] = await pool.execute(
      'UPDATE file_categories SET name = ?, description = ?, color = ?, icon = ? WHERE id = ?',
      [name, description || null, color || '#3B82F6', icon || 'folder', categoryId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, message: 'Category name already exists' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update category' });
    }
  }
});

// Delete category
router.delete('/categories/:id', verifyAdmin, async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // Check if category has files
    const [files] = await pool.execute(
      'SELECT COUNT(*) as count FROM files WHERE category_id = ? AND status = "active"',
      [categoryId]
    );
    
    if (files[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete category with files. Move files to another category first.' 
      });
    }
    
    const [result] = await pool.execute(
      'DELETE FROM file_categories WHERE id = ?',
      [categoryId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

module.exports = router;