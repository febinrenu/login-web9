# Login and Registration System

A simple full-stack authentication system with MongoDB.

## Prerequisites

1. **Node.js** installed
2. **MongoDB** installed and running locally on port 27017

## Setup Instructions

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Start MongoDB

Make sure MongoDB is running on your local machine:

```bash
mongod
```

### 3. Start the Application

**Backend (Terminal 1):**
```bash
cd backend
node server.js
```

Or simply double-click `start-backend.bat`

**Frontend (Terminal 2):**
```bash
npm run dev
```

The frontend will open at http://localhost:5173 (or 5174 if 5173 is busy)
The backend API runs at http://localhost:3001

## Features

- User registration with validation
- User login with username or email
- Password hashing with bcrypt
- MongoDB database with indexes
- Simple, clean UI
- Protected dashboard route

## Database Schema

**Collection: users**
- fullName (string)
- email (string, unique, indexed)
- username (string, unique, indexed)
- password (string, hashed)
- createdAt (date)

## API Endpoints

**POST** `/api/register`
- Registers a new user

**POST** `/api/login`
- Authenticates a user

## Deployment

This app is ready for deployment on Render:

1. **Quick Deploy**: See `QUICK_DEPLOY.md` for 5-minute setup
2. **Detailed Guide**: See `DEPLOYMENT.md` for complete instructions

### Environment Variables Needed:

**Backend:**
- `MONGODB_URI`: MongoDB Atlas connection string
- `FRONTEND_URL`: Your frontend URL
- `NODE_ENV`: production

**Frontend:**
- `VITE_API_URL`: Your backend URL

The app will work with MongoDB Atlas (free tier) and can be deployed on Render's free plan.
