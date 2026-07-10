import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MAT = (name, fill = 0, size = 20) => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: size }}>{name}</span>
);

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all required fields.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Welcome to LuxeReserve!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#006874', ...{boxShadow: '-8px -8px 20px #ffffff, 8px 8px 20px #cbd5e1'} }}>
            {MAT('restaurant', 1, 32)}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#171c1f', letterSpacing: '-0.02em', marginBottom: 4 }}>Join LuxeReserve</h1>
          <p style={{ color: '#3f484a', fontSize: 14 }}>Create an account to book your table</p>
        </div>

        <div className="lx-card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Full Name *</label>
              <input type="text" className="form-input" placeholder="John Doe"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Email Address *</label>
              <input type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Phone (optional)</label>
              <input type="tel" className="form-input" placeholder="+1 234 567 8900"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Password *</label>
                <input type="password" className="form-input" placeholder="Min 6 chars"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Confirm *</label>
                <input type="password" className="form-input" placeholder="Repeat password"
                  value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#3f484a' }}>
          Already have an account? <Link to="/login" style={{ color: '#006874', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}