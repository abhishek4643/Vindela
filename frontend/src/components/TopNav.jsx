import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const MAT = (name, fill = 0, size = 20, color = '') => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: size, color }}>{name}</span>
);

export default function TopNav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) setIsDark(true);
  }, []);

  const toggleDark = () => {
    setIsDark(!isDark);
    if (!isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const adminLinks = [
    { to: '/admin', label: 'Command Center', icon: 'dashboard' },
    { to: '/admin/reservations', label: 'Reservations', icon: 'calendar_month' },
    { to: '/admin/tables', label: 'Tables', icon: 'table_restaurant' }
  ];
  const customerLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/reserve', label: 'Book Table', icon: 'calendar_add_on' }
  ];
  const links = user?.role === 'admin' ? adminLinks : customerLinks;

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--color-surface)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'background-color 0.3s' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)' }}>
            {MAT('diamond', 0, 24)}
            <span className="serif-heading" style={{ fontSize: 24, fontWeight: 600 }}>Vindela</span>
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
            {links.map(({ to, label, icon }) => (
              <Link key={to} to={to} style={{ 
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 100,
                textDecoration: 'none', fontWeight: 500, fontSize: 14,
                color: location.pathname === to ? 'var(--color-surface)' : 'var(--color-text-main)',
                background: location.pathname === to ? 'var(--color-primary)' : 'transparent',
                transition: 'all 0.2s'
              }}>
                {MAT(icon, location.pathname === to ? 1 : 0, 18)} {label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Dark Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {MAT('dark_mode', 0, 16, 'var(--color-text-muted)')}
            <div className="toggle-bg" onClick={toggleDark}>
              <div className="toggle-dot"></div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-main)' }}>{user?.name?.split(' ')[0]}</div>
          </div>
          <button className="btn-primary" onClick={handleLogout} style={{ padding: '8px 16px', fontSize: 13, gap: 4 }}>
            {MAT('logout', 0, 16)} Logout
          </button>
        </div>
      </div>
    </nav>
  );
}