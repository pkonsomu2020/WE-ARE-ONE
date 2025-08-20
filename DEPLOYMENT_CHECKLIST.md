# ✅ WE-ARE-ONE Deployment Checklist

## Pre-Deployment Setup

### Environment Variables
- [ ] Copy `backend/env.production.example` to `backend/.env`
- [ ] Update database credentials for production
- [ ] Set `FRONTEND_URL=https://weareone.co.ke`
- [ ] Set `NODE_ENV=production`
- [ ] Configure PayPal live credentials
- [ ] Set up email SMTP configuration
- [ ] Generate secure JWT secrets
- [ ] Set admin API key and credentials

### Database Setup
- [ ] Create MySQL database in cPanel
- [ ] Import `backend/config/schema.sql`
- [ ] Test database connection
- [ ] Verify all tables are created

### Domain & SSL
- [ ] Ensure `weareone.co.ke` is pointing to cPanel
- [ ] Enable SSL certificate
- [ ] Set up HTTPS redirect
- [ ] Create admin subdomain: `admin.weareone.co.ke`

## Backend Deployment

### Node.js App Configuration
- [ ] Upload `backend/` folder to cPanel
- [ ] Install production dependencies: `npm install --production`
- [ ] Configure Node.js app in cPanel
- [ ] Set startup file to `server.js`
- [ ] Set Node.js version to 18.x+
- [ ] Start the application

### API Testing
- [ ] Test health endpoint: `https://weareone.co.ke/health`
- [ ] Test authentication: `https://weareone.co.ke/api/auth/login`
- [ ] Test chat endpoint: `https://weareone.co.ke/api/chat/health`
- [ ] Verify CORS is working
- [ ] Test database connections

## Frontend Deployment

### Build & Upload
- [ ] Run `npm run build` in project root
- [ ] Upload `dist/` contents to `public_html/`
- [ ] Create `.htaccess` file for React Router
- [ ] Verify `index.html` is in root directory

### Frontend Testing
- [ ] Test homepage loads correctly
- [ ] Test user registration/login
- [ ] Test AI chat functionality
- [ ] Test donation system
- [ ] Test mobile responsiveness

## Admin Panel Deployment

### Build & Upload
- [ ] Run `npm run build` in `WAO_Admin/` directory
- [ ] Upload admin `dist/` to admin subdomain
- [ ] Create `.htaccess` for admin panel
- [ ] Configure admin environment variables

### Admin Testing
- [ ] Test admin login at `admin.weareone.co.ke`
- [ ] Test payment management
- [ ] Test event management
- [ ] Verify admin API key works

## Email Configuration

### SMTP Setup
- [ ] Configure email service in cPanel
- [ ] Test password reset emails
- [ ] Test event registration emails
- [ ] Test payment confirmation emails

## Security Verification

### Environment Security
- [ ] All sensitive data in environment variables
- [ ] No hardcoded credentials in code
- [ ] Strong passwords and API keys
- [ ] JWT secrets are secure

### SSL & HTTPS
- [ ] SSL certificate is active
- [ ] All HTTP traffic redirects to HTTPS
- [ ] Mixed content warnings resolved
- [ ] Security headers configured

## Payment System

### PayPal Configuration
- [ ] PayPal live credentials configured
- [ ] Test donation flow end-to-end
- [ ] Verify success/failure redirects
- [ ] Test payment notifications

### M-Pesa Configuration (if using)
- [ ] M-Pesa live credentials configured
- [ ] Test payment flow
- [ ] Verify webhook endpoints

## AI Chat System

### Ollama Configuration
- [ ] Ollama server is accessible
- [ ] Test AI chat responses
- [ ] Verify model is working
- [ ] Test conversation history

## Final Testing

### User Experience
- [ ] Test complete user registration flow
- [ ] Test login/logout functionality
- [ ] Test password reset process
- [ ] Test profile management
- [ ] Test mood tracking
- [ ] Test journal entries
- [ ] Test event registration

### Performance
- [ ] Page load times are acceptable
- [ ] Images and assets load correctly
- [ ] Mobile performance is good
- [ ] API response times are reasonable

### Error Handling
- [ ] 404 pages work correctly
- [ ] Error messages are user-friendly
- [ ] Network errors are handled gracefully
- [ ] Form validation works

## Monitoring Setup

### Logs & Monitoring
- [ ] Set up error logging
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Configure backup systems

### Maintenance
- [ ] Schedule regular backups
- [ ] Plan update procedures
- [ ] Document maintenance tasks
- [ ] Set up alert systems

## Documentation

### Deployment Documentation
- [ ] Update README with production URLs
- [ ] Document deployment procedures
- [ ] Create maintenance guides
- [ ] Document troubleshooting steps

### User Documentation
- [ ] Create user guides
- [ ] Document admin procedures
- [ ] Create support documentation

## Go Live Checklist

### Final Verification
- [ ] All tests pass
- [ ] No console errors
- [ ] All features working
- [ ] Performance is acceptable
- [ ] Security is verified
- [ ] Backup systems are active

### Launch
- [ ] Announce the launch
- [ ] Monitor for issues
- [ ] Gather user feedback
- [ ] Plan for improvements

---

## 🎉 Deployment Complete!

Your WE-ARE-ONE application is now live at:
- **Main Site**: https://weareone.co.ke
- **Admin Panel**: https://admin.weareone.co.ke

### Important URLs
- Health Check: https://weareone.co.ke/health
- API Base: https://weareone.co.ke/api
- Admin Login: https://admin.weareone.co.ke

### Support Contacts
- Technical Issues: Check cPanel logs
- User Support: Monitor user feedback
- Payment Issues: Check PayPal dashboard 