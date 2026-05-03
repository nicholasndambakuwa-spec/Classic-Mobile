# Classic Mobile E-Commerce Website
## Complete Technical Documentation

---

# Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Database Schema](#6-database-schema)
7. [Payment System (PayNow Demo)](#7-payment-system-paynow-demo)
8. [API Endpoints](#8-api-endpoints)
9. [Data Flow Diagrams](#9-data-flow-diagrams)
10. [Code Implementation Details](#10-code-implementation-details)
11. [Setup and Configuration](#11-setup-and-configuration)

---

# 1. Project Overview

## 1.1 What is Classic Mobile?

**Classic Mobile** is a full-stack e-commerce web application for selling smartphones, gadgets, and accessories. It provides a complete online shopping experience including:

- Product catalog browsing
- Shopping cart management
- User authentication (register/login)
- Checkout and payment processing
- Order confirmation

## 1.2 Key Features

| Feature | Description |
|---------|-------------|
| Product Catalog | Display 7 different products with images, descriptions, and prices |
| Shopping Cart | Add/remove items, update quantities, view totals |
| User Authentication | Register new accounts, login/logout functionality |
| Checkout Process | Complete order placement with payment |
| Demo Payment | Simulated PayNow payment interface for testing |
| Order History | Track orders with PayNow reference numbers |

---

# 2. Technology Stack

## 2.1 Frontend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.x |
| **Vite** | Build Tool & Dev Server | 5.x |
| **React Router** | Client-side Routing | 6.x |
| **Axios** | HTTP Client for API calls | 1.x |
| **React Toastify** | Notification/Toast messages | 9.x |

## 2.2 Backend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **PHP** | Server-side scripting | 8.x |
| **MySQL** | Database | (via XAMPP) |
| **Apache** | Web server | (via XAMPP) |

## 2.3 Development Tools

| Tool | Purpose |
|------|---------|
| **XAMPP** | Local development environment (Apache + MySQL + PHP) |
| **VS Code** | Code editor |
| **Node.js** | JavaScript runtime for Vite |

---

# 3. Project Structure

## 3.1 Directory Tree

```
myshop/
├── api/                          # Backend PHP API
│   ├── config.php               # Database connection
│   ├── products.php             # Products API
│   ├── register.php             # User registration
│   ├── login.php                # User authentication
│   ├── checkout.php             # Order processing
│   └── update_order.php         # Order status updates
│
├── frontend/                     # React Frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── App.jsx              # Main app component with routing
│   │   ├── index.jsx            # Entry point
│   │   ├── index.css            # Global styles
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx         # Product catalog
│   │   │   ├── Cart.jsx         # Shopping cart
│   │   │   ├── Checkout.jsx     # Checkout page
│   │   │   ├── Login.jsx        # User login
│   │   │   ├── Register.jsx     # User registration
│   │   │   ├── Success.jsx      # Order confirmation
│   │   │   └── DemoPay.jsx      # Demo payment interface
│   │   └── utils/
│   │       └── fallbackImages.js # Image URL helper
│   ├── package.json             # Node dependencies
│   ├── vite.config.js           # Vite configuration
│   └── index.html               # HTML template
│
└── README.md                     # Project readme
```

## 3.2 File Descriptions

### Frontend Files

| File | Purpose |
|------|---------|
| `App.jsx` | Main component that sets up routing, navbar, and global state |
| `index.jsx` | React entry point that renders App |
| `Home.jsx` | Displays product catalog with "Add to Cart" buttons |
| `Cart.jsx` | Shows cart items, quantities, and total |
| `Checkout.jsx` | Processes order and initiates payment |
| `Login.jsx` | User login form |
| `Register.jsx` | User registration form |
| `Success.jsx` | Order confirmation page |
| `DemoPay.jsx` | Simulated PayNow payment interface |
| `fallbackImages.js` | Utility for getting product images |

### Backend Files

| File | Purpose |
|------|---------|
| `config.php` | Database connection using PDO |
| `products.php` | Returns product list as JSON |
| `register.php` | Creates new user in database |
| `login.php` | Authenticates user and returns session |
| `checkout.php` | Creates order and handles payment initiation |
| `update_order.php` | Updates order status after payment |

---

# 4. Frontend Architecture

## 4.1 React Application Structure

The frontend is built as a **Single Page Application (SPA)** using React. Here's how it works:

```
┌─────────────────────────────────────────────────────────────┐
│                        App.jsx                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 Router (React Router)               │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │   │
│  │  │   /     │ │ /login  │ │ /cart   │ │/checkout│  │   │
│  │  │  Home   │ │ Login   │ │  Cart   │ │Checkout │  │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Global State:                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ cart (array) │  │ user (object)│  │ toast (notify)│  │
│  │              │  │              │  │              │  │
│  │ [{id, name, │  │ {id, name,   │  │ success/error│  │
│  │  price, qty}]│  │  email, etc }│  │  warnings    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 4.2 App.jsx - Main Component

**File:** `frontend/src/App.jsx`

```jsx
// Key imports
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

// Page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import DemoPay from './pages/DemoPay';

export default function App() {
  // Global state management
  const [cart, setCart] = useState([]);           // Shopping cart items
  const [user, setUser] = useState(() => {        // Logged in user
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Cart functions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Increment quantity if item exists
        return prev.map(item =>
          item.id === product.id ? {...item, quantity: item.quantity + 1} : item
        );
      }
      // Add new item
      return [...prev, {...product, quantity: 1}];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // User authentication
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <Router>
      <Navbar cart={cart} user={user} setUser={setUser} />
      <ToastContainer position="top-right" autoClose={2500} />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/login" element={<Login loginUser={loginUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} user={user} />} />
        <Route path="/checkout" element={<Checkout cart={cart} user={user} clearCart={clearCart} />} />
        <Route path="/success" element={<Success />} />
        <Route path="/demo-pay" element={<DemoPay />} />
      </Routes>
      <footer><p>© 2026 Classic Mobile — Built with ❤️</p></footer>
    </Router>
  );
}
```

### Key Concepts:

1. **State Management**: Uses React's `useState` hook for cart and user data
2. **Persistence**: User data is stored in `localStorage` to persist across page refreshes
3. **Routing**: React Router handles navigation between pages
4. **Props**: Cart and user data passed down to child components

## 4.3 Home.jsx - Product Catalog

**File:** `frontend/src/pages/Home.jsx`

```jsx
import { Link } from 'react-router-dom';
import { getProductImageUrl } from '../utils/fallbackImages';
import { defaultProducts } from './defaultProducts';

export default function Home({ addToCart }) {
  // Map products to include dynamic image URLs
  const products = defaultProducts.map((product, index) => ({
    ...product,
    image_url: getProductImageUrl(product, index),
  }));

  return (
    <div>
      <div className="hero">
        <h1>Welcome to Classic Mobile</h1>
        <p>Shop the latest gadgets, smartphones, and accessories with fast delivery.</p>
        <Link to="/register" className="hero-btn">Browse Gadgets →</Link>
      </div>

      <div className="products-section">
        <h2>Our Products</h2>
        <div className="products-grid">
          {products.map((product, index) => {
            const imageUrl = getProductImageUrl(product, index);
            return (
              <div className="product-card" key={product.id}>
                <img src={imageUrl} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <p className="price">${parseFloat(product.price).toFixed(2)}</p>
                  <button className="add-to-cart" onClick={() => addToCart(product)}>
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

### Products Available:

| ID | Product Name | Description | Price |
|----|--------------|-------------|-------|
| 1 | Classic Pro Smartphone | Flagship handset with premium camera, 5G speed, and long-lasting battery. | $799.99 |
| 2 | Urban Smartwatch | Fitness tracking, notifications, and sleek design for modern life. | $199.99 |
| 3 | Noise-Canceling Earbuds | Immersive sound with active noise cancellation and wireless charging. | $129.99 |
| 4 | Foldable Tablet | Versatile tablet experience with a large screen and compact foldable design. | $649.99 |
| 5 | Portable Power Bank | Fast charging power bank for your phone, earbuds, and wearable devices. | $49.99 |
| 6 | Wireless Charging Stand | Qi-certified charging stand for fast, cable-free power on your desk or nightstand. | $59.99 |
| 7 | Bluetooth Speaker | Portable speaker with deep bass, water resistance, and long battery life. | $89.99 |

## 4.4 Cart.jsx - Shopping Cart

**File:** `frontend/src/pages/Cart.jsx`

```jsx
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductImageUrl } from '../utils/fallbackImages';

export default function Cart({ cart, removeFromCart, user }) {
  const navigate = useNavigate();
  
  // Calculate total price
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Check if user is logged in before checkout
  const goCheckout = () => {
    if (!user) {
      toast.warning('Please login to checkout!');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h3>Your cart is empty 🛒</h3>
          <p>Add some products first!</p>
          <Link to="/">← Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.map((item, index) => {
        const imageUrl = getProductImageUrl(item, index);
        return (
          <div className="cart-item" key={item.id}>
            <img src={imageUrl} alt={item.name} />
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p className="item-price">${item.price} × {item.quantity}</p>
              <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
          </div>
        );
      })}
      <div className="cart-total">
        <span>Total: ${total.toFixed(2)}</span>
        <button className="checkout-btn" onClick={goCheckout}>Checkout →</button>
      </div>
    </div>
  );
}
```

---

# 5. Backend Architecture

## 5.1 PHP API Structure

The backend consists of PHP files that handle API requests from the frontend. Each file handles a specific functionality.

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│                      axios.post()                           │
│                      axios.get()                            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (PHP API)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ products    │  │ register    │  │ login       │        │
│  │    .php     │  │    .php     │  │    .php     │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │
│         └────────────────┼────────────────┘                │
│                          │                                   │
│                    config.php                                │
│                          │                                   │
│                    MySQL Database                            │
└─────────────────────────────────────────────────────────────┘
```

## 5.2 config.php - Database Connection

**File:** `api/config.php`

```php
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$host = "localhost";
$db   = "shopdb";
$user = "root";
$pass = "";  // XAMPP default has no password

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}
?>
```

### Key Points:

1. **CORS Headers**: Allow cross-origin requests from the frontend
2. **PDO**: Use PHP Data Objects for secure database operations
3. **Error Handling**: Catch and return database errors as JSON

## 5.3 checkout.php - Order Processing

**File:** `api/checkout.php`

```php
<?php
require 'config.php';

// Get JSON data from request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (empty($data['user_id']) || empty($data['items']) || empty($data['total'])) {
    echo json_encode(["error" => "Missing order data"]);
    exit();
}

try {
    // Generate unique PayNow reference
    $paynow_ref = "PAY-" . strtoupper(uniqid());

    // Insert order into database
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total, status, paynow_ref) VALUES (?, ?, 'pending', ?)");
    $stmt->execute([$data['user_id'], $data['total'], $paynow_ref]);
    $order_id = $pdo->lastInsertId();

    // Insert order items
    foreach ($data['items'] as $item) {
        $stmt2 = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
        $stmt2->execute([$order_id, $item['id'], $item['quantity'], $item['price']]);
    }

    // Check if PayNow is configured with real credentials
    $paynow_configured = false; // Set to true for live PayNow
    
    if ($paynow_configured) {
        // Real PayNow integration
        $paynow_integration_id = "YOUR_REAL_INTEGRATION_ID";
        $paynow_integration_key = "YOUR_REAL_INTEGRATION_KEY";
        $hashString = $paynow_integration_id . $data['total'] . $paynow_ref . $paynow_integration_key;
        $hash = hash('sha512', $hashString);
        
        echo json_encode([
            "success" => true,
            "order_id" => $order_id,
            "paynow_ref" => $paynow_ref,
            "paynow_guid" => $paynow_integration_id,
            "hash" => $hash,
            "message" => "Order placed! Redirecting to PayNow..."
        ]);
    } else {
        // Demo mode - no real PayNow redirect
        echo json_encode([
            "success" => true,
            "order_id" => $order_id,
            "paynow_ref" => $paynow_ref,
            "demo_mode" => true,
            "message" => "Order placed! Opening payment..."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Order failed: " . $e->getMessage()]);
}
?>
```

---

# 6. Database Schema

## 6.1 Database: shopdb

The application uses a MySQL database named `shopdb` with the following tables:

### Users Table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Sample Data:**
| id | name | email | password (hashed) | created_at |
|----|------|-------|-------------------|------------|
| 1 | John Doe | john@example.com | $2y$10$... | 2026-04-30 10:00:00 |

### Orders Table

```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    paynow_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Sample Data:**
| id | user_id | total | status | paynow_ref | created_at |
|----|---------|-------|--------|------------|------------|
| 123 | 1 | 149.99 | pending | PAY-ABC123 | 2026-04-30 12:00:00 |

### Order Items Table

```sql
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

**Sample Data:**
| id | order_id | product_id | quantity | price |
|----|----------|------------|----------|-------|
| 1 | 123 | 5 | 1 | 49.99 |
| 2 | 123 | 6 | 1 | 59.99 |
| 3 | 123 | 7 | 1 | 89.99 |

---

# 7. Payment System (PayNow Demo)

## 7.1 Overview

The payment system has two modes:
1. **Demo Mode** (current) - Simulated payment interface
2. **Live PayNow** (requires configuration) - Real PayNow integration

## 7.2 Why Demo Mode?

PayNow is a Zimbabwean mobile payment service that requires:
- A registered merchant account
- Integration ID
- Integration Key

Since these credentials are not publicly available, the demo mode simulates the entire payment flow for testing purposes.

## 7.3 DemoPay.jsx - Payment Interface

**File:** `frontend/src/pages/DemoPay.jsx`

```jsx
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function DemoPay() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Get payment details from URL parameters
  const ref = searchParams.get('ref') || 'N/A';
  const amount = searchParams.get('amount') || '0.00';
  const orderId = searchParams.get('order') || 'N/A';

  // Handle payment method selection
  const handlePayment = async (method) => {
    setStep(3); // Show processing

    // Simulate payment processing (2 seconds)
    setTimeout(async () => {
      try {
        await fetch('https://classicmobile.infinityfreeapp.com/update_order.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: orderId,
            status: 'completed',
            payment_method: method,
            paynow_ref: ref
          })
        });
      } catch (e) {
        // Ignore API errors in demo mode
      }

      setStep(4); // Show success
      toast.success('Payment successful!');
    }, 2000);
  };

  // ... rest of component
}
```

## 7.4 Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CHECKOUT PROCESS                            │
└─────────────────────────────────────────────────────────────────┘

User clicks "Pay Now"
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  Checkout.jsx sends order to API                                │
│  POST /api/checkout.php                                         │
│  { user_id, total, items }                                      │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  checkout.php creates order in database                         │
│  Returns: { success: true, order_id: 123, paynow_ref: PAY-xxx,  │
│            demo_mode: true }                                    │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  Frontend checks demo_mode                                       │
│  Redirects to: /demo-pay?ref=PAY-xxx&amount=149.99&order=123     │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  DemoPay.jsx displays payment interface                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              PayNow Demo                                 │   │
│  │  Payment Details:                                        │   │
│  │  Reference: PAY-ABC123                                   │   │
│  │  Order ID: #123                                          │   │
│  │  Total: $149.99                                          │   │
│  │                                                          │   │
│  │  Select Payment Method:                                  │   │
│  │  [📱 EcoCash]                                            │   │
│  │  [💳 Visa/Mastercard]                                    │   │
│  │  [🏦 Bank Transfer]                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  User selects payment method                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Processing...                               │   │
│  │         (2 second simulated delay)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  Payment successful!                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           ✅ Payment Successful!                         │   │
│  │  Reference: PAY-ABC123                                   │   │
│  │  Amount: $149.99                                        │   │
│  │  [Continue to Order Confirmation]                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  Redirect to /success?order=123                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 7.5 Real PayNow Integration (Future)

To enable real PayNow payments:

### Step 1: Register for PayNow
Visit https://www.paynow.co.zw and register as a merchant

### Step 2: Get Credentials
Obtain from PayNow dashboard:
- Integration ID
- Integration Key

### Step 3: Update checkout.php

```php
$paynow_configured = true;
$paynow_integration_id = "YOUR_REAL_INTEGRATION_ID";
$paynow_integration_key = "YOUR_REAL_INTEGRATION_KEY";
```

### Step 4: PayNow URL Format

```
https://www.paynow.co.zw/Interface/CheckOut?
  guid=YOUR_INTEGRATION_ID
  &resourcenumber=ORDER123
  &amount=149.99
  &resulturl=https://classicmobile.infinityfreeapp.com/update_order.php
  &returnurl=http://localhost:5173/success
  &status=Message
```

---

# 8. API Endpoints

## 8.1 Products API

**Endpoint:** `/api/products.php`
**Method:** GET

**Response:**
```json
[
  {
    "id": 1,
    "name": "Classic Pro Smartphone",
    "description": "Flagship handset with premium camera...",
    "price": "799.99",
    "image_url": "https://..."
  }
]
```

## 8.2 Register API

**Endpoint:** `/api/register.php`
**Method:** POST
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}
```

## 8.3 Login API

**Endpoint:** `/api/login.php`
**Method:** POST
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}
```

## 8.4 Checkout API

**Endpoint:** `/api/checkout.php`
**Method:** POST
**Body:**
```json
{
  "user_id": 1,
  "total": "149.99",
  "items": [
    { "id": 5, "quantity": 1, "price": 49.99 },
    { "id": 6, "quantity": 1, "price": 59.99 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "order_id": 123,
  "paynow_ref": "PAY-ABC123",
  "demo_mode": true,
  "message": "Order placed! Opening payment..."
}
```

---

# 9. Data Flow Diagrams

## 9.1 Complete Shopping Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                         USER VISITS WEBSITE                            │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              HOME PAGE                                 │
│  • Displays 7 products in a grid                                      │
│  • Each product has image, name, description, price                   │
│  • "Add to Cart" button on each product                               │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│   User clicks "Add to Cart"     │    │   Product added to cart state   │
│                                 │    │   (React useState)              │
│   toast.success() shows        │    │                                 │
│   "Product added to cart!"     │    │   cart = [                      │
│                                 │    │     {id: 1, name: "Phone",      │
└─────────────────────────────────┘    │      price: 799.99, qty: 1}     │
                                       │   ]                              │
                                       └─────────────────────────────────┘
                                                    │
                                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                            CART PAGE                                  │
│  • Shows all items in cart                                            │
│  • Displays quantities and subtotals                                 │
│  • Shows grand total                                                  │
│  • "Checkout" button to proceed                                       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         CHECKOUT PAGE                                  │
│  • Shows order summary                                                │
│  • "Pay Now" button to place order                                    │
│  • Validates user is logged in                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     API: POST /checkout.php                            │
│  • Receives: { user_id, total, items }                               │
│  • Creates order in MySQL database                                    │
│  • Generates unique paynow_ref (e.g., PAY-ABC123)                    │
│  • Returns: { success, order_id, paynow_ref, demo_mode }             │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         DEMO PAY PAGE                                  │
│  • URL: /demo-pay?ref=PAY-xxx&amount=149.99&order=123                │
│  • Displays payment details                                           │
│  • Offers payment method options                                      │
│  • Simulates payment processing                                       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         SUCCESS PAGE                                   │
│  • Order confirmation message                                         │
│  • Order ID and PayNow reference                                      │
│  • "Continue Shopping" button                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## 9.2 User Authentication Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                         REGISTER PAGE                                  │
│  • User fills: name, email, password                                   │
│  • Clicks "Create Account"                                           │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    API: POST /register.php                             │
│  • Validates input                                                    │
│  • Hashes password (password_hash)                                   │
│  • Inserts into users table                                          │
│  • Returns: { success, user }                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         LOGIN PAGE                                     │
│  • User enters email and password                                     │
│  • Clicks "Login"                                                     │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      API: POST /login.php                              │
│  • Finds user by email                                                │
│  • Verifies password (password_verify)                               │
│  • Returns: { success, user }                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         APP STATE                                      │
│  • user state updated with user data                                  │
│  • user data saved to localStorage                                    │
│  • Navbar shows "Hi, [Name]!" and Logout button                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

# 10. Code Implementation Details

## 10.1 State Management in App.jsx

The entire application uses React's built-in state management:

```jsx
// Cart state - array of items
const [cart, setCart] = useState([]);

// User state - logged in user object or null
const [user, setUser] = useState(() => {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
});
```

### Adding to Cart:

```jsx
const addToCart = (product) => {
  setCart(prev => {
    const existing = prev.find(item => item.id === product.id);
    if (existing) {
      // Item exists - increment quantity
      return prev.map(item =>
        item.id === product.id 
          ? {...item, quantity: item.quantity + 1} 
          : item
      );
    }
    // New item - add with quantity 1
    return [...prev, {...product, quantity: 1}];
  });
};
```

### Removing from Cart:

```jsx
const removeFromCart = (id) => {
  setCart(prev => prev.filter(item => item.id !== id));
};
```

## 10.2 API Communication

The frontend uses **Axios** to communicate with the PHP backend:

```jsx
import axios from 'axios';

// Making a POST request
const res = await axios.post('https://classicmobile.infinityfreeapp.com/checkout.php', orderData);

// Accessing response
if (res.data.success) {
  const orderId = res.data.order_id;
  const paynowRef = res.data.paynow_ref;
}
```

## 10.3 Routing

React Router handles client-side navigation:

```jsx
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        {/* more routes... */}
      </Routes>
    </Router>
  );
}
```

### Programmatic Navigation:

```jsx
const navigate = useNavigate();

// Navigate to a specific page
navigate('/checkout');

// Navigate with parameters
navigate('/demo-pay?ref=PAY-123&amount=99.99');
```

---

# 11. Setup and Configuration

## 11.1 Prerequisites

| Software | Purpose | Download |
|----------|---------|----------|
| Node.js | JavaScript runtime | nodejs.org |
| XAMPP | Apache + MySQL + PHP | apachefriends.org |
| VS Code | Code editor | code.visualstudio.com |

## 11.2 Installation Steps

### Step 1: Start XAMPP
```
1. Open XAMPP Control Panel
2. Start Apache module
3. Start MySQL module
```

### Step 2: Create Database
```
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create database named "shopdb"
3. Create tables: users, orders, order_items
```

### Step 3: Install Frontend Dependencies
```bash
cd c:\xampp\htdocs\myshop\frontend
npm install
```

### Step 4: Start Development Server
```bash
cd c:\xampp\htdocs\myshop\frontend
npm run dev
```

### Step 5: Access the Application
```
Open browser to: http://localhost:5173
```

## 11.3 Environment Variables

No environment variables are required for this project. All configuration is handled in:

- `api/config.php` - Database connection
- `vite.config.js` - Vite configuration

---

# 12. Summary

## 12.1 What We Built

This is a complete **full-stack e-commerce application** with:

✅ **Frontend (React + Vite)**
- Product catalog with 7 products
- Shopping cart with add/remove functionality
- User authentication (register/login)
- Checkout process
- Demo payment interface
- Order confirmation

✅ **Backend (PHP + MySQL)**
- RESTful API endpoints
- Database integration
- User management
- Order processing
- Payment handling (demo mode)

✅ **Payment System**
- Demo payment page simulating PayNow
- Multiple payment method options
- Order status tracking

## 12.2 How Everything Connects

```
User Action → React Component → Axios API Call → PHP Backend → MySQL
                ↓
         State Update
                ↓
         UI Re-render
```

## 12.3 Key Takeaways

1. **React** handles the UI and state management
2. **React Router** handles client-side navigation
3. **Axios** communicates with the PHP backend
4. **PHP** processes API requests and database operations
5. **MySQL** stores users, orders, and order items
6. **DemoPay** simulates the PayNow payment experience

---

*Document generated on April 30, 2026*
*Classic Mobile E-Commerce Website*