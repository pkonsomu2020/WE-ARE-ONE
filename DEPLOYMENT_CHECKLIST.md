# 🚀 WeAreOne Deployment Checklist

## ✅ Phase 1: Backend Migration to Render (READY TO START)

### 1.1 Prerequisites Completed ✅
- [x] Backend code cleaned and prepared
- [x] Environment variables documented (.env.example)
- [x] Render configuration created (render.yaml)
- [x] CORS updated for new domains
- [x] API URLs updated in frontend

### 1.2 Deploy Backend to Render
**Time Estimate: 30-45 minutes**

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub account
   - Connect your repository

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Select your GitHub repository
   - Configure settings:
     - **Name**: `wao-backend`
     - **Environment**: `Node`
     - **Region**: `Oregon (US West)`
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Set Environment Variables**
   Copy from your current `.env` file:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=[your-cpanel-mysql-host]
   DB_NAME=weareone_donation_app
   DB_USER=[your-mysql-username]
   DB_PASSWORD=[your-mysql-password]
   FRONTEND_URL=https://weareone.co.ke
   JWT_SECRET=[your-jwt-secret]
   PAYPAL_CLIENT_ID=[your-paypal-client-id]
   PAYPAL_CLIENT_SECRET=[your-paypal-client-secret]
   PAYPAL_MODE=live
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=[your-email]
   EMAIL_PASS=[your-email-password]
   EMAIL_FROM=[your-email]
   PAYD_USERNAME=[your-payd-username]
   PAYD_PASSWORD=[your-payd-password]
   PAYD_MODE=live
   ADMIN_API_KEY=[your-admin-api-key]
   ADMIN_DEFAULT_EMAIL=admin@weareone.co.ke
   ADMIN_DEFAULT_PASSWORD=[your-admin-password]
   ADMIN_DEFAULT_NAME=WAO Admin
   EVENTS_ADMIN_EMAIL=events@weareone.co.ke
   ```

4. **Enable External MySQL Access**
   - Login to cPanel
   - Go to "Remote MySQL"
   - Add `%` (allow all IPs) or specific Render IPs
   - Test connection

5. **Deploy and Test**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Test endpoints:
     ```bash
     curl https://wao-backend.onrender.com/api/health
     curl https://wao-backend.onrender.com/api/cors-test
     ```

### 1.3 Backend Deployment Verification
- [ ] Service deployed successfully
- [ ] Health check endpoint working
- [ ] Database connection established
- [ ] CORS test passing
- [ ] Admin endpoints accessible

---

## 📋 Phase 2: Frontend Migration to Vercel (AFTER BACKEND)

### 2.1 User Frontend Deployment
**Time Estimate: 20-30 minutes**

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub account

2. **Deploy User Frontend**
   - Click "New Project"
   - Import your repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `.` (root)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Set Environment Variables**
   ```
   VITE_API_BASE_URL=https://wao-backend.onrender.com/api
   ```

4. **Custom Domain Setup**
   - Add domain: `weareone.co.ke`
   - Follow DNS instructions

### 2.2 Admin Frontend Deployment
**Time Estimate: 20-30 minutes**

1. **Deploy Admin Frontend**
   - Create new Vercel project
   - Import repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `WAO_Admin`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

2. **Set Environment Variables**
   ```
   VITE_API_BASE_URL=https://wao-backend.onrender.com
   VITE_ADMIN_API_KEY=[your-admin-api-key]
   ```

3. **Custom Domain Setup**
   - Add domain: `admin.weareone.co.ke`
   - Follow DNS instructions

---

## 🌐 Phase 3: DNS Configuration (FINAL STEP)

### 3.1 DNS Records to Update
**Time Estimate: 15 minutes (24-48 hours propagation)**

In your domain registrar (where weareone.co.ke is managed):

1. **Main Website**
   ```
   Type: A or CNAME
   Name: @ (or weareone.co.ke)
   Value: [Vercel IP from dashboard]
   ```

2. **Admin Panel**
   ```
   Type: CNAME
   Name: admin
   Value: [Vercel domain from admin deployment]
   ```

3. **API Backend** (Optional - for custom domain)
   ```
   Type: CNAME
   Name: api
   Value: wao-backend.onrender.com
   ```

### 3.2 SSL Certificates
- Vercel: Automatic SSL (Let's Encrypt)
- Render: Automatic SSL (Let's Encrypt)
- No action required

---

## 🧪 Phase 4: Testing & Verification

### 4.1 Full System Test
- [ ] User registration/login
- [ ] Admin panel access
- [ ] Payment processing (PayPal/Payd)
- [ ] File uploads
- [ ] Email notifications
- [ ] Event scheduling
- [ ] All CRUD operations

### 4.2 Performance Test
- [ ] Page load times
- [ ] API response times
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

---

## 🚨 Rollback Plan

If issues occur:

1. **Immediate Rollback**
   - Revert DNS to point back to cPanel
   - Keep old cPanel files as backup

2. **Partial Rollback**
   - Keep backend on Render, revert frontend to cPanel
   - Or vice versa

3. **Debug Mode**
   - Use Render/Vercel logs for debugging
   - Test with direct URLs before DNS switch

---

## 💰 Cost Summary

### Free Tier Limits
- **Render**: 750 hours/month (sleeps after 15min inactivity)
- **Vercel**: 100GB bandwidth, unlimited deployments
- **Total Cost**: $0/month for development

### Paid Upgrades (If Needed)
- **Render Pro**: $7/month (no sleep, better performance)
- **Vercel Pro**: $20/month (more bandwidth, analytics)

---

## 📞 Next Actions

### Immediate (Today)
1. ✅ Complete backend preparation (DONE)
2. 🚀 Deploy backend to Render
3. 🧪 Test backend endpoints

### This Week
1. Deploy user frontend to Vercel
2. Deploy admin frontend to Vercel
3. Test full system with temporary URLs

### Next Week
1. Update DNS records
2. Monitor for 48 hours
3. Clean up old cPanel files (keep database)

---

## 🆘 Support & Troubleshooting

### Common Issues
- **CORS Errors**: Check allowed origins in backend
- **Database Connection**: Verify cPanel external access
- **Build Failures**: Check Node.js version compatibility
- **DNS Propagation**: Use DNS checker tools

### Monitoring
- Render Dashboard: Logs, metrics, alerts
- Vercel Dashboard: Analytics, performance
- Uptime monitoring: Consider UptimeRobot (free)

### Backup Strategy
- Database: Regular MySQL exports
- Code: Git repository (already done)
- Environment: Document all settings

---

**Ready to start? Begin with Phase 1: Backend Deployment to Render! 🚀**