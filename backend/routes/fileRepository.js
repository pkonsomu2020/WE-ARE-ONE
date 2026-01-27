const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { supabase, supabaseAdmin } = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Ensure file repository tables exist
(async function ensureFileRepositoryTables() {
  try {
    console.log('🔧 Ensuring file repository tables exist...');
    
    // Check if file_categories table exists
    const { data: categoriesData, error: categoriesError } = await supabaseAdmin
      .from('file_categories')
      .select('id')
      .limit(1);
    
    if (categoriesError && categoriesError.code === '42P01') {
      console.log('📝 Creating file_categories table...');
      // Table doesn't exist, but we can't create it via client
      // This should be done via Supabase dashboard or migrations
      console.log('⚠️ Please create file_categories table in Supabase dashboard with the following structure:');
      console.log(`
        CREATE TABLE file_categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          color VARCHAR(7) DEFAULT '#3B82F6',
          icon VARCHAR(50) DEFAULT 'folder',
          created_by VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
    }
    
    // Check if files table exists
    const { data: filesData, error: filesError } = await supabaseAdmin
      .from('files')
      .select('id')
      .limit(1);
    
    if (filesError && filesError.code === '42P01') {
      console.log('📝 Creating files table...');
      console.log('⚠️ Please create files table in Supabase dashboard with the following structure:');
      console.log(`
        CREATE TABLE files (
          id SERIAL PRIMARY KEY,
          filename VARCHAR(255) NOT NULL,
          original_name VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size BIGINT NOT NULL,
          mime_type VARCHAR(100) NOT NULL,
          category_id INTEGER REFERENCES file_categories(id) ON DELETE SET NULL,
          uploaded_by VARCHAR(255) NOT NULL,
          uploaded_by_email VARCHAR(255),
          uploader_name VARCHAR(255),
          description TEXT,
          tags TEXT,
          is_public BOOLEAN DEFAULT FALSE,
          download_count INTEGER DEFAULT 0,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
    }
    
    // Insert default categories if they don't exist
    const { data: existingCategories, error: countError } = await supabaseAdmin
      .from('file_categories')
      .select('id');
    
    if (!countError && (!existingCategories || existingCategories.length === 0)) {
      console.log('📝 Inserting default categories...');
      const { error: insertError } = await supabaseAdmin
        .from('file_categories')
        .insert([
          { name: 'Documents', description: 'PDF, Word, Excel and other document files', color: '#3B82F6', icon: 'file-text', created_by: 'system' },
          { name: 'Images', description: 'Photos, graphics and image files', color: '#10B981', icon: 'image', created_by: 'system' },
          { name: 'Videos', description: 'Video files and multimedia content', color: '#F59E0B', icon: 'video', created_by: 'system' },
          { name: 'Audio', description: 'Music and audio files', color: '#8B5CF6', icon: 'music', created_by: 'system' },
          { name: 'Archives', description: 'ZIP, RAR and compressed files', color: '#6B7280', icon: 'archive', created_by: 'system' },
          { name: 'Other', description: 'Miscellaneous files', color: '#64748B', icon: 'file', created_by: 'system' }
        ]);
      
      if (insertError) {
        console.error('⚠️ Failed to insert default categories:', insertError.message);
      } else {
        console.log('✅ Default categories inserted successfully');
      }
    }
    
    console.log('✅ File repository tables check completed');
  } catch (error) {
    console.error('⚠️ Failed to ensure file repository tables:', error.message);
  }
})();

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

    // Determine category based on file type
    let categoryId = null;
    const mimeType = req.file.mimetype;
    
    try {
      let categoryName = 'Other';
      if (mimeType.startsWith('image/')) {
        categoryName = 'Images';
      } else if (mimeType.startsWith('video/')) {
        categoryName = 'Videos';
      } else if (mimeType.startsWith('audio/')) {
        categoryName = 'Audio';
      } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) {
        categoryName = 'Archives';
      } else if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('excel') || mimeType.includes('powerpoint')) {
        categoryName = 'Documents';
      }

      const { data: categoryData, error: categoryError } = await supabase
        .from('file_categories')
        .select('id')
        .eq('name', categoryName)
        .limit(1);

      if (!categoryError && categoryData && categoryData.length > 0) {
        categoryId = categoryData[0].id;
      }
    } catch (categoryError) {
      console.warn('Failed to determine category:', categoryError.message);
    }

    // Insert file record into database
    const { data, error } = await supabase
      .from('files')
      .insert({
        filename: req.file.filename,
        original_name: req.file.originalname,
        file_path: req.file.path,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        category_id: categoryId,
        uploaded_by: req.adminEmail || 'admin@weareone.co.ke',
        uploaded_by_email: req.adminEmail || 'admin@weareone.co.ke',
        uploader_name: 'Admin User'
      })
      .select();

    if (error) {
      console.error('Database insert error:', error);
      throw error;
    }

    const fileData = {
      id: data[0].id,
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

    const filesData = [];

    for (const file of req.files) {
      // Determine category based on file type
      let categoryId = null;
      const mimeType = file.mimetype;
      
      try {
        let categoryName = 'Other';
        if (mimeType.startsWith('image/')) {
          categoryName = 'Images';
        } else if (mimeType.startsWith('video/')) {
          categoryName = 'Videos';
        } else if (mimeType.startsWith('audio/')) {
          categoryName = 'Audio';
        } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) {
          categoryName = 'Archives';
        } else if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('excel') || mimeType.includes('powerpoint')) {
          categoryName = 'Documents';
        }

        const { data: categoryData, error: categoryError } = await supabase
          .from('file_categories')
          .select('id')
          .eq('name', categoryName)
          .limit(1);

        if (!categoryError && categoryData && categoryData.length > 0) {
          categoryId = categoryData[0].id;
        }
      } catch (categoryError) {
        console.warn('Failed to determine category:', categoryError.message);
      }

      // Insert file record into database
      const { data, error } = await supabase
        .from('files')
        .insert({
          filename: file.filename,
          original_name: file.originalname,
          file_path: file.path,
          file_size: file.size,
          mime_type: file.mimetype,
          category_id: categoryId,
          uploaded_by: req.adminEmail || 'admin@weareone.co.ke',
          uploaded_by_email: req.adminEmail || 'admin@weareone.co.ke',
          uploader_name: 'Admin User'
        })
        .select();

      if (error) {
        console.error('Database insert error for file:', file.originalname, error);
        continue; // Skip this file but continue with others
      }

      filesData.push({
        id: data[0].id,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        uploadedBy: req.adminEmail || 'admin@weareone.co.ke'
      });
    }

    res.json({
      success: true,
      message: `${filesData.length} files uploaded successfully`,
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
    // Get categories with file counts
    const { data: categories, error: categoriesError } = await supabase
      .from('file_categories')
      .select('*')
      .order('name');

    if (categoriesError) {
      throw categoriesError;
    }

    // Get file counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const { count, error: countError } = await supabase
          .from('files')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('status', 'active');

        return {
          id: category.id,
          name: category.name,
          description: category.description,
          color: category.color,
          icon: category.icon,
          fileCount: countError ? 0 : (count || 0),
          created_by: category.created_by,
          created_at: category.created_at,
          updated_at: category.updated_at
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCounts
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'DESC';

    // Build query
    let query = supabase
      .from('files')
      .select(`
        *,
        file_categories (
          name,
          color,
          icon
        )
      `)
      .eq('status', 'active');

    // Add search filter
    if (search) {
      query = query.or(`original_name.ilike.%${search}%,uploaded_by.ilike.%${search}%`);
    }

    // Add category filter
    if (category && category !== 'all') {
      // First get category ID
      const { data: categoryData, error: categoryError } = await supabase
        .from('file_categories')
        .select('id')
        .eq('name', category)
        .limit(1);

      if (!categoryError && categoryData && categoryData.length > 0) {
        query = query.eq('category_id', categoryData[0].id);
      }
    }

    // Add sorting
    const ascending = sortOrder.toUpperCase() === 'ASC';
    query = query.order(sortBy, { ascending });

    // Add pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: files, error, count } = await query;

    if (error) {
      throw error;
    }

    // Format the response to match expected structure
    const formattedFiles = files.map(file => ({
      ...file,
      category_name: file.file_categories?.name || null,
      category_color: file.file_categories?.color || null,
      category_icon: file.file_categories?.icon || null
    }));

    // Get total count for pagination
    let totalQuery = supabase
      .from('files')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (search) {
      totalQuery = totalQuery.or(`original_name.ilike.%${search}%,uploaded_by.ilike.%${search}%`);
    }

    if (category && category !== 'all') {
      const { data: categoryData } = await supabase
        .from('file_categories')
        .select('id')
        .eq('name', category)
        .limit(1);

      if (categoryData && categoryData.length > 0) {
        totalQuery = totalQuery.eq('category_id', categoryData[0].id);
      }
    }

    const { count: total } = await totalQuery;
    const pages = Math.ceil((total || 0) / limit);

    res.json({
      success: true,
      data: {
        files: formattedFiles,
        pagination: {
          page,
          limit,
          total: total || 0,
          pages
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch files:', error);
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
    
    const { data: files, error } = await supabase
      .from('files')
      .select(`
        *,
        file_categories (
          name,
          color,
          icon
        )
      `)
      .eq('id', fileId)
      .eq('status', 'active')
      .limit(1);

    if (error) {
      throw error;
    }

    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const file = files[0];
    const formattedFile = {
      ...file,
      category_name: file.file_categories?.name || null,
      category_color: file.file_categories?.color || null,
      category_icon: file.file_categories?.icon || null
    };

    res.json({
      success: true,
      data: formattedFile
    });
  } catch (error) {
    console.error('Failed to fetch file:', error);
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
    const { originalName, categoryId, description, tags, isPublic } = req.body;

    // Check if file exists
    const { data: existingFiles, error: checkError } = await supabase
      .from('files')
      .select('id')
      .eq('id', fileId)
      .eq('status', 'active')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (!existingFiles || existingFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Build update object
    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (originalName !== undefined) {
      updateData.original_name = originalName;
    }
    if (categoryId !== undefined) {
      updateData.category_id = categoryId;
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (tags !== undefined) {
      updateData.tags = tags;
    }
    if (isPublic !== undefined) {
      updateData.is_public = isPublic;
    }

    if (Object.keys(updateData).length <= 1) { // Only updated_at
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    const { error: updateError } = await supabase
      .from('files')
      .update(updateData)
      .eq('id', fileId);

    if (updateError) {
      throw updateError;
    }

    res.json({
      success: true,
      message: 'File updated successfully',
      data: { id: fileId, originalName, categoryId, description, tags, isPublic }
    });
  } catch (error) {
    console.error('Failed to update file:', error);
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

    // Check if file exists and get file info
    const { data: existingFiles, error: checkError } = await supabase
      .from('files')
      .select('id, filename, file_path')
      .eq('id', fileId)
      .eq('status', 'active')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (!existingFiles || existingFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const file = existingFiles[0];

    // Soft delete - mark as deleted instead of removing from database
    const { error: updateError } = await supabase
      .from('files')
      .update({ 
        status: 'deleted',
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId);

    if (updateError) {
      throw updateError;
    }

    // Optionally delete physical file
    try {
      if (file.file_path && require('fs').existsSync(file.file_path)) {
        await fs.unlink(file.file_path);
      }
    } catch (fsError) {
      console.warn('Failed to delete physical file:', fsError.message);
      // Continue - database record is marked as deleted
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete file:', error);
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

    // Get file info from database
    const { data: files, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .eq('status', 'active')
      .limit(1);

    if (error) {
      throw error;
    }

    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const file = files[0];

    // Check if physical file exists
    if (!require('fs').existsSync(file.file_path)) {
      return res.status(404).json({
        success: false,
        message: 'Physical file not found'
      });
    }

    // Log file access
    try {
      await supabase
        .from('file_access_log')
        .insert({
          file_id: fileId,
          accessed_by: req.adminEmail || 'admin@weareone.co.ke',
          action: 'download',
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.get('User-Agent')
        });
    } catch (logError) {
      console.warn('Failed to log file access:', logError.message);
    }

    // Increment download count
    const { error: updateError } = await supabase
      .from('files')
      .update({ 
        download_count: file.download_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId);

    if (updateError) {
      console.warn('Failed to update download count:', updateError.message);
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
    res.setHeader('Content-Type', file.mime_type);
    res.setHeader('Content-Length', file.file_size);

    // Stream the file
    const fileStream = require('fs').createReadStream(file.file_path);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Failed to download file:', error);
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
    // Get total files and size
    const { data: files, error: filesError } = await supabase
      .from('files')
      .select('file_size')
      .eq('status', 'active');

    if (filesError) {
      throw filesError;
    }

    const totalFiles = files ? files.length : 0;
    const totalSize = files ? files.reduce((sum, file) => sum + (file.file_size || 0), 0) : 0;

    // Get files by category
    const { data: categories, error: categoriesError } = await supabase
      .from('file_categories')
      .select('*')
      .order('name');

    if (categoriesError) {
      throw categoriesError;
    }

    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const { data: categoryFiles, error: categoryError } = await supabase
          .from('files')
          .select('file_size')
          .eq('category_id', category.id)
          .eq('status', 'active');

        const count = categoryError ? 0 : (categoryFiles ? categoryFiles.length : 0);
        const totalSize = categoryError ? 0 : (categoryFiles ? categoryFiles.reduce((sum, file) => sum + (file.file_size || 0), 0) : 0);

        return {
          name: category.name,
          color: category.color,
          count: count,
          total_size: totalSize
        };
      })
    );

    // Get recent uploads (last 10)
    const { data: recentUploads, error: recentError } = await supabase
      .from('files')
      .select(`
        original_name,
        file_size,
        uploaded_by,
        created_at,
        file_categories (
          name
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(10);

    const formattedRecentUploads = recentError ? [] : (recentUploads || []).map(file => ({
      original_name: file.original_name,
      file_size: file.file_size,
      uploaded_by: file.uploaded_by,
      created_at: file.created_at,
      category_name: file.file_categories?.name || null
    }));

    // Format file types for compatibility
    const filesByType = {};
    categoryStats.forEach(cat => {
      const typeName = cat.name.toLowerCase();
      filesByType[typeName] = cat.count;
    });

    res.json({
      success: true,
      data: {
        totalFiles: totalFiles,
        totalSize: totalSize,
        filesByType: filesByType,
        filesByCategory: categoryStats,
        recentUploads: formattedRecentUploads
      }
    });
  } catch (error) {
    console.error('Failed to fetch statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// Get file access logs
router.get('/access-logs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const fileId = req.query.fileId;

    let query = supabase
      .from('file_access_log')
      .select(`
        *,
        files (
          original_name,
          mime_type
        )
      `)
      .order('created_at', { ascending: false });

    // Filter by file ID if provided
    if (fileId) {
      query = query.eq('file_id', fileId);
    }

    // Add pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: logs, error, count } = await query;

    if (error) {
      throw error;
    }

    // Get total count for pagination
    let totalQuery = supabase
      .from('file_access_log')
      .select('*', { count: 'exact', head: true });

    if (fileId) {
      totalQuery = totalQuery.eq('file_id', fileId);
    }

    const { count: total } = await totalQuery;
    const pages = Math.ceil((total || 0) / limit);

    res.json({
      success: true,
      data: {
        logs: logs || [],
        pagination: {
          page,
          limit,
          total: total || 0,
          pages
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch access logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch access logs',
      error: error.message
    });
  }
});

module.exports = router;
