# Deploying Classic Mobile to Render

## Complete Step-by-Step Guide

---

## Prerequisites

Before starting, ensure you have:
- A [Render.com](https://render.com) account (free)
- GitHub account (required for Render)
- Your project files

---

## Overview of Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                        │
│                    Vercel (Free)                           │
│         https://classic-mobile.vercel.app                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼ (API calls)
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (PHP)                           │
│                    Render (Free)                           │
│         https://classic-mobile.onrender.com                │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                        │
│                    TiDB (Free)                             │
│         https://tidb.cloud                                 │
└─────────────────────────────────────────────────────────────┘
```

We'll use:
- **Vercel** for React frontend (free, unlimited)
- **Render** for PHP backend (free, 750 hours/month)
- **TiDB Cloud** for free MySQL database

---

## Step 1: Set Up Free MySQL Database (TiDB)

### 1.1 Create TiDB Account

1. Go to [tidb.cloud](https://tidb.cloud)
2. Click **"Start Free"** 
3. Sign up with GitHub or Email

### 1.2 Create Free Cluster

1. After login, click **"New Cluster"**
2. Select:
   - **Cluster Type**: Serverless (Free)
   - **Cloud Provider**: AWS or Google Cloud
   - **Region**: (choose closest to you)
3. Click **"Create"**

### 1.3 Get Connection Details

1. Once created, click **"Connect"**
2. Copy the connection string:
```
mysql -h gateway01.us-east-1.prod.cloud.tidb.com -P 4000 -u your-username -p your-password
```

3. Note these details:
```
Host: gateway01.us-east-1.prod.cloud.tidb.com
Port: 4000
User: your-username
Password: your-password
Database: shopdb
```

---

## Step 2: Prepare Your Project

### 2.1 Create Project Structure for Render

Render needs a specific structure. Create a new folder:

```
myshop-deploy/
├── public/                  # Static files (React build)
│   ├── index.html
│   └── assets/
├── api/                     # PHP backend
│   ├── config.php
│   ├── checkout.php
│   ├── login.php
│   ├── products.php
│   ├── register.php
│   └── update_order.php
├── public/                  # Render public folder
│   └── (empty, for static)
├── .php.ini                 # PHP configuration
├── composer.json            # PHP dependencies
└── render.yaml              # Render configuration
```

### 2.2 Create render.yaml

**File:** `myshop-deploy/render.yaml`

```yaml
services:
  - type: web
    name: classic-mobile-api
    env: php
    buildCommand: ""
    startCommand: "php -S 0.0.0.0:$PORT -t ."
    envVars:
      - key: PHP_VERSION
        value: "8.2"
```

### 2.3 Create .php.ini

**File:** `myshop-deploy/.php.ini`

```ini
; PHP Configuration
memory_limit = 128M
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 300
```

### 2.4 Create composer.json

**File:** `myshop-deploy/composer.json`

```json
{
    "require": {
        "ext-pdo": "*"
    }
}
```

---

## Step 3: Update API for Production

### 3.1 Update config.php

**File:** `myshop-deploy/api/config.php`

```php
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// TiDB Cloud connection details
$host = "gateway01.us-east-1.prod.cloud.tidb.com";
$port = "4000";
$db   = "shopdb";
$user = "your-tidb-username";
$pass = "your-tidb-password";

try {
    // TiDB uses MySQL protocol
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}
?>
```

### 3.2 Update Frontend API Calls

Update all API calls to use relative URLs:

**Files to update:**
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/Checkout.jsx`

Change:
```javascript
axios.post('https://classicmobile.infinityfreeapp.com/checkout.php', data)
```

To:
```javascript
axios.post('/api/checkout.php', data)
```

---

## Step 4: Build React Frontend

```bash
cd c:\xampp\htdocs\myshop\frontend
npm run build
```

This creates the `dist` folder with production files.

---

## Step 5: Deploy Backend to Render

### 5.1 Push to GitHub

1. Create a new GitHub repository: `classic-mobile-backend`
2. Copy the deploy files to a new folder
3. Push to GitHub:

```bash
cd myshop-deploy
git init
git add .
git commit -m "Initial commit for Render deployment"
git branch -M main
git remote add origin https://github.com/your-username/classic-mobile-backend.git
git push -u origin main
```

### 5.2 Connect to Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select the repository: `classic-mobile-backend`

### 5.3 Configure Web Service

| Setting | Value |
|---------|-------|
| Name | classic-mobile-api |
| Environment | PHP |
| Build Command | (leave empty) |
| Start Command | `php -S 0.0.0.0:$PORT -t .` |

### 5.4 Add Environment Variables

In Render dashboard, go to **"Environment"** tab and add:

```
PHP_VERSION = 8.2
```

### 5.5 Deploy

Click **"Create Web Service"**

Wait for deployment to complete. You'll get a URL like:
```
https://classic-mobile-api.onrender.com
```

---

## Step 6: Deploy Frontend to Vercel

### 6.1 Prepare Frontend

Update `vite.config.js` to set the API base URL:

**File:** `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://classic-mobile-api.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
```

### 6.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (frontend)
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **"Deploy"**

### 6.3 Set Environment Variables in Vercel

In Vercel project settings, add:

```
VITE_API_URL = https://classic-mobile-api.onrender.com
```

---

## Step 7: Create Database Tables

### 7.1 Connect to TiDB

1. In TiDB Cloud console, click **"Connect"**
2. Use the SQL editor or MySQL client

### 7.2 Run SQL Commands

```sql
-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    paynow_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);
```

---

## Step 8: Test Your Website

### 8.1 Find Your URLs

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://classic-mobile-api.onrender.com`

### 8.2 Test These Endpoints

| Test | URL |
|------|-----|
| Products API | `https://your-api.onrender.com/api/products.php` |
| Home Page | `https://your-vercel.app/` |
| Login | `https://your-vercel.app/login` |
| Register | `https://your-vercel.app/register` |

---

## Troubleshooting

### Issue 1: API Returns 404

**Solution:** Check that your PHP files are in the `api/` folder and the route is correct.

### Issue 2: Database Connection Failed

**Solution:** 
1. Verify TiDB credentials in `config.php`
2. Check that the database exists in TiDB

### Issue 3: CORS Errors

**Solution:** Ensure CORS headers are set in `config.php`

### Issue 4: Frontend Can't Reach API

**Solution:** 
1. Check Vercel environment variables
2. Verify API URL is correct in proxy settings

---

## Summary Checklist

- [ ] Create TiDB Cloud account
- [ ] Create Serverless MySQL cluster
- [ ] Get TiDB connection details
- [ ] Create deploy folder structure
- [ ] Update config.php with TiDB credentials
- [ ] Update frontend API calls to use relative URLs
- [ ] Build React frontend
- [ ] Push backend to GitHub
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Create database tables in TiDB
- [ ] Test the website

---

## Cost Summary

| Service | Free Tier | Cost |
|---------|-----------|------|
| **TiDB Cloud** | Serverless cluster | FREE |
| **Render** | 750 hours/month | FREE |
| **Vercel** | Unlimited | FREE |
| **GitHub** | Unlimited repos | FREE |

**Total: $0/month**

---

## Important Notes

### Limitations

| Service | Limitation |
|---------|------------|
| **Render** | Sleeps after 15 min of inactivity |
| **TiDB** | 5000 requests/day on free tier |
| **Vercel** | None for this use case |

### Performance

First request after sleep may take 10-15 seconds to wake up.

---

## Need Help?

If you encounter issues:
1. Check Render logs in dashboard
2. Verify TiDB cluster is running
3. Test API endpoints individually

---

*Guide created for Classic Mobile E-Commerce Website*
*Last updated: April 30, 2026*