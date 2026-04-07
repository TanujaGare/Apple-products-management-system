# Deployment Guide: Apple Product Management System

This guide explains how to deploy the application to **Render** (Backend) and **Vercel** (Frontend).

## Prerequisites
- A GitHub account with the code pushed to a repository.
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.
- A [Render](https://render.com/) account.
- A [Vercel](https://vercel.com/) account.

---

## 1. Database Setup (MongoDB Atlas)
1. **Sign Up/Log In**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. **Create a Cluster**: Click **"Create"** to deploy a new cluster (Shared/Free tier is recommended).
3. **Set Up Security**:
   - Go to **Database Access** (left sidebar): Click **"Add New Database User"**. Choose "Password" as the authentication method and note down the password.
   - Go to **Network Access** (left sidebar): Click **"Add IP Address"** and select **"Allow Access from Anywhere"** (this adds `0.0.0.0/0`).
4. **Get Connection String**:
   - Go to **Database** (left sidebar) to see your clusters.
   - Click the **"Connect"** button on your cluster.
   - Select **"Drivers"** (or "Connect your application").
   - Under **"Add your connection string into your application code"**, you will see a URI like:
     `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
   - **Copy this string.** You will need to replace `<password>` with the password you created in step 3.

---

## 2. Backend Deployment (Render)
1. Log in to Render and click **New** > **Web Service**.
2. Connect your GitHub repository.
3. Select the repository and set the following:
   - **Name**: `apple-products-management-system` (or your choice).
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Go to **Environment** and add these variables:
   - `MONGODB_URI`: Your MongoDB Atlas URI.
   - `JWT_SECRET`: A random long string.
   - `PORT`: `5000`
   - `FRONTEND_URL`: Your Vercel URL (Add this *after* deploying the frontend).
5. Click **Create Web Service**.

---

## 3. Frontend Deployment (Vercel)
1. Log in to Vercel and click **Add New** > **Project**.
2. Import your GitHub repository.
3. Set the following:
   - **Framework Preset**: `Other`
   - **Root Directory**: `frontend`
   - **Build Command**: (Leave empty)
   - **Output Directory**: `.`
4. Click **Deploy**.
5. Once deployed, copy your Vercel URL (e.g., `https://apple-prod.vercel.app`) and add it to the `FRONTEND_URL` in your **Render** environment variables.

---

## 4. Final Verification
1. Ensure your Render backend is running.
2. Ensure your Vercel frontend is running.
3. If you get CORS errors, double-check that `FRONTEND_URL` in Render matches your Vercel URL exactly (no trailing slash).
