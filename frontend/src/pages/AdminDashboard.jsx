import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../api/axios';

const MAT = (name, fill = 0, size = 20, color = 'var(--color-primary)') => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: size, color }}>{name}</span>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, confirmed: 0, cancelled: 0, todayCount: 0 });
  const [tables, setTables] = useState([]);
  const [recent, setRecent] = useState([]);
  
  useEffect(() => {
    api.get('/reservations/stats').then(res => setStats(res.data.stats)).catch(console.error);
    api.get('/tables').then(res => setTables(res.data.tables)).catch(console.error);
    api.get('/reservations').then(res => setRecent(res.data.reservations.slice(0, 3))).catch(console.error);
  }, []);

  const activeTables = tables.filter(t => t.isActive).length;

  return (
    <AppLayout>
      {/* Hero Welcome */}
      <div style={{ 
        position: 'relative', borderRadius: 32, overflow: 'hidden', marginBottom: 40,
        background: 'linear-gradient(to right, #1B1A17, #2c2923)'
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%', opacity: 0.3, backgroundImage: 'url("https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', maskImage: 'linear-gradient(to right, transparent, black)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, padding: '64px 48px', color: '#F8F6F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            {MAT('auto_awesome', 1, 24, '#d4af37')}
            <span style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, color: '#d4af37' }}>Command Center</span>
          </div>
          <h1 className="serif-heading" style={{ fontSize: 48, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Welcome back, Admin.</h1>
          <p style={{ fontSize: 18, color: '#A09D96', maxWidth: 600 }}>Here's an overview of today's dining operations and active reservations.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 40 }}>
        <div className="lx-card" style={{ padding: 32, borderRadius: 32, background: 'var(--color-surface)', border: '1px solid rgba(129, 107, 31, 0.1)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.05, pointerEvents: 'none' }}>{MAT('today', 1, 140)}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Today's Bookings</div>
          <div className="serif-heading" style={{ fontSize: 56, fontWeight: 800, color: 'var(--color-text-main)' }}>{stats.todayCount}</div>
        </div>

        <div className="lx-card" style={{ padding: 32, borderRadius: 32, background: 'var(--color-surface)', border: '1px solid rgba(129, 107, 31, 0.1)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.05, pointerEvents: 'none' }}>{MAT('list_alt', 1, 140)}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Bookings</div>
          <div className="serif-heading" style={{ fontSize: 56, fontWeight: 800, color: 'var(--color-text-main)' }}>{stats.total}</div>
        </div>

        <div className="lx-card" style={{ padding: 32, borderRadius: 32, background: 'linear-gradient(135deg, rgba(129,107,31,0.1), rgba(129,107,31,0.02))', border: '1px solid rgba(129, 107, 31, 0.2)', boxShadow: '0 20px 40px -10px rgba(129, 107, 31, 0.1)', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.1, pointerEvents: 'none' }}>{MAT('check_circle', 1, 140)}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Confirmed</div>
          <div className="serif-heading" style={{ fontSize: 56, fontWeight: 800, color: 'var(--color-primary)' }}>{stats.confirmed}</div>
        </div>

        <div className="lx-card" style={{ padding: 32, borderRadius: 32, background: 'var(--color-surface)', border: '1px solid rgba(129, 107, 31, 0.1)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.05, pointerEvents: 'none' }}>{MAT('table_restaurant', 1, 140)}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Tables</div>
          <div className="serif-heading" style={{ fontSize: 56, fontWeight: 800, color: 'var(--color-text-main)' }}>{activeTables}<span style={{fontSize: 24, color: 'var(--color-text-muted)'}}>/{tables.length}</span></div>
        </div>
      </div>

    </AppLayout>
  );
}