# Quick Deployment Guide

## 🚀 Deploy to Render in 5 Minutes

### Prerequisites
1. Create a [MongoDB Atlas](https://cloud.mongodb.com) free account
2. Create a [Render](https://render.com) account
3. Push your code to GitHub

### Step 1: MongoDB Atlas Setup
1. Create a cluster (free tier)
2. Create a database user
3. Copy your connection string
4. Whitelist all IPs (0.0.0.0/0) or add Render's IPs

### Step 2: Deploy Backend
1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repo
3. Configuration:
   - **Name**: `login-app-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Environment Variables:
   - `MONGODB_URI`: Your Atlas connection string
   - `NODE_ENV`: `production`

### Step 3: Deploy Frontend
1. Render Dashboard → New → Static Site
2. Connect same GitHub repo
3. Configuration:
   - **Name**: `login-app-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Environment Variables:
   - `VITE_API_URL`: Your backend URL (from step 2)

### Step 4: Update CORS
1. Go back to your backend service on Render
2. Add environment variable:
   - `FRONTEND_URL`: Your frontend URL (from step 3)

### 🎉 Done!
Your app is now live at your frontend URL!

## Render URLs Format
- Backend: `https://login-app-backend.onrender.com`
- Frontend: `https://login-app-frontend.onrender.com`

## Need Help?
- Check the build logs in Render dashboard
- Ensure all environment variables are set correctly
- MongoDB Atlas IP whitelist should include 0.0.0.0/0