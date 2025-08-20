# 🔧 Admin Panel Troubleshooting Guide

## Internal Server Error - admin.weareone.co.ke

### **Step 1: Check cPanel Error Logs**

1. **Login to cPanel**
2. **Go to "Error Logs"** (in the "Logs" section)
3. **Check the error log for admin.weareone.co.ke**
4. **Look for recent errors** - they will show the exact cause

### **Step 2: Common Causes & Solutions**

#### **A. Missing .htaccess File**
**Problem**: React Router not configured properly

**Solution**: Create `.htaccess` file in admin subdomain root:

```apache
RewriteEngine On
RewriteBase /

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

#### **B. Missing index.html**
**Problem**: No index.html file in admin subdomain directory

**Solution**: 
1. Check if `index.html` exists in admin subdomain root
2. If missing, rebuild and upload admin panel:
```bash
cd WAO_Admin
npm run build
# Upload dist/ contents to admin subdomain
```

#### **C. Wrong File Permissions**
**Problem**: Files not readable by web server

**Solution**: Set correct permissions in cPanel File Manager:
- Files: 644
- Directories: 755
- index.html: 644

#### **D. Missing Environment Variables**
**Problem**: Admin panel can't connect to API

**Solution**: Create `.env` file in admin subdomain:
```env
VITE_API_BASE_URL=https://weareone.co.ke
VITE_ADMIN_API_KEY=your_admin_api_key
NODE_ENV=production
```

### **Step 3: Quick Fix Checklist**

#### **Immediate Actions:**
1. [ ] Check cPanel error logs
2. [ ] Verify index.html exists in admin subdomain
3. [ ] Create/update .htaccess file
4. [ ] Set correct file permissions
5. [ ] Check if admin panel is built correctly

#### **If Still Not Working:**
1. [ ] Rebuild admin panel: `npm run build`
2. [ ] Upload fresh dist/ contents
3. [ ] Clear browser cache
4. [ ] Test in incognito mode
5. [ ] Check subdomain DNS settings

### **Step 4: Admin Panel Build Process**

#### **Correct Build Steps:**
```bash
# 1. Navigate to admin directory
cd WAO_Admin

# 2. Install dependencies
npm install

# 3. Create production environment file
cp env.production.example .env
# Edit .env with your actual values

# 4. Build for production
npm run build

# 5. Upload dist/ contents to admin subdomain
```

#### **What to Upload:**
Upload ALL contents of `WAO_Admin/dist/` to your admin subdomain root directory:
- index.html
- assets/ folder
- All other files and folders

### **Step 5: Subdomain Configuration**

#### **cPanel Subdomain Setup:**
1. **Go to "Subdomains"** in cPanel
2. **Create subdomain**: `admin`
3. **Document Root**: Should point to admin subdomain directory
4. **Enable SSL** for the subdomain

#### **DNS Configuration:**
- Ensure `admin.weareone.co.ke` points to your hosting
- Allow 24-48 hours for DNS propagation

### **Step 6: Testing**

#### **Test URLs:**
- `https://admin.weareone.co.ke` - Should show admin login
- `https://admin.weareone.co.ke/health` - Should show React app
- Check browser console for JavaScript errors

#### **Expected Behavior:**
- Admin login page should load
- No console errors
- API calls should work (check Network tab)

### **Step 7: Alternative Solutions**

#### **If Admin Panel Still Won't Work:**

**Option A: Use Subdirectory Instead**
- Create `admin/` folder in main domain
- Upload admin panel there
- Access via `https://weareone.co.ke/admin/`

**Option B: Separate Domain**
- Use a different domain for admin
- Example: `wao-admin.com`

**Option C: Integrated Admin**
- Add admin routes to main application
- Access via `https://weareone.co.ke/admin`

### **Step 8: Emergency Admin Access**

#### **If Admin Panel is Down:**
1. **Use Database Direct Access**:
   - Access MySQL via phpMyAdmin
   - Manage payments directly in database

2. **Use API Endpoints**:
   ```bash
   # Test admin API directly
   curl -X POST https://weareone.co.ke/api/admin/auth/login \
     -H "Content-Type: application/json" \
     -H "x-admin-key: your_admin_api_key" \
     -d '{"email":"admin@weareone.co.ke","password":"your_password"}'
   ```

3. **Temporary Admin Interface**:
   - Create simple HTML admin page
   - Use for emergency management

### **Step 9: Prevention**

#### **Best Practices:**
1. **Always test locally** before deploying
2. **Keep backup** of working admin panel
3. **Monitor error logs** regularly
4. **Use version control** for all changes
5. **Document deployment steps**

#### **Monitoring:**
- Set up uptime monitoring for admin panel
- Configure error alerts
- Regular backup of admin data

---

## 🆘 **Still Having Issues?**

If the above steps don't resolve the issue:

1. **Contact your hosting provider** with error logs
2. **Check hosting requirements** for React apps
3. **Consider alternative hosting** if needed
4. **Use integrated admin** in main application

**Emergency Contact**: webmaster@weareone.co.ke 