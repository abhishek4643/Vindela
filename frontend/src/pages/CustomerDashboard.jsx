import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const LOC_LABELS = { indoor: 'Indoor', outdoor: 'Outdoor', bar: 'Bar', private: 'Private' };
const MAT = (name, fill = 0, size = 20, color = 'var(--color-primary)') => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: size, color }}>{name}</span>
);

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/reservations/my')
      .then(res => setReservations(res.data.data || []))
      .catch(() => toast.error('Failed to load reservations.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load() }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await api.put(`/reservations/${id}/status`, { status: 'cancelled' });
      toast.success('Reservation cancelled successfully');
      load();
    } catch (e) {
      toast.error('Failed to cancel reservation');
    }
  };

  const upcoming = reservations.filter(r => (r.status === 'confirmed' || r.status === 'pending') && new Date(r.date) >= new Date());
  const first = upcoming[0] || null;

  return (
    <AppLayout>
      {/* Profile & Hero Section */}
      <div style={{ 
        position: 'relative', borderRadius: 32, overflow: 'hidden', padding: '48px 64px', marginBottom: 56,
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 40px 80px -20px rgba(0,0,0,0.3)'
      }}>
        {/* Restaurant Background Image */}
        <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80" alt="Restaurant Interior" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        {/* Dark overlay to ensure text is always readable (both light and dark modes) */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,15,15,0.9) 0%, rgba(20,20,20,0.7) 100%)' }}></div>

        {/* Abstract background shapes */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: -50, left: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)', borderRadius: '50%' }}></div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: 48, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ width: 100, height: 100, borderRadius: 100, background: 'linear-gradient(135deg, var(--color-primary), #8a6c1c)', color: '#fff', fontSize: 40, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px -10px rgba(212, 175, 55, 0.4)' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>Welcome Back</div>
              <h1 className="serif-heading" style={{ fontSize: 44, fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>{user?.name}</h1>
              <div style={{ color: 'rgba(255,255,255,0.6)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginTop: 12, fontSize: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{MAT('mail', 0, 16)} {user?.email}</span>
                {user?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{MAT('phone', 0, 16)} {user?.phone}</span>}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
             <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, margin: 0, textAlign: 'center', maxWidth: 260 }}>Ready for an unforgettable dining experience?</p>
             <button className="btn" style={{ padding: '16px 32px', borderRadius: 100, fontSize: 16, fontWeight: 700, boxShadow: '0 15px 30px -10px rgba(212,175,55,0.4)', border: 'none', background: '#d4af37', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.2s', width: '100%' }} onClick={() => navigate('/reserve')}>
                {MAT('add', 0, 20, '#000')} Book a Table
             </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 64, textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>
      ) : (
        <>
          {first && (
            <div style={{ marginBottom: 56 }}>
               <h2 className="serif-heading" style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-main)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                 {MAT('star', 1, 28, 'var(--color-primary)')} Your Next Visit
               </h2>
               <div style={{ 
                 position: 'relative', borderRadius: 32, overflow: 'hidden', minHeight: 360,
                 boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)', border: '1px solid rgba(212, 175, 55, 0.3)'
               }}>
                 <img src={first.table?.location === 'outdoor' ? 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80' : first.table?.location === 'bar' ? 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80' : first.table?.location === 'private' ? 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80'} 
                      alt="Venue" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 100%)' }}></div>
                 
                 <div style={{ position: 'relative', zIndex: 1, padding: '48px 64px', display: 'flex', flexWrap: 'wrap', gap: 48, justifyContent: 'space-between', alignItems: 'center', minHeight: 360 }}>
                    <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                         <span className={`badge badge-${first.status}`} style={{ fontSize: 12, padding: '8px 16px', background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', border: '1px solid rgba(212, 175, 55, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{first.status}</span>
                       </div>
                       
                       <h3 className="serif-heading" style={{ fontSize: 56, fontWeight: 800, color: '#fff', margin: '0 0 16px 0', lineHeight: 1.1 }}>Table for {first.partySize}</h3>
                       
                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, marginTop: 24 }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Restaurant</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#d4af37' }}>{first.restaurantName || 'Vindela Signature'}</div>
                            <div style={{ fontSize: 16, color: '#fff', marginTop: 4 }}>{LOC_LABELS[first.table?.location] || 'Standard'} Dining</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Date & Time</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#d4af37' }}>{new Date(first.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                            <div style={{ fontSize: 16, color: '#fff', marginTop: 4 }}>{first.timeSlot}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Dining Area</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#d4af37' }}>{LOC_LABELS[first.table?.location] || 'Standard'}</div>
                            <div style={{ fontSize: 16, color: '#fff', marginTop: 4 }}>Table {first.table?.tableNumber || 'TBD'}</div>
                          </div>
                       </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: 48, borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: 64 }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                         <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Booking Reference</div>
                            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '0.1em' }}>{first.confirmationCode}</div>
                         </div>
                         <div style={{ background: '#fff', padding: 8, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=VINDELA-${first.confirmationCode}`} alt="QR Code" style={{ width: 80, height: 80 }} />
                         </div>
                       </div>
                       
                       <button className="btn btn-soft" style={{ borderRadius: 100, padding: '16px 32px', fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }} onClick={() => handleCancel(first._id)}>
                         Cancel Reservation
                       </button>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {reservations.length > (first ? 1 : 0) && (
            <section>
              <h2 className="serif-heading" style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-main)', marginBottom: 24 }}>Reservation History</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
                {reservations.filter(r => first ? r._id !== first._id : true).map(res => (
                  <div key={res._id} className="lx-card" style={{ 
                    display: 'flex', borderRadius: 24, 
                    border: '1px solid rgba(129, 107, 31, 0.2)', overflow: 'hidden',
                    backgroundImage: `linear-gradient(to right, rgba(15,15,15,0.95) 0%, rgba(15,15,15,0.7) 100%), url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80')`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }}>
                    {/* Left Date Block */}
                    <div style={{ 
                      width: 120, 
                      position: 'relative',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px',
                      background: 'rgba(0,0,0,0.4)',
                      backdropFilter: 'blur(4px)',
                      borderRight: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                       <div style={{ fontSize: 14, fontWeight: 800, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>
                         {new Date(res.date).toLocaleDateString('en-US', { month: 'short' })}
                       </div>
                       <div className="serif-heading" style={{ fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                         {new Date(res.date).getDate()}
                       </div>
                       <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8, fontWeight: 600, letterSpacing: '0.1em' }}>
                         {new Date(res.date).getFullYear()}
                       </div>
                    </div>
                    
                    {/* Right Content */}
                    <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                         <div>
                           <div style={{ fontSize: 13, color: '#d4af37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{res.restaurantName || 'Vindela Signature'}</div>
                           <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Table for {res.partySize}</div>
                           <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{res.timeSlot} · {LOC_LABELS[res.table?.location] || 'Standard'}</div>
                         </div>
                         <span className={`badge badge-${res.status}`} style={{ fontSize: 10, padding: '6px 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{res.status}</span>
                       </div>
                       
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                         <div style={{ fontSize: 14, color: '#d4af37', fontWeight: 700, letterSpacing: '0.1em' }}>#{res.confirmationCode}</div>
                         {(res.status === 'confirmed' || res.status === 'pending') && (
                           <button style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: 14, fontWeight: 700, cursor: 'pointer', padding: '8px 0', textDecoration: 'underline' }} onClick={() => handleCancel(res._id)}>
                             Cancel
                           </button>
                         )}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {reservations.length === 0 && (
             <div style={{ textAlign: 'center', padding: '64px 24px', background: 'var(--color-surface)', borderRadius: 32, border: '1px dashed rgba(129, 107, 31, 0.3)' }}>
               {MAT('history', 0, 48, 'var(--color-text-muted)')}
               <h3 className="serif-heading" style={{ fontSize: 24, marginTop: 16, marginBottom: 8, color: 'var(--color-text-main)' }}>No Reservation History</h3>
               <p style={{ color: 'var(--color-text-muted)' }}>You haven't made any bookings with us yet.</p>
             </div>
          )}
        </>
      )}
    </AppLayout>
  );
}