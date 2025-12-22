# 🚀 Render Deployment Fix Guide

## ❌ Issue Identified:
Render was running `npm run dev` which uses `nodemon` (not available in production), causing the deployment to fail.

## ✅ Fixes Applied:

### 1. Updated package.json
- **Changed**: `"dev": "nodemon server.js"` → `"dev": "node server.js"`
- **Result**: Both `npm start` and `npm run dev` now work in production

### 2. Updated render.yaml
- **Removed**: Old MySQL database configuration
- **Added**: Supabase PostgreSQL configuration
- **Confirmed**: `startCommand: cd backend && npm start`

## 🔧 Manual Render Dashboard Configuration:

If the render.yaml isn't being used, configure these settings manually in your Render dashboard:

### Build & Deploy Settings:
```
Build Command: cd backend && npm install
Start Command: cd backend && npm start
```

### Environment Variables:
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://weareone.co.ke

# Supabase Configuration
SUPABASE_URL=https://ywdnidepgytvehfjtkpp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3ZG5pZGVwZ3l0dmVoZmp0a3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMTM2MzAsImV4cCI6MjA4MTg4OTYzMH0.T8iIqEqqceZ1JvB9Wt-hhoCecX8jb3vVy0XL55R2laA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3ZG5pZGVwZ3l0dmVoZmp0a3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjMxMzYzMCwiZXhwIjoyMDgxODg5NjMwfQ.Q929rzspx9XBoSCXxlG4Q3m0hsHbQ_ZUdOshEm5-Byg

# Database Configuration (Fallback)
DB_HOST=db.ywdnidepgytvehfjtkpp.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=Dela6572@
DB_NAME=postgres
DATABASE_URL=postgresql://postgres:Dela6572@db.ywdnidepgytvehfjtkpp.supabase.co:5432/postgres

# Your existing environment variables
JWT_SECRET=your-jwt-secret
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=live
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-email-password
EMAIL_FROM=your-email
PAYD_USERNAME=your-payd-username
PAYD_PASSWORD=your-payd-password
PAYD_MODE=live
ADMIN_API_KEY=your-admin-api-key
ADMIN_DEFAULT_EMAIL=admin@weareone.co.ke
ADMIN_DEFAULT_PASSWORD=your-admin-password
ADMIN_DEFAULT_NAME=WAO Admin
EVENTS_ADMIN_EMAIL=events@weareone.co.ke
```

## 🚀 Next Steps:

### 1. Push Changes to GitHub:
```bash
git add .
git commit -m "Fix Render deployment - update scripts and Supabase config"
git push origin main
```

### 2. Redeploy on Render:
- Go to your Render dashboard
- Click "Manual Deploy" or wait for auto-deploy
- Monitor the logs for successful deployment

### 3. Verify Deployment:
- Check that the build completes successfully
- Verify the service starts with `npm start`
- Test API endpoints to ensure Supabase connection works

## ✅ Expected Success Output:
```
==> Running 'npm start'
> donation-backend@1.0.0 start
> node server.js

✅ Supabase Database connected successfully
Server running on port 10000
```

## 🔍 Troubleshooting:

If you still get errors:
1. **Check Render logs** for specific error messages
2. **Verify environment variables** are set correctly in Render dashboard
3. **Test locally** with `npm start` to ensure it works
4. **Check Supabase credentials** are correct and project is active

Your deployment should now work successfully! 🎉