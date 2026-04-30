# Deploying Classic Mobile to 000webhost

## Complete Step-by-Step Guide

---

## Prerequisites

Before starting, ensure you have:
- A [000webhost.com](https://000webhost.com) account (free)
- Your project files ready
- GitHub account (optional but recommended)

---

## Step 1: Prepare Your Project

### 1.1 Update API URLs for Production

Since 000webhost provides PHP and MySQL, you'll need to update your frontend to point to the hosted API instead of localhost.

**File:** `frontend/src/pages/Checkout.jsx`

Change:
```javascript
const res = await axios.post('http://localhost/myshop/api/checkout.php', orderData);
```

To (use relative URL for production):
```javascript
const res = await axios.post('/api/checkout.php', orderData);
```

Do the same for:
- `Login.jsx`
- `Register.jsx`

### 1.2 Build the React Frontend

```bash
cd c:\xampp\htdocs\myshop\frontend
npm run build
```

This creates a `dist` folder with optimized production files.

---

## Step 2: Create 000webhost Account

### 2.1 Sign Up

1. Go to [000webhost.com](https://000webhost.com)
2. Click **"Get Free Hosting"**
3. Sign up with:
   - Email address
   - Password
4. Verify your email

### 2.2 Create New Website

1. After login, click **"Create New Site"**
2. Enter your website name: `classic-mobile`
3. Select **"Upload your own website"**
4. Click **"Next"**

---

## Step 3: Upload Files

### 3.1 Understanding the Folder Structure

Your project has:
```
myshop/
├── api/              # PHP backend (goes to /public_html)
│   ├── config.php
│   ├── checkout.php
│   ├── login.php
│   ├── products.php
│   ├── register.php
│   └── update_order.php
│
└── frontend/         # React frontend
    └── dist/         # Built files (goes to /public_html)
        ├── index.html
        ├── assets/
        └── ...
```

### 3.2 Upload Process

1. In 000webhost, go to **"File Manager"**
2. Navigate to `public_html` folder
3. Create the following folder structure:

```
public_html/
├── api/                    ← Create this folder
│   ├── config.php
│   ├── checkout.php
│   ├── login.php
│   ├── products.php
│   ├── register.php
│   └── update_order.php
│
├── index.html              ← From frontend/dist
├── assets/                 ← From frontend/dist
└── (other static files)
```

### 3.3 Upload via File Manager

**Option A: Using File Manager Upload**

1. In 000webhost File Manager, click **"Upload"**
2. Select all files from `frontend/dist` folder
3. Upload to `public_html`

**Option B: Using FTP (Faster)**

1. Go to **"Settings"** → **"FTP Details"**
2. Note your credentials:
   - FTP Host: `files.000webhost.com`
   - Username: `your-username`
   - Password: `your-password`
3. Use FileZilla to connect and upload

---

## Step 4: Set Up MySQL Database

### 4.1 Create Database

1. In 000webhost dashboard, go to **"Databases"**
2. Click **"New Database"**
3. Enter details:
   - Database Name: `shopdb`
   - Database User: `shopdb_user`
   - Password: `your-password`
4. Click **"Create"**

### 4.2 Note Your Credentials

Save these details:
```
Host: localhost
Database: your_username_shopdb
User: your_username_shopdb_user
Password: your-password
```

### 4.3 Create Tables

Go to **"phpMyAdmin"** (in 000webhost Databases section)

Run this SQL to create tables:

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

## Step 5: Update Database Connection

### 5.1 Update config.php

**File:** `public_html/api/config.php`

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

// UPDATE THESE WITH YOUR 000WEBHOST DATABASE DETAILS
$host = "localhost";
$db   = "your_username_shopdb";      // Your database name
$user = "your_username_shopdb_user"; // Your database user
$pass = "your-password";             // Your database password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}
?>
```

---

## Step 6: Test Your Website

### 6.1 Find Your Website URL

1. In 000webhost dashboard, go to **"Settings"**
2. Find your **"Website URL"**
3. It will be something like: `https://your-site.000webhostapp.com`

### 6.2 Test the Following

| Page | URL | Expected |
|------|-----|----------|
| Home | `https://yoursite.000webhostapp.com/` | Product grid displayed |
| Register | `https://yoursite.000webhostapp.com/register` | Registration form |
| Login | `https://yoursite.000webhostapp.com/login` | Login form |
| Cart | `https://yoursite.000webhostapp.com/cart` | Empty cart message |

### 6.3 Test API

Check if PHP is working:
```
https://yoursite.000webhostapp.com/api/products.php
```

Should return JSON product data.

---

## Step 7: Troubleshooting Common Issues

### Issue 1: "Database connection failed"

**Solution:** Check your database credentials in `config.php`

### Issue 2: "404 Not Found" on API calls

**Solution:** Ensure API files are in `public_html/api/` folder

### Issue 3: CORS Errors

**Solution:** The CORS headers in `config.php` should handle this

### Issue 4: Images Not Loading

**Solution:** Check that `fallbackImages.js` uses HTTPS URLs for Unsplash

---

## Step 8: Custom Domain (Optional)

### 8.1 Connect Your Own Domain

1. Go to **"Settings"** → **"Domains"**
2. Enter your custom domain
3. Update your domain's DNS:
   - Create CNAME record pointing to `000webhostapp.com`

### 8.2 Get Free SSL (HTTPS)

1. Go to **"SSL"** in settings
2. Click **"Add SSL"**
3. Select your domain
4. SSL certificate will be issued for free

---

## Summary Checklist

- [ ] Create 000webhost account
- [ ] Build React frontend (`npm run build`)
- [ ] Upload frontend files to `public_html`
- [ ] Upload API files to `public_html/api`
- [ ] Create MySQL database
- [ ] Create database tables
- [ ] Update `config.php` with database credentials
- [ ] Test website
- [ ] (Optional) Add custom domain

---

## Important Notes

### Limitations of Free Hosting

| Feature | Limit |
|---------|-------|
| Storage | 1GB |
| Bandwidth | Limited |
| SSL | Basic (may show ads) |
| Support | Community only |
| Uptime | Not guaranteed |

### For Production

For a real e-commerce site, consider upgrading to:
- **000webhost Paid Plan** ($4.99/mo, no ads, better performance)
- **Railway + Vercel** (more reliable, still affordable)

---

## Need Help?

If you encounter issues, check:
1. 000webhost community forums
2. File permissions (should be 644 for files, 755 for folders)
3. PHP version (use PHP 8.0 or higher in settings)

---

*Guide created for Classic Mobile E-Commerce Website*
*Last updated: April 30, 2026*