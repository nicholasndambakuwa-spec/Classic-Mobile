import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function Navbar({ cart, user, setUser }) {
  const navigate = useNavigate();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out!');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🛍️ ShopZim</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <span style={{color: '#aaa', fontSize: '0.9rem'}}>Hi, {user.name}!</span>
            <a href="#" onClick={handleLogout}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <button className="cart-btn" onClick={() => navigate('/cart')}>
          🛒 Cart ({totalItems})
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        toast.info(`${product.name} quantity updated!`);
        return prev.map(item =>
          item.id === product.id ? {...item, quantity: item.quantity + 1} : item
        );
      }
      toast.success(`${product.name} added to cart!`);
      return [...prev, {...product, quantity: 1}];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.error('Item removed from cart');
  };

  const clearCart = () => setCart([]);

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
      </Routes>
      <footer><p>© 2025 ShopZim — Built with ❤️</p></footer>
    </Router>
  );
}