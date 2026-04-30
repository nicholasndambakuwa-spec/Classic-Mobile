import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Cart({ cart, removeFromCart, user }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
          <Link to="/" style={{color: '#e94560', marginTop: '1rem', display: 'inline-block'}}>← Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.map(item => (
        <div className="cart-item" key={item.id}>
          <img src={item.image_url} alt={item.name} />
          <div className="cart-item-info">
            <h4>{item.name}</h4>
            <p className="item-price">${parseFloat(item.price).toFixed(2)} × {item.quantity}</p>
            <p style={{color: '#999', fontSize: '0.85rem'}}>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
        </div>
      ))}
      <div className="cart-total">
        <span style={{fontSize: '1.2rem', fontWeight: 500}}>Total: ${total.toFixed(2)}</span>
        <button className="checkout-btn" onClick={goCheckout}>Checkout →</button>
      </div>
    </div>
  );
}