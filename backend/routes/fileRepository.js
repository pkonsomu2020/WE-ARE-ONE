const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { pool } = require('../config/database');
const notificationService = require('../services/notificationService');
const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/files');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow most common file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/avi',
      'video/mov',
      'audio/mp3',
      'audio/wav',
      'audio/mpeg',
      'application/zip',
      'application/x-rar-compressed',
      'text/plain',
      'text/csv'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  }
});

// Import admin authentication middleware
const { authenticateAdmin } = require('../middleware/auth');

// Use admin authentication for all routes
router.use(authenticateAdmin);

// Middleware to get admin email
const getAdminEmail = (req, res, next) => {
  req.adminEmail = req.admin?.id ? `admin-${req.admin.id}@weareone.co.ke` : 'admin@weareone.co.ke';
  next();
};

router.use(getAdminEmail);

// Upload single file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.adminEmail || 'admin@weareone.co.ke'
    };

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: fileData
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
});

// Upload multiple files
router.post('/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const filesData = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      uploadedBy: req.adminEmail || 'admin@weareone.co.ke'
    }));

    res.json({
      success: true,
      message: `${req.files.length} files uploaded successfully`,
      data: filesData
    });

  } catch (error) {
    console.error('Multiple file upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const mockCategories = [
      { id: 1, name: 'Documents', fileCount: 5 },
      { id: 2, name: 'Images', fileCount: 12 },
      { id: 3, name: 'Videos', fileCount: 3 },
      { id: 4, name: 'Other', fileCount: 2 }
    ];

    res.json({
      success: true,
      data: mockCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Get all files
router.get('/files', async (req, res) => {
  try {
    const mockFiles = [
      {
        id: 1,
        filename: 'document.pdf',
        originalName: 'Annual Report 2024.pdf',
        mimeType: 'application/pdf',
        size: 2048576,
        categoryId: 1,
        uploadedBy: 'admin@weareone.co.ke',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 2,
        filename: 'image.jpg',
        originalName: 'Team Photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024000,
        categoryId: 2,
        uploadedBy: 'admin@weareone.co.ke',
        uploadedAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: mockFiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch files',
      error: error.message
    });
  }
});

// Get single file
router.get('/files/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    
    const mockFile = {
      id: fileId,
      filename: 'document.pdf',
      originalName: 'Annual Report 2024.pdf',
      mimeType: 'application/pdf',
      size: 2048576,
      categoryId: 1,
      uploadedBy: 'admin@weareone.co.ke',
      uploadedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: mockFile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch file',
      error: error.message
    });
  }
});

// Update file metadata
router.put('/files/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const { originalName, categoryId } = req.body;

    res.json({
      success: true,
      message: 'File updated successfully',
      data: { id: fileId, originalName, categoryId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update file',
      error: error.message
    });
  }
});

// Delete file
router.delete('/files/:id', async (req, res) => {
  try {
    const fileId = req.params.id;

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
});

// Download file
router.get('/download/:id', async (req, res) => {
  try {
    const fileId = req.params.id;

    res.json({
      success: true,
      message: 'File download endpoint',
      data: { id: fileId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to download file',
      error: error.message
    });
  }
});

// Get file statistics
router.get('/stats', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalFiles: 22,
        totalSize: 52428800, // 50MB in bytes
        filesByType: {
          documents: 5,
          images: 12,
          videos: 3,
          other: 2
        },
        recentUploads: 5
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

module.exports = router;
