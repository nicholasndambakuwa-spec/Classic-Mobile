import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login({ loginUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://classicmobile.infinityfreeapp.com/login.php', form);
      if (res.data.success) {
        loginUser(res.data.user);
        toast.success('Welcome back! 🎉');
        navigate('/');
      } else {
        toast.error(res.data.error);
      }
    } catch {
      toast.error('Something went wrong. Is XAMPP running?');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Your password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-switch">
          No account? <Link to="/register">Create one →</Link>
        </div>
      </div>
    </div>
  );
}