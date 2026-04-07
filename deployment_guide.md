# Step-by-Step Deployment Guide

Follow these steps to make your Apple Product Management System live on the internet! 🚀

---

## Part 1: Initial GitHub Push (Windows/Desktop)

Since you are using **GitHub Desktop**:
1. Open **GitHub Desktop** and add your local folder: `c:\Users\Tanuja\Desktop\APPLEPROD\Apple-products-management-system`.
2. Give your commit a message (e.g., "Final version for deployment").
3. Click **Commit to main**.
4. Click **Publish repository** to upload it to your GitHub account as a new repository.

---

## Part 2: Cloud Database Setup (MongoDB Atlas)

**You don't need to "download" Atlas — it's a cloud service!** 
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas/cloud).
2. Create a **Free Cluster** (usually named Cluster0).
3. **Database Access**: Create a User (Username: `admin`, Password: `password123` — keep this safe!).
4. **Network Access**: Click "Add IP Address" and select **"Allow Access from Anywhere"** (0.0.0.0/0). This is crucial for Render to connect.
5. **Connection String**: Click "Connect" -> "Drivers" -> Choose "Node.js". Copy the connection string. It looks like this:
   `mongodb+srv://admin:password123@cluster0.abcde.mongodb.net/apple_prod_db?retryWrites=true&w=majority`

---

## Part 3: Backend Deployment (Render)

1. Go to [render.com](https://dashboard.render.com).
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **Environment Variables** (Advanced) and add:
   - `MONGODB_URI`: (Your Atlas connection string from Part 2)
   - `JWT_SECRET`: `apple_prod_secret`
   - `PORT`: `5000`
6. Click **Create Web Service** and wait for it to deploy. You will get a URL like `https://your-app.onrender.com`. **Copy this URL.**

---

## Part 4: Final Code Tweak (Connect Frontend to Backend)

Now, we need to tell your frontend where the live backend is. 
Open `frontend/js/api.js` and update the Production URL:

```javascript
// Change this line to your actual Render URL
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000/api' 
    : 'https://your-custom-name.onrender.com/api'; // Replace with your Render URL
```

**Save and sync this change to GitHub Desktop!**

---

## Part 5: Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com/dashboard).
2. Create **New Project** and import your GitHub repo.
3. **CRITICAL SETTING**:
   - In the "Project Settings", set the **Root Directory** to `frontend`.
4. Click **Deploy**.

**Congratulations! Your website is now live!** 🎉
