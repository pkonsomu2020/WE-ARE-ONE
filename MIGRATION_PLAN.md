# WeAreOne Migration Plan: cPanel → Vercel + Render

## 🎯 Target Architecture
- **Frontend (User + Admin)**: Vercel with custom domain `weareone.co.ke`
- **Backend API**: Render with custom subdomain `api.weareone.co.ke`
- **Database**: Keep cPanel MySQL with external access
- **File Storage**: Render for uploads, or migrate to cloud storage

## 📋 Migration Checklist

### Phase 1: Backend Migration to Render ⚡

#### 1.1 Prepare Backend for Render
- [x] Clean up backend code (already done)
- [ ] Update environment variables for Render
- [ ] Configure database for external access
- [ ] Test backend locally with external database

#### 1.2 Deploy to Render
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Deploy and test

#### 1.3 Database Configuration
- [ ] Enable external MySQL access in cPanel
- [ ] Update connection strings for Render IP
- [ ] Test database connectivity from Render

### Phase 2: Frontend Migration to Vercel 🚀

#### 2.1 Update API URLs
- [ ] Update `src/lib/api.ts` to point to Render backend
- [ ] Update `WAO_Admin/src/lib/api.ts` to point to Render backend
- [ ] Build and test locally

#### 2.2 Deploy to Vercel
- [ ] Create Vercel account
- [ ] Deploy user frontend to Vercel
- [ ] Deploy admin frontend to Vercel subdomain
- [ ] Configure custom domains

### Phase 3: DNS and Domain Configuration 🌐

#### 3.1 DNS Updates
- [ ] Point `weareone.co.ke` to Vercel
- [ ] Point `admin.weareone.co.ke` to Vercel
- [ ] Point `api.weareone.co.ke` to Render
- [ ] Keep database on cPanel

#### 3.2 SSL and Security
- [ ] Configure SSL certificates (automatic on both platforms)
- [ ] Update CORS settings for new domains
- [ ] Test all endpoints

### Phase 4: Testing and Cleanup 🧪

#### 4.1 Full System Test
- [ ] Test user registration/login
- [ ] Test admin panel access
- [ ] Test payment processing
- [ ] Test file uploads
- [ ] Test email notifications

#### 4.2 Cleanup
- [ ] Remove old cPanel files (keep database)
- [ ] Update documentation
- [ ] Monitor for 24-48 hours

## 🔧 Technical Configuration

### Render Backend Configuration
```yaml
# render.yaml
services:
  - type: web
    name: wao-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DB_HOST
        value: [cPanel MySQL host]
      - key: DB_NAME
        value: weareone_donation_app
      - key: DB_USER
        value: [MySQL username]
      - key: DB_PASSWORD
        value: [MySQL password]
      - key: FRONTEND_URL
        value: https://weareone.co.ke
```

### Vercel Frontend Configuration
```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### Updated API URLs
```typescript
// New API base URLs after migration
const API_BASE_URL = 'https://api.weareone.co.ke';
// or
const API_BASE_URL = 'https://wao-backend.onrender.com';
```

## 💰 Cost Analysis

### Current cPanel Hosting
- Shared hosting with limitations
- Passenger/Apache routing issues
- Manual deployments

### New Architecture Costs
- **Vercel**: Free tier (100GB bandwidth, unlimited sites)
- **Render**: Free tier (750 hours/month, auto-sleep after 15min)
- **cPanel MySQL**: Keep existing (no additional cost)
- **Total**: $0/month for development, ~$7-25/month for production

## 🚀 Benefits

1. **Reliability**: 99.9% uptime on both platforms
2. **Performance**: Global CDN, optimized hosting
3. **Developer Experience**: Git-based deployments, logs, monitoring
4. **Scalability**: Automatic scaling based on traffic
5. **Security**: Automatic SSL, DDoS protection
6. **Maintenance**: No server management required

## ⚠️ Considerations

1. **Database**: Keep MySQL on cPanel, ensure external access
2. **File Uploads**: May need cloud storage (AWS S3, Cloudinary)
3. **Email**: Current SMTP should work fine
4. **Domain**: DNS changes take 24-48 hours to propagate
5. **Downtime**: Plan for 1-2 hours during DNS switch

## 🎯 Timeline

- **Day 1**: Backend to Render (2-3 hours)
- **Day 2**: Frontend to Vercel (2-3 hours)  
- **Day 3**: DNS updates and testing (4-6 hours)
- **Day 4-5**: Monitoring and fixes

## 📞 Next Steps

1. **Immediate**: Fix current builds and test locally
2. **This Week**: Start Render backend deployment
3. **Next Week**: Complete Vercel frontend deployment
4. **Following Week**: DNS migration and go-live

Would you like to proceed with this migration plan?