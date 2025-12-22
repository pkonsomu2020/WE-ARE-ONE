# 🚀 WeAreOne Supabase Migration & Deployment Guide

## 🎯 Overview
This guide will help you migrate from MySQL to Supabase PostgreSQL and deploy your application to modern cloud platforms.

## 📋 Migration Steps

### Phase 1: Supabase Setup (30 minutes)

#### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose organization and fill details:
   - **Name**: `weareone-production`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Wait for project creation (2-3 minutes)

#### 1.2 Get Database Credentials
1. Go to **Settings** → **Database**
2. Note down these details:
   ```
   Host: db.your-project-ref.supabase.co
   Database name: postgres
   Port: 5432
   User: postgres
   Password: [your-generated-password]
   ```

#### 1.3 Run Database Migration
1. Go to **SQL Editor** in Supabase dashboard
2. Create new query
3. Copy and paste `supabase-migration-schema.sql`
4. Click **Run** (takes 2-3 minutes)
5. Verify tables are created in **Table Editor**

#### 1.4 Import Data
1. In **SQL Editor**, create another new query
2. Copy and paste `supabase-data-migration.sql`
3. Click **Run** (takes 1-2 minutes)
4. Verify data in **Table Editor**

### Phase 2: Backend Configuration (15 minutes)

#### 2.1 Update Environment Variables
Create/update `backend/.env`:
```env
# Supabase PostgreSQL Configuration
SUPABASE_DB_HOST=db.your-project-ref.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-database-password

# Keep existing variables
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://weareone.co.ke
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

#### 2.2 Update Database Configuration
Replace `backend/config/database.js` with:
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.SUPABASE_DB_HOST,
  port: process.env.SUPABASE_DB_PORT,
  database: process.env.SUPABASE_DB_NAME,
  user: process.env.SUPABASE_DB_USER,
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Supabase PostgreSQL connected:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

module.exports = { pool, testConnection };
```

#### 2.3 Update Package Dependencies
Add PostgreSQL driver to `backend/package.json`:
```bash
cd backend
npm install pg
npm uninstall mysql2  # Remove MySQL driver
```

#### 2.4 Test Local Connection
```bash
cd backend
node -e "require('./config/database').testConnection()"
```

### Phase 3: Deploy Backend to Render (20 minutes)

#### 3.1 Update Render Configuration
Update `render.yaml`:
```yaml
services:
  - type: web
    name: wao-backend
    env: node
    region: oregon
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: SUPABASE_DB_HOST
        value: db.your-project-ref.supabase.co
      - key: SUPABASE_DB_PORT
        value: 5432
      - key: SUPABASE_DB_NAME
        value: postgres
      - key: SUPABASE_DB_USER
        value: postgres
      - key: SUPABASE_DB_PASSWORD
        sync: false  # Set manually in Render dashboard
      - key: FRONTEND_URL
        value: https://weareone.co.ke
      - key: JWT_SECRET
        sync: false
      - key: PAYPAL_CLIENT_ID
        sync: false
      - key: PAYPAL_CLIENT_SECRET
        sync: false
      - key: PAYPAL_MODE
        value: live
```

#### 3.2 Deploy to Render
1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Create **Web Service**
4. Configure:
   - **Name**: `wao-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
5. Set environment variables (copy from your `.env`)
6. Deploy and wait for completion

#### 3.3 Test Backend Deployment
```bash
curl https://wao-backend.onrender.com/api/health
```

### Phase 4: Deploy Frontends to Vercel (30 minutes)

#### 4.1 Update Frontend API URLs
Already done in previous cleanup! ✅

#### 4.2 Deploy User Frontend
1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set environment variables:
   ```
   VITE_API_BASE_URL=https://wao-backend.onrender.com/api
   ```
5. Deploy

#### 4.3 Deploy Admin Frontend
1. Create new Vercel project
2. Import same repository
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `WAO_Admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set environment variables:
   ```
   VITE_API_BASE_URL=https://wao-backend.onrender.com
   VITE_ADMIN_API_KEY=your-admin-api-key
   ```
5. Deploy

### Phase 5: DNS Configuration (15 minutes)

#### 5.1 Update DNS Records
In your domain registrar:

1. **Main Website**
   ```
   Type: CNAME
   Name: @
   Value: [your-vercel-domain].vercel.app
   ```

2. **Admin Panel**
   ```
   Type: CNAME
   Name: admin
   Value: [your-admin-vercel-domain].vercel.app
   ```

3. **API Backend** (Optional)
   ```
   Type: CNAME
   Name: api
   Value: wao-backend.onrender.com
   ```

#### 5.2 Configure Custom Domains
1. **Vercel**: Add custom domains in project settings
2. **Render**: Add custom domain in service settings

## 🧪 Testing Checklist

### Backend Testing
- [ ] Health endpoint: `GET /api/health`
- [ ] Database connection working
- [ ] Admin login: `POST /api/admin/auth/login`
- [ ] Events API: `GET /api/event-scheduler/events`
- [ ] File upload working
- [ ] Email notifications working

### Frontend Testing
- [ ] User registration/login
- [ ] Admin panel access
- [ ] Event creation/management
- [ ] File repository access
- [ ] Payment processing
- [ ] Mobile responsiveness

### Integration Testing
- [ ] Frontend → Backend API calls
- [ ] Admin panel → Backend communication
- [ ] Email notifications triggered
- [ ] File uploads/downloads
- [ ] Event scheduling and reminders

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Test connection manually
psql "postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres"
```

#### CORS Issues
- Check `allowedOrigins` in `backend/server.js`
- Add Vercel domains to CORS configuration

#### Build Failures
- Check Node.js version compatibility
- Verify all dependencies in `package.json`
- Check environment variables

#### SSL Certificate Issues
- Both Vercel and Render provide automatic SSL
- DNS propagation takes 24-48 hours

### Performance Optimization

#### Supabase
- Enable connection pooling
- Use read replicas for heavy queries
- Optimize database indexes

#### Render
- Use persistent disks for file storage
- Enable auto-scaling
- Monitor resource usage

#### Vercel
- Enable edge caching
- Optimize bundle size
- Use Vercel Analytics

## 💰 Cost Analysis

### Free Tier Limits
- **Supabase**: 500MB database, 2GB bandwidth
- **Render**: 750 hours/month, sleeps after 15min
- **Vercel**: 100GB bandwidth, unlimited deployments

### Paid Upgrades (If Needed)
- **Supabase Pro**: $25/month (8GB database, 250GB bandwidth)
- **Render Pro**: $7/month (no sleep, better performance)
- **Vercel Pro**: $20/month (more bandwidth, analytics)

## 🎉 Benefits of New Architecture

### Reliability
- 99.9% uptime on all platforms
- Automatic backups and point-in-time recovery
- Global CDN and edge computing

### Performance
- PostgreSQL is faster than MySQL for complex queries
- Supabase provides connection pooling
- Vercel edge functions for optimal performance

### Developer Experience
- Real-time database subscriptions
- Built-in authentication and authorization
- Automatic API generation
- Git-based deployments

### Scalability
- Automatic scaling based on traffic
- Read replicas for database scaling
- Edge computing for global performance

## 🚀 Next Steps

1. **Monitor Performance**: Use built-in dashboards
2. **Set Up Alerts**: Configure uptime monitoring
3. **Backup Strategy**: Supabase handles this automatically
4. **Security**: Review RLS policies and API keys
5. **Documentation**: Update team documentation

## 📞 Support

- **Supabase**: [docs.supabase.com](https://docs.supabase.com)
- **Render**: [render.com/docs](https://render.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)

---

**Ready to migrate? Start with Phase 1: Supabase Setup! 🚀**