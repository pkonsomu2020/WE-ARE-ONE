# 🚀 WE-ARE-ONE Production Deployment Guide

## Overview
This guide will help you deploy the WE-ARE-ONE project to your cPanel hosting at `https://weareone.co.ke/`.

## 📋 Prerequisites

1. **cPanel Access** with Node.js support
2. **MySQL Database** (for backend)
3. **Domain**: `weareone.co.ke` (already configured)
4. **SSL Certificate** (for HTTPS)
5. **Email Service** (for password reset and notifications)

## 🏗️ Project Structure

```
WE-ARE-ONE/
├── backend/          # Node.js API server
├── src/              # React frontend
├── WAO_Admin/        # Admin panel
└── public/           # Static assets
```

## 🔧 Backend Deployment (cPanel)

### 1. Database Setup
1. Create a MySQL database in cPanel
2. Import the schema: `backend/config/schema.sql`
3. Note down database credentials

### 2. Environment Configuration
1. Copy `backend/env.production.example` to `backend/.env`
2. Update with your production values:

```env
# Database Configuration
DB_HOST=your_cpanel_db_host
DB_USER=your_cpanel_db_user
DB_PASSWORD=your_cpanel_db_password
DB_NAME=your_cpanel_db_name

# Production URLs
FRONTEND_URL=https://weareone.co.ke
NODE_ENV=production

# PayPal Configuration (Live Mode)
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret
PAYPAL_MODE=live

# Email Configuration
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
EMAIL_FROM=noreply@weareone.co.ke

# Admin Configuration
ADMIN_API_KEY=your_secure_admin_key
ADMIN_JWT_SECRET=your_secure_jwt_secret
ADMIN_DEFAULT_EMAIL=admin@weareone.co.ke
ADMIN_DEFAULT_PASSWORD=secure_admin_password

# Ollama Configuration (if using external server)
OLLAMA_BASE_URL=https://your-ollama-server.com
OLLAMA_MODEL=qwen3:0.6b
```

### 3. Upload Backend Files
1. Upload the `backend/` folder to your cPanel
2. Install dependencies: `npm install --production`
3. Start the server: `npm start`

### 4. Configure Node.js App
1. In cPanel, go to "Node.js Apps"
2. Create a new Node.js application
3. Set the application root to your backend folder
4. Set the Node.js version to 18.x or higher
5. Set the startup file to `server.js`
6. Set the application URL to `https://weareone.co.ke`

## 🌐 Frontend Deployment

### 1. Build the Frontend
```bash
# In the project root
npm run build
```

### 2. Upload to cPanel
1. Upload the `dist/` folder contents to your public_html directory
2. Ensure `index.html` is in the root of public_html

### 3. Configure .htaccess
Create a `.htaccess` file in public_html:

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
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>
```

## 🔐 Admin Panel Deployment

### 1. Build Admin Panel
```bash
# In WAO_Admin directory
npm run build
```

### 2. Upload Admin Panel
1. Create a subdomain: `admin.weareone.co.ke`
2. Upload the `dist/` contents to the admin subdomain directory
3. Create `.htaccess` for the admin panel (same as above)

### 3. Configure Admin Environment
1. Copy `WAO_Admin/env.production.example` to `WAO_Admin/.env`
2. Update with production values:

```env
VITE_API_BASE_URL=https://weareone.co.ke
VITE_ADMIN_API_KEY=your_admin_api_key
NODE_ENV=production
```

## 🔒 Security Configuration

### 1. SSL Certificate
- Ensure SSL is enabled for both main domain and admin subdomain
- Redirect all HTTP traffic to HTTPS

### 2. Environment Variables
- Keep all sensitive data in environment variables
- Never commit `.env` files to version control
- Use strong, unique passwords and API keys

### 3. Database Security
- Use strong database passwords
- Limit database user permissions
- Enable database backups

## 🧪 Testing Deployment

### 1. Health Check
```bash
curl https://weareone.co.ke/health
```

### 2. API Endpoints
- Test authentication: `https://weareone.co.ke/api/auth/login`
- Test chat: `https://weareone.co.ke/api/chat/health`
- Test payments: `https://weareone.co.ke/api/paypal/health`

### 3. Frontend Features
- Test user registration/login
- Test AI chat functionality
- Test donation system
- Test admin panel access

## 📧 Email Configuration

### 1. SMTP Setup
Configure your email service in cPanel:
- Use your domain's email or a service like Gmail
- Enable SMTP authentication
- Test email sending

### 2. Email Templates
Ensure these emails work:
- Password reset emails
- Event registration confirmations
- Payment confirmations

## 🔄 Maintenance

### 1. Regular Backups
- Database backups (daily)
- File backups (weekly)
- Configuration backups

### 2. Monitoring
- Set up uptime monitoring
- Monitor error logs
- Track performance metrics

### 3. Updates
- Keep Node.js updated
- Update dependencies regularly
- Monitor security advisories

## 🆘 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check CORS configuration in `backend/server.js`
2. **Database Connection**: Verify database credentials and host
3. **Email Issues**: Check SMTP configuration
4. **Payment Issues**: Verify PayPal live credentials
5. **AI Chat Issues**: Check Ollama server connectivity

### Logs Location:
- Backend logs: Check cPanel error logs
- Frontend errors: Browser developer console
- Database errors: MySQL error log

## 📞 Support

For deployment issues:
1. Check cPanel error logs
2. Verify all environment variables
3. Test individual components
4. Contact hosting provider if needed

---

**🎉 Congratulations!** Your WE-ARE-ONE application should now be live at `https://weareone.co.ke/` 