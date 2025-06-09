# WE ARE ONE FAMILY – Mental Health Platform

![WEAREONE](/screenshot.png)

Welcome to **WE ARE ONE**, a donation platform built to support charitable initiatives by allowing users to contribute securely via PayPal. The project features a clean, responsive frontend and a robust backend that handles PayPal payments in sandbox mode.

## ✨ Features

- 🧡 Modern and responsive UI built with React and Tailwind CSS
- 🔒 Secure payment integration using PayPal REST API
- 📩 Instant feedback after donation (success/failure messages)
- 🌐 Fully functional backend powered by Express.js
- 🔄 Seamless redirect to PayPal and back to the application

---

## 🛠️ Tech Stack

### Frontend
- React (TypeScript)
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- PayPal REST SDK

### Set up Frontend:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm intall

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Set up Backend:

```sh

# Step 1: Navigate to the backend directory.
cd backend

# Step 3: Install the necessary dependencies.
npm intall

# Step 4: Create .env file
Create a .env file in the backend folder:
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_MODE=sandbox
PORT=3000

# Step 5: Start the development server with auto-reloading and an instant preview.
npm start
```

---
