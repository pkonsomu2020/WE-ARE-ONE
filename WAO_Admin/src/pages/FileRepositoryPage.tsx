import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Search,
  Filter,
  Download,
  Trash2,
  FileText,
  File,
  Image,
  MoreVertical,
  Plus,
  FolderOpen,
  User as UserIcon
} from 'lucide-react';

// Helper function to safely format dates
const formatDate = (dateString: any): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString();
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fileRepositoryAPI, FileItem, FileCategory } from '@/lib/fileRepositoryApi';

const FileRepositoryPage = () => {
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedUploader, setSelectedUploader] = useState('all');
  const [uploaders, setUploaders] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [categories, setCategories] = useState<FileCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    totalDownloads: 0,
    storageUsed: '0 GB'
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!Array.isArray(files) || files.length === 0) {
      setUploaders([]);
      return;
    }
    try {
      const uniqueUploaders = Array.from(new Set(
        files
          .filter(file => file && typeof file === 'object')
          .map(file => {
            return file.uploaded_by_email || file.uploaded_by_name || file.uploaded_by;
          })
          .filter((value): value is string => !!value && typeof value === 'string')
      ));
      setUploaders(uniqueUploaders);
    } catch (error) {
      console.error('Error processing uploaders:', error);
      setUploaders([]);
    }
  }, [files]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load files
      const filesResponse = await fileRepositoryAPI.getFiles();
      const filesData = filesResponse?.success && filesResponse?.data?.files ? filesResponse.data.files : [];
      setFiles(filesData);

      // Load categories
      try {
        const categoriesResponse = await fileRepositoryAPI.getCategories();
        setCategories(Array.isArray(categoriesResponse) ? categoriesResponse : []);
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategories([]);
      }

      // Load stats
      try {
        const statsResponse = await fileRepositoryAPI.getStats();
        if (statsResponse?.success && statsResponse?.data) {
          // Calculate total downloads from the files array instead
          const totalDownloads = Array.isArray(filesData)
            ? filesData.reduce((sum, file) => sum + (file.download_count || 0), 0)
            : 0;

          setStats({
            totalFiles: statsResponse.data.totalFiles || 0,
            totalSize: statsResponse.data.totalSize || 0,
            totalDownloads: totalDownloads,
            storageUsed: fileRepositoryAPI.formatFileSize(statsResponse.data.totalSize || 0)
          });
        } else {
          // Fallback stats if API fails
          setStats({
            totalFiles: filesData.length,
            totalSize: 0,
            totalDownloads: Array.isArray(filesData) 
              ? filesData.reduce((sum, file) => sum + (file.download_count || 0), 0) 
              : 0,
            storageUsed: '0 GB'
          });
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
        // Fallback stats if API fails
        setStats({
          totalFiles: filesData.length,
          totalSize: 0,
          totalDownloads: Array.isArray(filesData) 
            ? filesData.reduce((sum, file) => sum + (file.download_count || 0), 0) 
            : 0,
          storageUsed: '0 GB'
        });
      }
    } catch (error) {
      console.error('Failed to load file repository data:', error);
      // Set safe defaults
      setFiles([]);
      setCategories([]);
      setStats({
        totalFiles: 0,
        totalSize: 0,
        totalDownloads: 0,
        storageUsed: '0 GB'
      });
    } finally {
      setLoading(false);
    }
  };

  const fileTypes = ['pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'png', 'mp4', 'zip'];

  const getFileIcon = (mimeType: string) => {
    const iconName = fileRepositoryAPI.getFileIcon(mimeType);
    const color = fileRepositoryAPI.getFileTypeColor(mimeType);

    switch (iconName) {
      case 'image':
        return <Image className="w-8 h-8" style={{ color }} />;
      case 'file-text':
        return <FileText className="w-8 h-8" style={{ color }} />;
      default:
        return <File className="w-8 h-8" style={{ color }} />;
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (category) {
      return `text-white`;
    }
    return 'bg-gray-100 text-gray-800';
  };

  const filteredDocuments = useMemo(() => {
    if (!Array.isArray(files)) {
      return [];
    }
    
    return files.filter(file => {
      if (!file) return false;
      
      try {
        const nameMatches = (file.original_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (file.uploaded_by || '').toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatches = selectedCategory === 'all' || file.category_name === selectedCategory;
        const typeMatches = selectedType === 'all' || (file.mime_type || '').includes(selectedType);
        const uploaderValue = file.uploaded_by_email || file.uploader_name || file.uploaded_by;
        const uploaderMatches = selectedUploader === 'all' || uploaderValue === selectedUploader;
        return nameMatches && categoryMatches && typeMatches && uploaderMatches;
      } catch (error) {
        console.error('Error filtering file:', file, error);
        return false;
      }
    });
  }, [files, searchTerm, selectedCategory, selectedType, selectedUploader]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileUpload = async (fileList: FileList) => {
    try {
      setUploading(true);
      const formData = new FormData();

      // Enhanced validation for mobile devices
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedExtensions = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|jpg|jpeg|png|gif|zip|rar)$/i;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // Show upload start notification
      addNotification({
        title: 'Upload Starting',
        message: `Preparing ${fileList.length} file(s) for upload...`,
        type: 'info',
        source: 'file'
      });

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        
        // Enhanced file validation
        if (file.size > maxSize) {
          throw new Error(`File "${file.name}" is too large. Maximum size is 10MB.`);
        }
        if (!allowedExtensions.test(file.name)) {
          throw new Error(`File "${file.name}" is not a supported format.`);
        }
        
        // Additional mobile-specific checks
        if (isMobile && file.size > 5 * 1024 * 1024) {
          // Warn about large files on mobile
          const proceed = window.confirm(
            `"${file.name}" is ${fileRepositoryAPI.formatFileSize(file.size)}. Large files may take longer to upload on mobile. Continue?`
          );
          if (!proceed) {
            throw new Error('Upload cancelled by user');
          }
        }
      }

      if (fileList.length === 1) {
        formData.append('file', fileList[0]);
        await fileRepositoryAPI.uploadFile(formData);
      } else {
        Array.from(fileList).forEach(file => {
          formData.append('files', file);
        });
        await fileRepositoryAPI.uploadMultipleFiles(formData);
      }

      // Reload data after upload
      await loadData();

      // Add success notification
      const fileCount = fileList.length;
      const fileName = fileCount === 1 ? fileList[0].name : `${fileCount} files`;
      addNotification({
        title: 'Upload Complete',
        message: `Successfully uploaded ${fileName} to repository`,
        type: 'success',
        source: 'file',
        actionUrl: '/admin/files'
      });

    } catch (error: any) {
      console.error('Upload failed:', error);
      addNotification({
        title: 'Upload Failed',
        message: error.message || 'Failed to upload files. Please check your connection and try again.',
        type: 'error',
        source: 'file'
      });
    } finally {
      setUploading(false);
      // Reset file inputs to allow re-uploading the same file
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      const headerFileInput = document.getElementById('header-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      if (headerFileInput) headerFileInput.value = '';
    }
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      // Show loading notification for mobile users
      addNotification({
        title: 'Download Starting',
        message: `Preparing ${fileName} for download...`,
        type: 'info',
        source: 'file'
      });

      const blob = await fileRepositoryAPI.downloadFile(fileId);
      
      // Mobile-friendly download handling
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // For mobile devices, try different approaches
        const url = window.URL.createObjectURL(blob);
        
        // Try to open in new tab first (works better on mobile)
        const newWindow = window.open(url, '_blank');
        
        if (newWindow) {
          // If new window opened successfully, clean up after delay
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 5000);
        } else {
          // Fallback to direct download
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.style.display = 'none';
          document.body.appendChild(a);
          
          // Use touch event for mobile
          const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          a.dispatchEvent(event);
          
          // Clean up
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 1000);
        }
      } else {
        // Desktop download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      // Success notification
      addNotification({
        title: 'Download Complete',
        message: `${fileName} has been downloaded successfully`,
        type: 'success',
        source: 'file'
      });

    } catch (error) {
      console.error('Download failed:', error);
      addNotification({
        title: 'Download Failed',
        message: `Failed to download ${fileName}. Please try again.`,
        type: 'error',
        source: 'file'
      });
    }
  };

  const handleOpen = async (fileId: number, fileName?: string) => {
    try {
      // Show loading notification
      addNotification({
        title: 'Opening File',
        message: `Loading ${fileName || 'file'}...`,
        type: 'info',
        source: 'file'
      });

      const blob = await fileRepositoryAPI.downloadFile(fileId);
      const url = window.URL.createObjectURL(blob);
      
      // Mobile-friendly file opening
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // For mobile, try to open in new tab with better handling
        const newWindow = window.open('', '_blank');
        
        if (newWindow) {
          // Create a simple HTML page to display the file
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${fileName || 'File Viewer'}</title>
                <style>
                  body { 
                    margin: 0; 
                    padding: 20px; 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #f5f5f5;
                  }
                  .container { 
                    max-width: 100%; 
                    background: white; 
                    border-radius: 8px; 
                    padding: 20px; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                  }
                  .header {
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #eee;
                  }
                  .file-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin: 0;
                    word-break: break-word;
                  }
                  .file-actions {
                    margin-top: 15px;
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                  }
                  .btn {
                    padding: 12px 20px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    min-height: 44px;
                    touch-action: manipulation;
                  }
                  .btn-primary {
                    background: #3B82F6;
                    color: white;
                  }
                  .btn-secondary {
                    background: #6B7280;
                    color: white;
                  }
                  .file-content {
                    width: 100%;
                    height: 70vh;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                  }
                  @media (max-width: 768px) {
                    body { padding: 10px; }
                    .container { padding: 15px; }
                    .btn { padding: 14px 18px; font-size: 16px; }
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 class="file-title">${fileName || 'File Viewer'}</h1>
                    <div class="file-actions">
                      <a href="${url}" download="${fileName || 'file'}" class="btn btn-primary">
                        📥 Download
                      </a>
                      <button onclick="window.close()" class="btn btn-secondary">
                        ✕ Close
                      </button>
                    </div>
                  </div>
                  <iframe src="${url}" class="file-content" frameborder="0"></iframe>
                </div>
              </body>
            </html>
          `);
          newWindow.document.close();
          
          // Clean up URL after delay
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 10000);
        } else {
          // Fallback: direct URL opening
          window.location.href = url;
        }
      } else {
        // Desktop: simple new tab opening
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          // Fallback if popup blocked
          window.location.href = url;
        }
      }

      // Success notification
      addNotification({
        title: 'File Opened',
        message: `${fileName || 'File'} opened successfully`,
        type: 'success',
        source: 'file'
      });

    } catch (error) {
      console.error('Open failed:', error);
      addNotification({
        title: 'Failed to Open File',
        message: `Could not open ${fileName || 'file'}. Please try downloading instead.`,
        type: 'error',
        source: 'file'
      });
    }
  };

  const handleDelete = async (fileId: number, fileName: string) => {
    // Mobile-friendly confirmation dialog
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let confirmDelete = false;
    
    if (isMobile) {
      // Use a more mobile-friendly confirmation
      confirmDelete = window.confirm(
        `Delete "${fileName}"?\n\nThis action cannot be undone. The file will be permanently removed from the repository.`
      );
    } else {
      confirmDelete = window.confirm(`Are you sure you want to delete "${fileName}"?`);
    }

    if (!confirmDelete) {
      return;
    }

    try {
      // Show loading notification
      addNotification({
        title: 'Deleting File',
        message: `Removing ${fileName} from repository...`,
        type: 'info',
        source: 'file'
      });

      await fileRepositoryAPI.deleteFile(fileId);
      await loadData();
      
      addNotification({
        title: 'File Deleted',
        message: `Successfully deleted ${fileName}`,
        type: 'success',
        source: 'file',
        actionUrl: '/admin/files'
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete file';
      addNotification({
        title: 'Delete Failed',
        message: `Could not delete ${fileName}: ${errorMessage}`,
        type: 'error',
        source: 'file'
      });
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="space-y-6 mobile-file-repository">
      <style jsx>{`
        .mobile-file-repository {
          /* Mobile-specific styles */
        }
        
        @media (max-width: 768px) {
          .mobile-file-repository .touch-manipulation {
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            user-select: none;
            -webkit-user-select: none;
          }
          
          .mobile-file-repository button {
            min-height: 44px;
            min-width: 44px;
          }
          
          .mobile-file-repository input[type="file"] {
            font-size: 16px; /* Prevents zoom on iOS */
          }
          
          .mobile-file-repository .dropdown-content {
            position: fixed !important;
            z-index: 9999 !important;
          }
        }
      `}</style>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">File Repository</h1>
          <p className="text-gray-600">Manage organizational documents and files</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Mobile Upload Button */}
          <Button
            className="bg-orange-600 hover:bg-orange-700 md:hidden touch-manipulation min-h-[44px]"
            onClick={() => document.getElementById('header-file-input')?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
          {/* Desktop Upload Button */}
          <Button
            className="bg-orange-600 hover:bg-orange-700 hidden md:flex"
            onClick={() => document.getElementById('header-file-input')?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>
        <input
          id="header-file-input"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
          className="hidden"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
              </div>
              <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <Filter className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
              </div>
              <Download className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.storageUsed}</p>
              </div>
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-4 md:p-8 text-center transition-colors cursor-pointer touch-manipulation ${dragActive
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 hover:border-gray-400 active:border-orange-500'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.getElementById('file-input')?.click();
              }
            }}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Upload className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-2 md:mb-4" />
            <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
              Tap to upload files or drag and drop
            </h3>
            <p className="text-xs md:text-base text-gray-600 mb-3 md:mb-4 px-2">
              Supported: PDF, DOCX, XLSX, PPTX, Images (Max 10MB)
            </p>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('file-input')?.click();
              }}
              className="touch-manipulation min-h-[44px] text-sm md:text-base"
              disabled={uploading}
            >
              <Plus className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Choose Files'}
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>Browse and manage your uploaded documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {fileTypes.map(type => (
                  <SelectItem key={type} value={type}>{type.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedUploader} onValueChange={setSelectedUploader}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Uploaders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Uploaders</SelectItem>
                {uploaders.map(uploader => (
                  <SelectItem key={uploader} value={uploader}>{uploader}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Documents Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((file) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow touch-manipulation">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {getFileIcon(file.mime_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 
                            className="font-medium text-gray-900 break-words line-clamp-2 text-sm leading-5" 
                            title={file.original_name}
                            style={{ 
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              hyphens: 'auto'
                            }}
                          >
                            {file.original_name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">{fileRepositoryAPI.formatFileSize(file.file_size)}</p>
                        </div>
                      </div>
                      {/* Mobile-friendly dropdown menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex-shrink-0 touch-manipulation min-h-[44px] min-w-[44px] p-2 hover:bg-gray-100 active:bg-gray-200"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 z-50">
                          <DropdownMenuItem 
                            onClick={() => handleOpen(file.id, file.original_name)}
                            className="touch-manipulation min-h-[44px] cursor-pointer focus:bg-gray-100 active:bg-gray-200"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View/Open
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDownload(file.id, file.original_name)}
                            className="touch-manipulation min-h-[44px] cursor-pointer focus:bg-gray-100 active:bg-gray-200"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 touch-manipulation min-h-[44px] cursor-pointer focus:bg-red-50 active:bg-red-100"
                            onClick={() => handleDelete(file.id, file.original_name)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {file.category_name && (
                      <Badge
                        className="text-xs mb-2"
                        style={{
                          backgroundColor: file.category_color || '#3B82F6',
                          color: 'white'
                        }}
                      >
                        {file.category_name}
                      </Badge>
                    )}

                    <div className="space-y-1 text-xs text-gray-600">
                      <p
                        className="flex items-center cursor-help truncate"
                        title={file.uploaded_by_email || file.uploaded_by}
                      >
                        <UserIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{file.uploader_name || file.uploaded_by}</span>
                      </p>
                      <p>{formatDate(file.created_at)}</p>
                      <p>Downloads: {file.download_count}</p>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 touch-manipulation min-h-[44px] text-xs md:text-sm hover:bg-gray-50 active:bg-gray-100"
                        onClick={() => handleOpen(file.id, file.original_name)}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 touch-manipulation min-h-[44px] text-xs md:text-sm hover:bg-gray-50 active:bg-gray-100"
                        onClick={() => handleDownload(file.id, file.original_name)}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' || selectedType !== 'all' || selectedUploader !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first document to get started'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Table View */}
      {filteredDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Document List</CardTitle>
            <CardDescription>Comprehensive view with uploader details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="py-2 pr-4">Document</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Uploaded by</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4 text-right">Downloads</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map(file => (
                    <tr key={`table-${file.id}`} className="border-b last:border-b-0">
                      <td className="py-2 pr-4">
                        <div className="font-medium text-gray-900">{file.original_name}</div>
                        <div className="text-xs text-gray-500">{fileRepositoryAPI.formatFileSize(file.file_size)}</div>
                      </td>
                      <td className="py-2 pr-4">{file.category_name || 'Uncategorized'}</td>
                      <td className="py-2 pr-4">{file.mime_type}</td>
                      <td className="py-2 pr-4">
                        <span
                          className="cursor-help"
                          title={file.uploaded_by_email || file.uploaded_by}
                        >
                          {file.uploader_name || file.uploaded_by}
                        </span>
                      </td>
                      <td className="py-2 pr-4">{formatDate(file.created_at)}</td>
                      <td className="py-2 pr-4 text-right">{file.download_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileRepositoryPage;