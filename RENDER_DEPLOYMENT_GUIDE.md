# Render Backend Deployment Guide

## 🚀 Step-by-Step Deployment to Render

### Prerequisites
- GitHub repository with your backend code
- Render account (free tier available)
- cPanel MySQL database with external access enabled

### Step 1: Prepare Backend for Render

#### 1.1 Update package.json
Ensure your backend has the correct start script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

#### 1.2 Environment Variables Setup
Create a `.env.example` file with all required variables:

```env
NODE_ENV=production
PORT=10000
DB_HOST=your-cpanel-mysql-host
DB_NAME=weareone_donation_app
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_PORT=3306
FRONTEND_URL=https://weareone.co.ke
JWT_SECRET=your-jwt-secret
MPESA_CONSUMER_KEY=your-mpesa-key
MPESA_CONSUMER_SECRET=your-mpesa-secret
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-email-password
```

### Step 2: Deploy to Render

#### 2.1 Create New Web Service
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your backend repository

#### 2.2 Configure Build Settings
- **Name**: `wao-backend`
- **Environment**: `Node`
- **Region**: `Oregon (US West)` or closest to your users
- **Branch**: `main` or `master`
- **Root Directory**: `backend` (if backend is in subfolder)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### 2.3 Set Environment Variables
In the Render dashboard, add all environment variables from your `.env` file:

```
NODE_ENV=production
PORT=10000
DB_HOST=[your-cpanel-mysql-host]
DB_NAME=weareone_donation_app
DB_USER=[your-mysql-username]
DB_PASSWORD=[your-mysql-password]
FRONTEND_URL=https://weareone.co.ke
JWT_SECRET=[your-jwt-secret]
```

### Step 3: Database Configuration

#### 3.1 Enable External MySQL Access in cPanel
1. Login to your cPanel
2. Go to "Remote MySQL"
3. Add Render's IP ranges or use `%` for any IP (less secure)
4. Test connection from your local machine first

#### 3.2 Update Database Connection
Ensure your backend can connect to external MySQL:

```javascript
// In your database config
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: false, // Usually false for cPanel MySQL
  acquireTimeout: 60000,
  timeout: 60000
};
```

### Step 4: Deploy and Test

#### 4.1 Initial Deployment
1. Click "Create Web Service" in Render
2. Wait for build to complete (5-10 minutes)
3. Check logs for any errors
4. Note your Render URL: `https://wao-backend.onrender.com`

#### 4.2 Test API Endpoints
Test key endpoints:
```bash
# Health check
curl https://wao-backend.onrender.com/api/health

# Test database connection
curl https://wao-backend.onrender.com/api/test-db

# Test authentication
curl -X POST https://wao-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Step 5: Custom Domain (Optional)

#### 5.1 Add Custom Domain in Render
1. Go to Settings → Custom Domains
2. Add `api.weareone.co.ke`
3. Note the CNAME record provided

#### 5.2 Update DNS
In your domain registrar:
- Add CNAME record: `api.weareone.co.ke` → `wao-backend.onrender.com`

### Step 6: Update Frontend API URLs

Update your frontend to use the new backend URL:

```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.weareone.co.ke'  // or https://wao-backend.onrender.com
  : 'http://localhost:5000';
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Errors
- Check if external access is enabled in cPanel
- Verify credentials and host address
- Test connection from local machine first

#### Build Failures
- Check Node.js version compatibility
- Ensure all dependencies are in package.json
- Check build logs for specific errors

#### CORS Issues
- Update CORS settings to include new frontend URLs
- Add both Vercel and custom domain URLs

#### Environment Variables
- Double-check all required variables are set
- Ensure no typos in variable names
- Check for special characters that need escaping

### Monitoring and Logs
- Use Render dashboard to monitor performance
- Check logs for errors and debugging
- Set up alerts for downtime

## 🎯 Next Steps

After successful Render deployment:
1. Update frontend API URLs
2. Deploy frontend to Vercel
3. Update DNS records
4. Test complete system
5. Monitor for 24-48 hours

## 💡 Pro Tips

1. **Free Tier Limitations**: Render free tier sleeps after 15 minutes of inactivity
2. **Keep Warm**: Consider a simple cron job to ping your API every 10 minutes
3. **Monitoring**: Use Render's built-in monitoring or external services
4. **Backups**: Keep regular database backups
5. **Staging**: Consider a staging environment for testing