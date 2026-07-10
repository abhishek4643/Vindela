import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../api/axios';

const MAT = (name, fill = 0, size = 20, color = '#006874') => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: size, color }}>{name}</span>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, confirmed: 0, cancelled: 0, todayCount: 0 });
  const [tables, setTables] = useState([]);
  
  useEffect(() => {
    api.get('/reservations/stats').then(res => setStats(res.data.stats)).catch(console.error);
    api.get('/tables').then(res => setTables(res.data.tables)).catch(console.error);
  }, []);

  const activeTables = tables.filter(t => t.isActive).length;

  const statCards = [
    { title: "Today's Bookings", val: stats.todayCount, icon: 'today' },
    { title: "Total Bookings", val: stats.total, icon: 'list_alt' },
    { title: "Confirmed", val: stats.confirmed, icon: 'check_circle' },
    { title: "Active Tables", val: `${activeTables}/${tables.length}`, icon: 'table_restaurant' },
  ];

  return (
    <AppLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', color: '#171c1f', marginBottom: 8 }}>Command Center</h1>
        <p style={{ color: '#3f484a' }}>Overview of restaurant operations and metrics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        {statCards.map(s => (
          <div key={s.title} className="lx-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#6f797a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.title}</div>
              {MAT(s.icon, 0, 24, '#006874')}
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, color: '#171c1f', lineHeight: 1 }}>{s.val}</div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}