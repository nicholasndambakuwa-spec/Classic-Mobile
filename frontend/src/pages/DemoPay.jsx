import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function DemoPay() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: details, 2: method, 3: processing, 4: success

  const ref = searchParams.get('ref') || 'N/A';
  const amount = searchParams.get('amount') || '0.00';
  const orderId = searchParams.get('order') || 'N/A';

  const handlePayment = async (method) => {
    setProcessing(true);
    setStep(3);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Update order status via API
        await fetch('http://localhost/myshop/api/update_order.php', {
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

      setStep(4);
      toast.success('Payment successful!');
    }, 2000);
  };

  const handleContinue = () => {
    navigate('/success?order=' + orderId);
  };

  if (step === 4) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '1rem', color: '#333' }}>
            Payment Successful!
          </h2>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>Reference: <strong>{ref}</strong></p>
          <p style={{ color: '#666', marginBottom: '2rem' }}>Amount: <strong>${amount}</strong></p>
          <button
            onClick={handleContinue}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Continue to Order Confirmation
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '400px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 1s infinite' }}>⏳</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
            Processing Payment...
          </h2>
          <p style={{ color: '#666' }}>Please wait while we process your payment</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '450px',
        margin: '0 auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* PayNow Demo Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: '#00a651',
            color: 'white',
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            marginBottom: '1rem'
          }}>
            PayNow Demo
          </div>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            This is a demo payment interface
          </p>
        </div>

        {/* Order Details */}
        <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#999', textTransform: 'uppercase' }}>Payment Details</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#666' }}>Reference</span>
            <span style={{ fontWeight: '600' }}>{ref}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#666' }}>Order ID</span>
            <span style={{ fontWeight: '600' }}>#{orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #ddd' }}>
            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>Total</span>
            <span style={{ fontWeight: '700', fontSize: '1.3rem', color: '#00a651' }}>${amount}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#999', textTransform: 'uppercase' }}>Select Payment Method</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => handlePayment('ecocash')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>📱</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', color: '#333' }}>EcoCash</div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>Pay using EcoCash mobile wallet</div>
            </div>
          </button>

          <button
            onClick={() => handlePayment('visa')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>💳</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', color: '#333' }}>Visa / Mastercard</div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>Pay with card (Demo)</div>
            </div>
          </button>

          <button
            onClick={() => handlePayment('bank')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>🏦</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', color: '#333' }}>Bank Transfer</div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>Pay via bank transfer (Demo)</div>
            </div>
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '1.5rem',
            background: 'transparent',
            color: '#666',
            border: 'none',
            padding: '0.5rem',
            cursor: 'pointer',
            width: '100%',
            fontSize: '0.9rem'
          }}
        >
          ← Cancel and return to shop
        </button>
      </div>
    </div>
  );
}