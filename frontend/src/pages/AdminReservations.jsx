import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const MAT = (name, fill = 0, size = 18, color = '') => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: size, color }}>{name}</span>
);

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterRestaurant, setFilterRestaurant] = useState('All');
  
  useEffect(() => { load() }, [filterDate]);
  
  const load = () => {
    const url = filterDate ? `/reservations?date=${filterDate}` : '/reservations';
    api.get(url).then(res => setReservations(res.data.reservations)).catch(console.error);
  };
  
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      toast.success('Status updated');
      load();
    } catch (e) { toast.error('Failed to update'); }
  };

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="serif-heading" style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text-main)', marginBottom: 8 }}>Manage Reservations</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Review and manage all upcoming and past dining experiences.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['All', 'Bawarchi', 'Paradise', 'Platform65', 'Kritunga', 'Devaraya', 'Viyyalavari Kitchen'].map(rest => (
            <button 
              key={rest}
              onClick={() => setFilterRestaurant(rest)}
              style={{
                padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                background: filterRestaurant === rest ? 'var(--color-primary)' : 'var(--color-surface)',
                color: filterRestaurant === rest ? '#fff' : 'var(--color-text-main)',
                boxShadow: filterRestaurant === rest ? '0 4px 12px rgba(212,175,55,0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {rest}
            </button>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-surface)', padding: '8px 16px', borderRadius: 100, border: '1px solid rgba(129, 107, 31, 0.15)' }}>
            {MAT('calendar_today', 0, 18, 'var(--color-primary)')}
            <input type="date" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, fontWeight: 600, color: 'var(--color-text-main)' }} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
            {filterDate && <button onClick={() => setFilterDate('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>{MAT('close', 0, 16)}</button>}
          </div>
        </div>
      </div>

      {reservations.filter(r => filterRestaurant === 'All' || (r.restaurantName || 'Bawarchi') === filterRestaurant).length === 0 ? (
        <div className="v-card" style={{ padding: 80, textAlign: 'center', color: 'var(--color-text-muted)', borderRadius: 32 }}>
          {MAT('event_busy', 0, 64, 'var(--color-border)')}
          <h3 className="serif-heading" style={{ fontSize: 24, marginTop: 24, marginBottom: 8 }}>No reservations</h3>
          <div>No reservations found for the selected date.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, alignItems: 'start' }}>
          {reservations.filter(r => filterRestaurant === 'All' || (r.restaurantName || 'Bawarchi') === filterRestaurant).map(r => (
            <div key={r._id} className="lx-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 32, border: '1px solid rgba(129, 107, 31, 0.15)', display: 'flex', flexDirection: 'column' }}>
               {/* Ticket Header */}
               <div style={{ padding: '16px 20px', background: 'linear-gradient(to bottom, rgba(129, 107, 31, 0.08), transparent)', borderBottom: '2px dashed rgba(129, 107, 31, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', fontWeight: 800, marginBottom: 2 }}>{r.restaurantName || 'Bawarchi'}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 6 }}>{new Date(r.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    <div className="serif-heading" style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-main)' }}>{r.timeSlot}</div>
                  </div>
                  <div><span className={`badge badge-${r.status}`} style={{ fontSize: 11, padding: '6px 12px' }}>{r.status}</span></div>
               </div>

               {/* Details */}
               <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Customer Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, boxShadow: '0 4px 12px rgba(129, 107, 31, 0.2)' }}>
                      {r.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-text-main)' }}>{r.user?.name || 'Guest'}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>{MAT('mail',0,12)} {r.user?.email || 'N/A'}</div>
                      {r.user?.phone && <div style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>{MAT('call',0,12)} {r.user?.phone}</div>}
                    </div>
                  </div>
                  
                  {/* Table & Guests Specs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '12px', background: 'var(--color-background)', borderRadius: 16 }}>
                     <div>
                        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: 4 }}>Party Size</div>
                        <div style={{ fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-main)' }}>
                          <span style={{ width: 24, height: 24, borderRadius: 8, background: 'rgba(129, 107, 31, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{MAT('group',1,14,'var(--color-primary)')}</span> 
                          {r.partySize} Guests
                        </div>
                     </div>
                     <div>
                        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: 4 }}>Table</div>
                        <div style={{ fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-main)' }}>
                          <span style={{ width: 24, height: 24, borderRadius: 8, background: 'rgba(129, 107, 31, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{MAT('table_restaurant',1,14,'var(--color-primary)')}</span> 
                          {r.table?.tableNumber ? `T${r.table.tableNumber}` : 'TBA'}
                        </div>
                     </div>
                  </div>

                  {/* Special Requests */}
                  {r.specialRequests && (
                    <div style={{ fontSize: 12, padding: '12px 16px', background: 'rgba(129, 107, 31, 0.05)', borderRadius: 12, color: 'var(--color-text-main)', borderLeft: '3px solid var(--color-primary)' }}>
                      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: 4 }}>Special Requests</div>
                      <div style={{ fontStyle: 'italic', lineHeight: 1.4, opacity: 0.9 }}>{r.specialRequests}</div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 8 }}>
                    {r.status === 'pending' && <button className="btn btn-primary" style={{flex: 1, padding: 12, borderRadius: 12, fontSize: 13}} onClick={() => updateStatus(r._id, 'confirmed')}>{MAT('check_circle', 1, 16)} Confirm</button>}
                    {r.status === 'confirmed' && <button className="btn btn-primary" style={{flex: 1, padding: 12, borderRadius: 12, fontSize: 13}} onClick={() => updateStatus(r._id, 'completed')}>{MAT('done_all', 1, 16)} Complete</button>}
                    {(r.status === 'pending' || r.status === 'confirmed') && <button className="btn btn-soft" style={{flex: 1, padding: 12, borderRadius: 12, fontSize: 13}} onClick={() => updateStatus(r._id, 'cancelled')}>{MAT('cancel', 1, 16)} Cancel</button>}
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}