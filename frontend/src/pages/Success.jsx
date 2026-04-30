import { Link } from 'react-router-dom';

export default function Success() {
  return (
    <div className="success-page" style={{maxWidth: '640px', margin: '4rem auto', padding: '2rem', textAlign: 'center'}}>
      <div className="success-card" style={{background: '#fff', borderRadius: '18px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: '3rem'}}>
        <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🎉</div>
        <h2 style={{marginBottom: '1rem'}}>Payment Successful</h2>
        <p style={{color: '#555', marginBottom: '1.5rem'}}>Thank you! Your payment has been processed successfully.</p>
        <Link to="/" className="submit-btn" style={{display: 'inline-block', padding: '0.9rem 1.6rem', borderRadius: '999px', background: '#e94560', color: '#fff', textDecoration: 'none'}}>Continue Shopping</Link>
      </div>
    </div>
  );
}
