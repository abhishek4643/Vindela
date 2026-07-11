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
    if (document.documentElement.classList.contains('dark')) setIsDark(true);
  }, []);

  const toggleDark = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vindela-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vindela-theme', 'light');
    }
  };

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
    <div style={{ minHeight: '100vh', display: 'flex', flexWrap: 'wrap', position: 'relative' }}>
      {/* Left Side: Cinematic Image */}
      <div style={{ flex: '1 1 500px', position: 'relative', minHeight: '30vh' }}>
        <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80" alt="Fine Dining" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,15,15,0.9) 0%, rgba(20,20,20,0.4) 100%)' }}></div>
        <div style={{ position: 'absolute', bottom: 64, left: 64, right: 64, zIndex: 1 }}>
           <h2 className="serif-heading" style={{ fontSize: 48, fontWeight: 800, color: '#d4af37', marginBottom: 16, lineHeight: 1.1 }}>A taste of luxury,<br/><span style={{color: '#fff'}}>an unforgettable evening.</span></h2>
           <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', maxWidth: 400 }}>Experience culinary perfection at Vindela. Reserve your table and step into a world of exquisite flavors.</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--color-surface)', borderLeft: '1px solid rgba(129, 107, 31, 0.1)' }}>
        {/* Theme Toggle */}
        <div style={{ position: 'absolute', top: 32, right: 32, display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-background)', padding: '8px 16px', borderRadius: 100, border: '1px solid rgba(129,107,31,0.1)', zIndex: 10 }}>
          {MAT('dark_mode', 0, 16, 'var(--color-primary)')}
          <div className="toggle-bg" onClick={toggleDark}>
            <div className="toggle-dot"></div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '64px 24px' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}>
              <div style={{ width: 2, height: 40, background: 'var(--color-primary)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {MAT('restaurant', 1, 36, '#fff')}
                <h1 className="serif-heading" style={{ fontSize: 40, fontWeight: 800, color: 'var(--color-primary)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>Vindela</h1>
              </div>
            </div>

            <h2 className="serif-heading" style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, color: 'var(--color-text-main)' }}>Welcome Back</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 16, marginBottom: 48 }}>Sign in to manage your luxury dining experiences.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Email Address</label>
                <input type="email" className="form-input" style={{ padding: '16px 20px', fontSize: 16, borderRadius: 12, background: 'var(--color-background)' }}
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} className="form-input" style={{ padding: '16px 20px', fontSize: 16, borderRadius: 12, background: 'var(--color-background)', paddingRight: 48 }}
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 16, top: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                    {MAT(showPassword ? 'visibility_off' : 'visibility', 0, 20)}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn" disabled={loading} style={{ marginTop: 16, padding: '16px', borderRadius: 12, fontSize: 16, fontWeight: 700, width: '100%', display: 'flex', justifyContent: 'center', gap: 12, background: '#d4af37', color: '#000', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(212,175,55,0.2)' }}>
                {loading ? 'Signing In...' : 'Sign In'} {MAT('arrow_forward', 0, 20, '#000')}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>New to Vindela? </span>
              <Link to="/register" style={{ fontSize: 15, color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 700 }}>
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}