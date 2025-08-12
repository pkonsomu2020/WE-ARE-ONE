#!/bin/bash

# 🚀 We Are One Backend - cPanel Deployment Script
# Usage: ./deploy-to-cpanel.sh

echo "🚀 Starting We Are One Backend Deployment to cPanel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "backend/server.js" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Preparing backend for production deployment..."

# Step 1: Create production environment file
print_status "Creating production environment file..."
cat > backend/.env.production << 'EOF'
# Production Environment Variables for weareone.co.ke
NODE_ENV=production
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USER=your_cpanel_db_user
DB_PASSWORD=your_cpanel_db_password
DB_NAME=donation_app
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Frontend URL (Production)
FRONTEND_URL=https://weareone.co.ke

# Email Configuration (Update with your cPanel email settings)
EMAIL_HOST=mail.weareone.co.ke
EMAIL_PORT=587
EMAIL_USER=your_email@weareone.co.ke
EMAIL_PASS=your_email_password
EMAIL_FROM=noreply@weareone.co.ke

# PayPal Configuration (Update with your production PayPal credentials)
PAYPAL_CLIENT_ID=your_production_paypal_client_id
PAYPAL_CLIENT_SECRET=your_production_paypal_secret
PAYPAL_MODE=live

# PayD Configuration (Update with your production PayD credentials)
PAYD_MERCHANT_ID=your_production_payd_merchant_id
PAYD_API_KEY=your_production_payd_api_key
PAYD_MODE=live

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3:8b

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

print_success "Production environment file created: backend/.env.production"

# Step 2: Install production dependencies
print_status "Installing production dependencies..."
cd backend
npm install --production
cd ..

print_success "Dependencies installed successfully"

# Step 3: Create deployment package
print_status "Creating deployment package..."
DEPLOY_DIR="weareone-backend-deploy"
mkdir -p $DEPLOY_DIR

# Copy backend files
cp -r backend/* $DEPLOY_DIR/
cp backend/.env.production $DEPLOY_DIR/.env

# Create deployment instructions
cat > $DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.txt << 'EOF'
🚀 We Are One Backend - cPanel Deployment Instructions

1. UPLOAD FILES:
   - Upload all files in this folder to your cPanel backend directory
   - Rename .env.production to .env on the server

2. DATABASE SETUP:
   - Create MySQL database: donation_app
   - Import schema from config/schema.sql
   - Update database credentials in .env file

3. ENVIRONMENT CONFIGURATION:
   - Update all credentials in .env file:
     * Database credentials
     * Email settings
     * PayPal/PayD production credentials
     * JWT secret

4. START APPLICATION:
   Method 1 - cPanel Node.js App Manager:
   - Go to cPanel → Node.js App Manager
   - Create new application
   - Set startup file: server.js
   - Set port: 3000

   Method 2 - PM2 (Recommended):
   - SSH into your server
   - cd /path/to/backend
   - npm install -g pm2
   - pm2 start server.js --name "weareone-backend"
   - pm2 save
   - pm2 startup

5. TEST:
   - Visit: https://weareone.co.ke/health
   - Should return: {"status":"OK"}

6. FRONTEND INTEGRATION:
   - Your frontend is already configured to use https://weareone.co.ke
   - No changes needed to frontend code

Need help? Check CPANEL_DEPLOYMENT_GUIDE.md for detailed instructions.
EOF

print_success "Deployment package created: $DEPLOY_DIR/"

# Step 4: Create zip file for easy upload
print_status "Creating zip file for cPanel upload..."
zip -r weareone-backend-deploy.zip $DEPLOY_DIR/

print_success "Deployment zip created: weareone-backend-deploy.zip"

# Step 5: Display next steps
echo ""
print_success "🎉 Backend preparation completed!"
echo ""
print_status "Next steps:"
echo "1. Upload weareone-backend-deploy.zip to your cPanel"
echo "2. Extract the zip file in your backend directory"
echo "3. Follow the instructions in DEPLOYMENT_INSTRUCTIONS.txt"
echo "4. Update all credentials in the .env file"
echo "5. Start the application using PM2 or cPanel Node.js App Manager"
echo ""
print_warning "IMPORTANT: Update all credentials in .env file before starting the application!"
echo ""
print_status "For detailed instructions, see: CPANEL_DEPLOYMENT_GUIDE.md"
