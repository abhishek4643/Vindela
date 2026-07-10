import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Manage Reservations</h1>
        <input type="date" className="form-input" style={{ width: 'auto' }} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
      </div>

      <div className="lx-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,104,116,0.05)', borderBottom: '1px solid #dbe4e6' }}>
              {['Date & Time', 'Customer', 'Table', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#6f797a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r._id} style={{ borderBottom: '1px solid #dbe4e6' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 600, color: '#171c1f' }}>{r.date}</div>
                  <div style={{ fontSize: 13, color: '#3f484a' }}>{r.timeSlot}</div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 600, color: '#171c1f' }}>{r.user?.name}</div>
                  <div style={{ fontSize: 13, color: '#3f484a' }}>{r.partySize} Guests</div>
                </td>
                <td style={{ padding: '16px 24px', fontWeight: 600 }}>T{r.table?.tableNumber}</td>
                <td style={{ padding: '16px 24px' }}><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                <td style={{ padding: '16px 24px', display: 'flex', gap: 8 }}>
                  {r.status === 'pending' && <button className="btn btn-sm btn-primary" onClick={() => updateStatus(r._id, 'confirmed')}>Confirm</button>}
                  {r.status !== 'cancelled' && r.status !== 'completed' && <button className="btn btn-sm btn-danger" onClick={() => updateStatus(r._id, 'cancelled')}>Cancel</button>}
                  {r.status === 'confirmed' && <button className="btn btn-sm btn-soft" onClick={() => updateStatus(r._id, 'completed')}>Complete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}