# 🌐 How to Put Your Shop on the Internet!
## A Simple Guide for Beginners

---

# 📚 What Are We Doing Today?

Imagine you made a really cool toy shop! 
But right now, only YOU can see it on your computer.

Today, we will put your shop on the internet so EVERYONE can see it! 🎉

---

# 🏠 Think About It Like This...

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Your Computer = Your Room                                │
│   Internet = Big Playground                                │
│   Hosting = Letting people come to your room               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**It's like:**
- You drew a picture 📸
- You want to show it to everyone at school
- So you put it on the class bulletin board 📋

That's what hosting does! 

---

# 🛠️ What Do We Need?

```
┌─────────────────────────────────────────────────────────────┐
│                    THE THREE THINGS                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1️⃣  Frontend = The pretty pictures (your shop)         │
│        → We use: VERCEL (free!)                            │
│                                                             │
│   2️⃣  Backend = The helper that does work                 │
│        → We use: RENDER (free!)                            │
│                                                             │
│   3️⃣  Database = The big notebook that saves info         │
│        → We use: TiDB (free!)                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 🚀 Let's Do It Together!

## Step 1: Get Your Free Database 📓

**What is this?** 
A special notebook that remembers all your customers and orders!

**How to get it:**

1. Go to this website: **https://tidb.cloud** 🌐
2. Click **"Start Free"** button 🟢
3. Sign up with your email 📧
4. Click **"New Cluster"** ➕
5. Pick **"Serverless"** (it's free!) ⭐
6. Click **"Create"** ✅

**Now write down these things:**
- Host: _______________
- Port: _______________
- Username: _______________
- Password: _______________
- Database name: **shopdb**

---

## Step 2: Get Your Free Backend Home 🏠

**What is this?** 
A helper that talks to your notebook!

**How to get it:**

1. Go to: **https://render.com** 🌐
2. Click **"Get Started"** 🟢
3. Sign up with GitHub (or email) 📧
4. Click **"New +"** ➕
5. Click **"Web Service"** 🌐
6. Connect your GitHub account 📱

**Now let's put your helper there:**

1. Create a new folder on your computer called **"my-shop-backend"** 📁
2. Copy these files into that folder:
   - All files from `myshop/api/` folder
3. Go to **https://github.com** 🐙
4. Create a new "repository" (that's like a box)
5. Put your files in that box 📦
6. Connect that box to Render

**In Render, fill in:**
- Name: `my-shop-api`
- Environment: PHP
- Build Command: (leave empty)
- Start Command: `php -S 0.0.0.0:$PORT -t .`

**Click "Create"!** 🎉

**Write down your backend URL:**
- ____________ (like: https://my-shop.onrender.com)

---

## Step 3: Get Your Free Frontend Home 🖼️

**What is this?** 
The pretty pictures of your shop that people see!

**How to get it:**

1. Go to: **https://vercel.com** 🌐
2. Click **"Sign Up"** 🟢
3. Sign up with GitHub 🐙
4. Click **"Add New..."** ➕
5. Click **"Project"** 📁
6. Import your frontend code

**In Vercel, fill in:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

**Click "Deploy"!** 🎉

**Write down your frontend URL:**
- ____________ (like: https://my-shop.vercel.app)

---

## Step 4: Connect Everything! 🔗

Now we need to tell your frontend where to find your backend!

**In your code, change this:**
```javascript
// Old way (for your computer only)
axios.post('https://classicmobile.infinityfreeapp.com/checkout.php', data)
```

**To this:**
```javascript
// New way (for the internet!)
axios.post('https://YOUR-BACKEND-URL/api/checkout.php', data)
```

**Files to change:**
- Login.jsx
- Register.jsx  
- Checkout.jsx

Replace `https://classicmobile.infinityfreeapp.com/` with your Render URL!

---

## Step 5: Make Your Notebook! 📓

Go back to TiDB Cloud.

Click **"Connect"** or open the SQL editor.

Copy and paste this:

```sql
-- Make the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Make the orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    paynow_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Make the order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2)
);
```

Click **"Run"** or execute! ▶️

---

## Step 6: Test Your Shop! 🛒

Now open your browser and go to:

```
https://YOUR-VERCEL-URL
```

**Try these things:**

| Try this... | What should happen |
|-------------|-------------------|
| Go to the website | You see products! |
| Click "Add to Cart" | Item goes in cart! |
| Go to Cart | You see your items! |
| Click Checkout | You can pay! |
| Register | You make an account! |
| Login | You can sign in! |

---

# 🎊 YOU DID IT! 🎊

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   🌐 Your shop is now on the internet!                     │
│                                                             │
│   People can:                                               │
│   ✓ See your products                                       │
│   ✓ Add things to cart                                      │
│   ✓ Make accounts                                           │
│   ✓ Buy things                                              │
│                                                             │
│   Your shop is at:                                          │
│   https://YOUR-VERCEL-URL                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 📝 Important Things to Remember

## 💰 How much does it cost?

| Service | Cost |
|---------|------|
| Vercel | FREE |
| Render | FREE |
| TiDB | FREE |
| **Total** | **$0!** |

## 😴 Does it sleep?

- **Render**: Yes! After 15 minutes of no one visiting, it goes to sleep. 
  The first person to visit after that waits a little longer. ☀️

- **Vercel**: No! It never sleeps. 🌙

- **TiDB**: Has some free requests per day. 📊

---

# 🤔 What If Something Doesn't Work?

Don't worry! Here's what to check:

| Problem | What to do |
|---------|-------------|
| Page won't load | Check your URL is correct |
| Can't add to cart | Check the backend is running |
| Can't login | Check database is connected |
| Error message | Check the error and try Google it |

---

# 🌟 Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    WHAT WE DID                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1️⃣  Got a free database (TiDB) 📓                       │
│   2️⃣  Got a free backend home (Render) 🏠                  │
│   3️⃣  Got a free frontend home (Vercel) 🖼️                │
│   4️⃣  Connected them all together 🔗                      │
│   5️⃣  Made the database tables 📊                         │
│   6️⃣  Tested the shop! 🛒                                  │
│                                                             │
│   Now everyone can visit your shop!                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 🎓 What Did We Learn?

- **Hosting** = Putting your website where everyone can see it
- **Frontend** = The pretty part people see
- **Backend** = The helper that does work
- **Database** = A notebook that remembers things
- **Vercel** = A free place for frontend
- **Render** = A free place for backend
- **TiDB** = A free place for database

---

# 👏 Great Job!

You put your shop on the internet! 

Now tell all your friends to visit! 🎉

---

*Guide created for complete beginners!*
*Last updated: April 30, 2026*