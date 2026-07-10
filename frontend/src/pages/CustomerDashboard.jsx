import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const LOC_LABELS = { indoor: 'Indoor', outdoor: 'Outdoor', bar: 'Bar', private: 'Private' };
const MAT = (name, fill = 0, size = 20, color = '#006874') => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: size, color }}>{name}</span>
);

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reservations/my')
      .then(res => setReservations(res.data.data || []))
      .catch(() => toast.error('Failed to load reservations.'))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = reservations.filter(r => (r.status === 'confirmed' || r.status === 'pending') && new Date(r.date) >= new Date());
  const first = upcoming[0] || null;
  const totalVisits = reservations.filter(r => r.status === 'completed' || r.status === 'confirmed').length;

  return (
    <AppLayout>
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#171c1f', marginBottom: 8, lineHeight: 1.1 }}>
            Welcome back, <span style={{ color: '#006874' }}>{user?.name?.split(' ')[0] || 'Guest'}</span>.
          </h1>
          <p style={{ color: '#3f484a', fontSize: 16 }}>Here is a summary of your upcoming dining experiences.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/reserve')}>
          {MAT('add', 0, 20, '#fff')} New Booking
        </button>
      </section>

      {loading ? (
        <div style={{ padding: 64, textAlign: 'center', color: '#6f797a' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 32 }}>
          {first ? (
             <div className="lx-card" style={{ display: 'flex', flexDirection: 'row', gap: 24, padding: 12, overflow: 'hidden' }}>
             <div style={{ width: '45%', flexShrink: 0, borderRadius: 16, overflow: 'hidden', boxShadow: 'inset 5px 5px 10px #cbd5e1, inset -5px -5px 10px #ffffff', padding: 4 }}>
               <img
                 src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                 alt="Restaurant"
                 style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, minHeight: 180 }}
               />
             </div>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px 8px' }}>
                <div>
                   <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                     {[1,2,3].map(i => <span key={i} className="material-symbols-outlined" style={{ fontSize: 14, color: '#006874', fontVariationSettings: "'FILL' 1" }}>star</span>)}
                   </div>
                   <h2 style={{ fontSize: 22, fontWeight: 700, color: '#171c1f', marginBottom: 4 }}>Upcoming Reservation</h2>
                   <p style={{ color: '#3f484a', marginBottom: 16, fontSize: 14 }}>Table for {first.partySize} · #{first.table?.tableNumber || 'TBD'}</p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #dbe4e6', paddingTop: 16 }}>
                   <div style={{ display: 'flex', gap: 16 }}>
                     {[['schedule', first.timeSlot], ['calendar_today', first.date], ['deck', LOC_LABELS[first.table?.location] || 'TBD']].map(([icon, val]) => (
                       <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#3f484a', fontSize: 14 }}>
                         {MAT(icon, 0, 16, '#3f484a')}
                         <span style={{ fontWeight: 600, color: '#171c1f' }}>{val}</span>
                       </div>
                     ))}
                   </div>
                   <span className={`badge badge-${first.status}`}>{first.status}</span>
                </div>
             </div>
           </div>
          ) : (
            <div className="lx-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, gap: 16, textAlign: 'center' }}>
              {MAT('calendar_today', 0, 48, '#6f797a')}
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 18, color: '#171c1f', marginBottom: 4 }}>No Upcoming Reservations</h3>
                <p style={{ color: '#3f484a', fontSize: 14 }}>Book your next dining experience now.</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {!loading && reservations.length > 0 && (
         <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
         <h2 style={{ fontSize: 20, fontWeight: 700, color: '#171c1f' }}>All Reservations</h2>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
           {reservations.map(res => (
             <div key={res._id} className="lx-card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
               <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
                 {[
                   { icon: 'calendar_today', label: 'DATE', value: new Date(res.date).toLocaleDateString() },
                   { icon: 'schedule', label: 'TIME', value: res.timeSlot },
                   { icon: 'group', label: 'GUESTS', value: `${res.partySize}` },
                   { icon: 'table_restaurant', label: 'TABLE', value: res.table?.tableNumber ? `#${res.table.tableNumber}` : 'TBD' },
                 ].map(({ icon, label, value }) => (
                   <div key={label}>
                     <div style={{ fontSize: 11, color: '#6f797a', fontWeight: 600, marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600, fontSize: 14, color: '#171c1f' }}>
                       {MAT(icon, 0, 16, '#006874')} {value}
                     </div>
                   </div>
                 ))}
               </div>
               <div style={{ textAlign: 'right' }}>
                 <span className={`badge badge-${res.status}`}>{res.status}</span>
                 <div style={{ marginTop: 8, fontSize: 12, color: '#006874', fontWeight: 600, background: 'rgba(0,104,116,0.1)', padding: '2px 8px', borderRadius: 6 }}>#{res.confirmationCode}</div>
               </div>
             </div>
           ))}
         </div>
       </section>
      )}
    </AppLayout>
  );
}