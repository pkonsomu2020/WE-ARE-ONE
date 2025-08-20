# OpenAI Integration Setup

## Prerequisites
1. An OpenAI API key (get one at https://platform.openai.com/api-keys)
2. Node.js backend running

## Setup Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend folder with these variables:

```env
# Database Configuration
DB_HOST=your_production_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
DB_PORT=3306

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Email Configuration (if using nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy the key and add it to your `.env` file

### 4. Test the Integration
```bash
# Start the backend server
npm start

# Test OpenAI health check
curl https://weareone.co.ke/api/chat/health
```

### 5. Frontend Integration
The frontend is already updated to use the OpenAI API. Just make sure:
1. Backend is running on port 3000
2. Frontend is running on port 8080
3. CORS is properly configured

## Features
- **Mental Health Focus**: The AI is specifically trained to provide mental health support
- **Conversation Memory**: Maintains conversation history for context
- **Fallback Responses**: Graceful handling when OpenAI is unavailable
- **Loading States**: Visual feedback during AI processing

## API Endpoints
- `POST /api/chat/message` - Send a message to the AI
- `GET /api/chat/health` - Check OpenAI connection status

## Cost Considerations
- OpenAI charges per token used
- GPT-3.5-turbo is cost-effective for chat applications
- Monitor usage in your OpenAI dashboard 