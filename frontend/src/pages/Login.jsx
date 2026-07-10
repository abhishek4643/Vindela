import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MAT = (name, fill = 0, size = 20) => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: size }}>{name}</span>
);

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Top Right Controls */}
      <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', alignItems: 'center', gap: 12, background: isDark ? '#1A1918' : '#fff', padding: '8px 16px', borderRadius: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        {MAT('dark_mode', 0, 16, isDark ? '#F8F6F0' : '#816B1F')}
        <div className="toggle-bg" onClick={() => setIsDark(!isDark)}>
          <div className="toggle-dot"></div>
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: isDark ? '#F8F6F0' : '#7A7873' }}>Dark Mode</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ color: '#816B1F', marginBottom: 12 }}>
            {MAT('diamond', 0, 42)}
          </div>
          <h1 className="serif-heading" style={{ fontSize: 42, fontWeight: 600, color: '#816B1F', marginBottom: 12 }}>Vindela</h1>
          <div style={{ fontSize: 11, fontWeight: 600, color: isDark ? '#A09D96' : '#7A7873', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Fine Dining Reservation System
          </div>
        </div>

        {/* Card */}
        <div className="v-card" style={{ width: '100%', maxWidth: 440 }}>
          <h2 className="serif-heading" style={{ fontSize: 28, fontWeight: 500, marginBottom: 8, color: isDark ? '#F8F6F0' : '#1B1A17' }}>Welcome back</h2>
          <p style={{ color: isDark ? '#A09D96' : '#7A7873', fontSize: 14, marginBottom: 32 }}>Sign in to access your reservations</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: isDark ? '#A09D96' : '#7A7873', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Email Address</label>
              <input type="email" className="v-input" style={{ backgroundColor: isDark ? '#242220' : '#EBF3FC' }}
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: isDark ? '#A09D96' : '#7A7873', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} className="v-input" style={{ backgroundColor: isDark ? '#242220' : '#F0EDE1', paddingRight: 40 }}
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#7A7873' }}>
                  {MAT(showPassword ? 'visibility_off' : 'visibility', 0, 18)}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Signing In...' : 'Sign In'} {MAT('arrow_forward', 0, 18)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}