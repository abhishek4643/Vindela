import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MAT = (name, fill = 0, size = 20, color = 'inherit') => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: size, color }}>{name}</span>
);

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', countryCode: '+1', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
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
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in required fields');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    
    setLoading(true);
    try {
      const fullPhone = form.phone ? `${form.countryCode} ${form.phone}` : '';
      await register(form.name, form.email, form.password, fullPhone);
      toast.success('Registration successful! Welcome to Vindela.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexWrap: 'wrap', position: 'relative' }}>
      {/* Left Side: Cinematic Image */}
      <div style={{ flex: '1 1 500px', position: 'relative', minHeight: '30vh' }}>
        <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80" alt="Fine Dining" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,15,15,0.9) 0%, rgba(20,20,20,0.4) 100%)' }}></div>
        <div style={{ position: 'absolute', bottom: 64, left: 64, right: 64, zIndex: 1 }}>
           <h2 className="serif-heading" style={{ fontSize: 48, fontWeight: 800, color: '#d4af37', marginBottom: 16, lineHeight: 1.1 }}>Begin your journey,<br/><span style={{color: '#fff'}}>secure your table.</span></h2>
           <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', maxWidth: 400 }}>Create an account to manage your reservations and receive exclusive invitations to special culinary events.</p>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40, justifyContent: 'center' }}>
              <div style={{ width: 2, height: 40, background: 'var(--color-primary)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {MAT('restaurant', 1, 36, '#fff')}
                <h1 className="serif-heading" style={{ fontSize: 40, fontWeight: 800, color: 'var(--color-primary)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>Vindela</h1>
              </div>
            </div>

            <h2 className="serif-heading" style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: 'var(--color-text-main)' }}>Create an account</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15, marginBottom: 40 }}>Join us to manage your luxury reservations.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Full Name</label>
                <input type="text" className="form-input" style={{ padding: '14px 20px', fontSize: 15, borderRadius: 12, background: 'var(--color-background)' }}
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Email Address</label>
                <input type="email" className="form-input" style={{ padding: '14px 20px', fontSize: 15, borderRadius: 12, background: 'var(--color-background)' }}
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Phone Number <span style={{fontWeight: 400, opacity: 0.7}}>(Recommended)</span></label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <select className="form-input" style={{ padding: '14px', fontSize: 15, borderRadius: 12, background: 'var(--color-background)', width: 'auto', appearance: 'none', cursor: 'pointer', paddingRight: 32 }}
                    value={form.countryCode} onChange={e => setForm({ ...form, countryCode: e.target.value })}>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <input type="text" className="form-input" style={{ flex: 1, padding: '14px 20px', fontSize: 15, borderRadius: 12, background: 'var(--color-background)' }}
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(555) 000-0000" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? 'text' : 'password'} className="form-input" style={{ padding: '14px 20px', fontSize: 15, borderRadius: 12, background: 'var(--color-background)', paddingRight: 40 }}
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                      {MAT(showPassword ? 'visibility_off' : 'visibility', 0, 18)}
                    </button>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Confirm</label>
                  <input type="password" className="form-input" style={{ padding: '14px 20px', fontSize: 15, borderRadius: 12, background: 'var(--color-background)' }}
                    value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" />
                </div>
              </div>
              
              <button type="submit" className="btn" disabled={loading} style={{ marginTop: 16, padding: '16px', borderRadius: 12, fontSize: 16, fontWeight: 700, width: '100%', display: 'flex', justifyContent: 'center', gap: 12, background: '#d4af37', color: '#000', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(212,175,55,0.2)' }}>
                {loading ? 'Creating Account...' : 'Sign Up'} {MAT('arrow_forward', 0, 20, '#000')}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Already have an account? </span>
              <Link to="/login" style={{ fontSize: 15, color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 700 }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}