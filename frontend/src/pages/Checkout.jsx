import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Checkout({ cart, user, clearCart }) {
  const [loading, setLoading] = useState(false);
  const [orderDone, setOrderDone] = useState(null);
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayNow = async () => {
    if (!user) { navigate('/login'); return; }
    if (cart.length === 0) { toast.error('Cart is empty!'); return; }

    setLoading(true);
    let paynowWindow = null;

    try {
      paynowWindow = window.open('', '_blank');

      const orderData = {
        user_id: user.id,
        total: total.toFixed(2),
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const res = await axios.post('https://classicmobile.infinityfreeapp.com/checkout.php', orderData);

      if (res.data.success) {
        setOrderDone(res.data);
        clearCart();
        toast.success('Order placed!');

        // Check if PayNow is properly configured
        const paynowGuid = res.data.paynow_guid || res.data.paynowGuid || res.data.guid;
        const paynowRef = res.data.paynow_ref || res.data.paynowRef;
        const isDemoMode = res.data.demo_mode;

        if (paynowGuid && !isDemoMode) {
          // Full PayNow integration with valid GUID
          const paynowUrl = `https://www.paynow.co.zw/Interface/CheckOut?guid=${encodeURIComponent(paynowGuid)}&resourcenumber=${encodeURIComponent(res.data.orderId || res.data.order_id)}&amount=${encodeURIComponent(total.toFixed(2))}&resulturl=https://classicmobile.infinityfreeapp.com/update_order.php&returnurl=http://localhost:5173/success&status=Message`;
          if (paynowWindow) {
            paynowWindow.location.href = paynowUrl;
          } else {
            window.location.assign(paynowUrl);
          }
        } else if (isDemoMode || paynowRef) {
          // Demo mode - show simulated payment interface
          if (paynowWindow) paynowWindow.close();
          
          // Open demo payment modal/redirect
          const demoUrl = `/demo-pay?ref=${encodeURIComponent(paynowRef)}&amount=${encodeURIComponent(total.toFixed(2))}&order=${encodeURIComponent(res.data.order_id)}`;
          navigate(demoUrl);
        } else {
          if (paynowWindow) paynowWindow.close();
          toast.info('Order placed. PayNow integration is not configured.');
        }
      } else {
        if (paynowWindow) paynowWindow.close();
        toast.error(res.data.error || 'Checkout failed. Please try again.');
      }
    } catch {
      if (paynowWindow) paynowWindow.close();
      toast.error('Checkout failed. Is XAMPP running?');
    }
    setLoading(false);
  };

  if (orderDone) {
    return (
      <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
        <div style={{fontSize: '4rem', marginBottom: '1rem'}}>✅</div>
        <h2 style={{fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '1rem'}}>
          Order Confirmed!
        </h2>
        <p style={{color: '#777', marginBottom: '0.5rem'}}>Order ID: #{orderDone.order_id || orderDone.orderId}</p>
        {(orderDone.paynow_ref || orderDone.paynowRef) && (
          <p style={{color: '#777', marginBottom: '0.5rem'}}>PayNow Reference: {orderDone.paynow_ref || orderDone.paynowRef}</p>
        )}
        <p style={{color: '#777', marginBottom: '2rem'}}>A PayNow payment window has opened if your payment setup is configured.</p>
        <button className="submit-btn" style={{maxWidth: '300px', margin: '0 auto'}} onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{maxWidth: '600px', margin: '3rem auto', padding: '0 2rem'}}>
      <h2 style={{fontFamily: 'Playfair Display, serif', marginBottom: '2rem'}}>Checkout</h2>

      <div style={{background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
        <h3 style={{marginBottom: '1rem', fontSize: '1rem', color: '#999'}}>Order Summary</h3>
        {cart.map(item => (
          <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0'}}>
            <span>{item.name} × {item.quantity}</span>
            <span style={{fontWeight: 500}}>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '1rem 0 0', fontWeight: 600, fontSize: '1.1rem'}}>
          <span>Total</span>
          <span style={{color: '#e94560'}}>${total.toFixed(2)}</span>
        </div>
      </div>

      <div style={{background: '#fff8e7', border: '2px solid #f5a623', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem'}}>
        <p style={{color: '#8a6000', fontSize: '0.9rem'}}>
          💳 You will be redirected to <strong>PayNow</strong> to complete your payment securely.
        </p>
      </div>

      <button className="submit-btn" onClick={handlePayNow} disabled={loading}>
        {loading ? 'Processing...' : `Pay $${total.toFixed(2)} with PayNow →`}
      </button>
    </div>
  );
}