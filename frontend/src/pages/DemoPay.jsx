import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * DemoPay Component - PayNow Test Mode Simulator
 * 
 * Uses PayNow official test tokens from their documentation:
 * Mobile Money Test Numbers:
 * - 0771111111: Immediate success (5 seconds)
 * - 0772222222: Delayed success (30 seconds)
 * - 0773333333: User cancelled
 * - 0774444444: Insufficient balance
 * 
 * Card Test Tokens:
 * - {11111111-1111-1111-1111-111111111111}: Success
 * - {22222222-2222-2222-2222-222222222222}: Pending
 * - {33333333-3333-3333-3333-333333333333}: Cancelled
 * - {44444444-4444-4444-4444-444444444444}: Insufficient balance
 * 
 * See: https://developers.paynow.co.zw/docs/paynow/test_mode
 */

export default function DemoPay() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: method select, 2: details, 3: processing, 4: success
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState('0771111111');

  const ref = searchParams.get('ref') || 'N/A';
  const amount = searchParams.get('amount') || '0.00';
  const orderId = searchParams.get('order') || 'N/A';

  // PayNow Test Numbers
  const testNumbers = {
    success: '0771111111',
    delayed: '0772222222',
    cancelled: '0773333333',
    insufficient: '0774444444'
  };

  // PayNow Test Card Tokens
  const testTokens = {
    success: '{11111111-1111-1111-1111-111111111111}',
    pending: '{22222222-2222-2222-2222-222222222222}',
    cancelled: '{33333333-3333-3333-3333-333333333333}',
    insufficient: '{44444444-4444-4444-4444-444444444444}'
  };

  const handlePayment = async (method, testValue) => {
    setProcessing(true);
    setStep(3);

    // Simulate different payment processing times based on test scenario
    const processingTime = testValue === testNumbers.delayed || testValue === testTokens.pending ? 2000 : 1000;

    setTimeout(async () => {
      try {
        // Update order status via API
        const paymentStatus = 
          testValue === testNumbers.cancelled || testValue === testTokens.cancelled ? 'failed' :
          testValue === testNumbers.insufficient || testValue === testTokens.insufficient ? 'failed' :
          'completed';

        await fetch('https://classicmobile.infinityfreeapp.com/update_order.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: orderId,
            status: paymentStatus,
            payment_method: method,
            paynow_ref: ref,
            test_value: testValue
          })
        });

        if (paymentStatus === 'failed') {
          toast.error('Test payment simulated as failed');
          setStep(1); // Back to method selection
          return;
        }

        setStep(4);
        toast.success('Payment successful!');
      } catch (e) {
        toast.error('Error updating order. Continue anyway?');
        setStep(4);
      }
    }, processingTime);
  };

  const handleContinue = () => {
    navigate('/success?order=' + orderId);
  };

  // Step 1: Select Payment Method
  if (step === 1) {
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
          maxWidth: '600px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '1rem', color: '#333' }}>
            Select Payment Method
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>PayNow Test Mode - Choose a payment method:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => { setSelectedMethod('mobile'); setStep(2); }}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '2rem 1rem',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              📱<br/>Mobile Money<br/><span style={{fontSize: '0.8rem', opacity: 0.9}}>(EcoCash, OneMoney)</span>
            </button>
            <button
              onClick={() => { setSelectedMethod('card'); setStep(2); }}
              style={{
                background: '#764ba2',
                color: 'white',
                border: 'none',
                padding: '2rem 1rem',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              💳<br/>Card Payment<br/><span style={{fontSize: '0.8rem', opacity: 0.9}}>(Visa/Mastercard)</span>
            </button>
          </div>

          <p style={{ color: '#999', fontSize: '0.9rem' }}>
            Amount: <strong>${amount}</strong><br/>
            Reference: <strong>{ref}</strong>
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Select Test Scenario
  if (step === 2) {
    const testScenarios = selectedMethod === 'mobile' ? 
      [
        { label: '✅ Success (5s)', value: testNumbers.success },
        { label: '⏳ Delayed Success (30s)', value: testNumbers.delayed },
        { label: '❌ Cancelled', value: testNumbers.cancelled },
        { label: '⚠️ Insufficient Balance', value: testNumbers.insufficient }
      ] :
      [
        { label: '✅ Success', value: testTokens.success },
        { label: '⏳ Pending', value: testTokens.pending },
        { label: '❌ Cancelled', value: testTokens.cancelled },
        { label: '⚠️ Insufficient Balance', value: testTokens.insufficient }
      ];

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
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '1.5rem', color: '#333' }}>
            {selectedMethod === 'mobile' ? '📱 Mobile Money' : '💳 Card Payment'} - Test Scenario
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>Choose a test scenario:</p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            {testScenarios.map((scenario, idx) => (
              <button
                key={idx}
                onClick={() => handlePayment(selectedMethod, scenario.value)}
                style={{
                  background: '#f0f0f0',
                  color: '#333',
                  border: '2px solid #667eea',
                  padding: '1rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: 'bold'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#667eea';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f0f0f0';
                  e.target.style.color = '#333';
                }}
              >
                {scenario.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            style={{
              background: 'transparent',
              color: '#667eea',
              border: '2px solid #667eea',
              padding: '0.8rem 1.5rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            ← Back to Methods
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Processing
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

  // Step 4: Success
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

  // Fallback (should not reach here)
  return null;
}