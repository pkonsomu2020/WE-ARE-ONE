# WE ARE ONE FAMILY – Mental Health & AI Support Platform

![WEAREONE](/screenshot.png)

Welcome to **WE ARE ONE**, a comprehensive mental health support platform that combines charitable donations with AI-powered mental health assistance. The platform features a modern, responsive interface with secure PayPal integration and an intelligent AI chatbot for mental health support.

## ✨ Key Features

### 🧠 AI-Powered Mental Health Support
- **Intelligent Chatbot**: Powered by Ollama with local AI models (Qwen3:0.6b)
- **Comprehensive Support**: Mental health, physical health, safety, and general assistance
- **Chat History**: Save and manage conversation sessions
- **Mobile-First Design**: Responsive chat interface for all devices

### 🎯 Core Platform Features
- **Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS
- **Secure Payments**: PayPal integration for charitable donations
- **User Management**: Registration, authentication, and profile management
- **Mood Tracking**: Daily mood monitoring and journaling
- **Settings Management**: Customizable user preferences and data export

### 📱 Mobile Responsive Design
- **Mobile Navigation**: Slide-out menus for all screen sizes
- **Touch Optimized**: Large touch targets and smooth interactions
- **Floating Chat Icon**: Easy access to AI chat from homepage
- **Responsive Layout**: Optimized for mobile, tablet, and desktop

### 🔒 Privacy & Data Management
- **Data Export**: Download all user data as JSON
- **Account Deletion**: Complete data removal with confirmation
- **Settings Control**: Dark mode, notifications, and data retention
- **Secure Storage**: MySQL database with proper encryption

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Axios** for API communication
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **MySQL** database with MySQL2 driver
- **Ollama** for local AI model integration
- **PayPal REST SDK** for payments
- **JWT** for authentication
- **bcryptjs** for password hashing

### AI Integration
- **Ollama**: Local large language model serving
- **Qwen3:0.6b**: Optimized AI model for fast responses
- **Custom System Prompts**: Tailored for mental health support
- **Conversation History**: Context-aware AI responses

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- Ollama installed and running
- PayPal developer account

### Frontend Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Environment Variables (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=donation_app

# PayPal Configuration
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_MODE=sandbox

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3:0.6b

# Server Configuration
PORT=3000
JWT_SECRET=your_jwt_secret
```

### Database Setup

```bash
# Run the database schema
mysql -u your_username -p donation_app < backend/config/schema.sql
```

### Ollama Setup

```bash
# Install Ollama (if not already installed)
# Visit: https://ollama.ai

# Pull the optimized model
ollama pull qwen3:0.6b

# Start Ollama service
ollama serve
```

### Start the Application

```bash
# Start backend server
cd backend
npm run dev

# Start frontend (in new terminal)
npm run dev
```

Visit `http://localhost:8080` to access the application.

---

## 🎯 Core Features

### AI Chat Interface
- **Smart Conversations**: AI responds to mental health, health, safety, and general topics
- **Session Management**: Create, edit, and delete chat sessions
- **Mobile Navigation**: Slide-out chat history on mobile devices
- **Real-time Responses**: Fast AI responses with local model processing

### User Dashboard
- **Mood Tracker**: Daily mood logging with notes
- **Journal Entries**: Personal journaling with rich text
- **Settings Panel**: Customize app preferences and data management
- **Profile Management**: Update personal information and emergency contacts

### Donation System
- **PayPal Integration**: Secure payment processing
- **Success/Failure Handling**: Clear feedback for all transactions
- **Event Management**: Support for community events and fundraisers

### Mobile Experience
- **Responsive Design**: Optimized for all screen sizes
- **Touch Navigation**: Intuitive mobile menu system
- **Floating Actions**: Easy access to key features
- **Offline Capable**: Core features work without constant internet

---

## 📱 Mobile Features

### Navigation
- **Slide-out Menus**: Easy access to all sections
- **Chat History**: Collapsible chat sessions in mobile menu
- **Quick Actions**: Floating chat icon on homepage
- **Back Navigation**: "BACK HOME" buttons throughout the app

### Chat Interface
- **Mobile-Optimized**: Touch-friendly chat interface
- **Responsive Typography**: Readable text on all devices
- **Gesture Support**: Swipe and tap interactions
- **Keyboard Handling**: Proper input handling on mobile

---

## 🔧 Configuration

### AI Model Settings
The platform uses Ollama with the Qwen3:0.6b model for optimal performance. You can change the model in the `.env` file:

```env
OLLAMA_MODEL=qwen3:0.6b  # Fast and efficient
# Alternative models:
# OLLAMA_MODEL=llama2:7b  # Good balance
# OLLAMA_MODEL=mistral:7b # High quality
```

### Database Schema
The application includes comprehensive database tables:
- `users` - User accounts and profiles
- `user_settings` - User preferences and settings
- `moods` - Mood tracking data
- `journal_entries` - Personal journal entries
- `chat_sessions` - AI chat conversation sessions
- `chat_messages` - Individual chat messages
- `support_categories` - Available support categories

---

## 🚀 Deployment

### Production Setup
1. Set up a production MySQL database
2. Configure environment variables for production
3. Install and configure Ollama on your server
4. Set up reverse proxy (nginx recommended)
5. Configure SSL certificates
6. Set up monitoring and logging

### Docker Support (Optional)
```bash
# Build and run with Docker
docker-compose up -d
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Support

For support and questions:
- **Crisis Hotline**: +254 7118 53928
- **Therapist Contact**: +254 79567 65298
- **Technical Issues**: Create an issue in the repository

---

## 🔄 Recent Updates

### Latest Features Added:
- ✅ AI Chat with Ollama integration
- ✅ Mobile-responsive design
- ✅ Chat history management
- ✅ User settings and preferences
- ✅ Data export functionality
- ✅ Floating chat icon on homepage
- ✅ Comprehensive mobile navigation
- ✅ Emergency contact display
- ✅ Account deletion with data cleanup

### Performance Improvements:
- ✅ Optimized AI model (Qwen3:0.6b)
- ✅ Fast response times
- ✅ Mobile-optimized interface
- ✅ Efficient database queries
- ✅ Responsive image handling

---

**Built with ❤️ for mental health support and community care.**
