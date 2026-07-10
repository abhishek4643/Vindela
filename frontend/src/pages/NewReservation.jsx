import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const LOC_LABELS = { indoor: 'Indoor', outdoor: 'Outdoor', bar: 'Bar', private: 'Private' };
const MAT = (name, fill = 0, size = 20, color = '#006874') => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: size, color }}>{name}</span>
);

export default function NewReservation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!date) return toast.error('Please select a date.');
    setLoading(true);
    try {
      const res = await api.get(`/availability?date=${date}&guests=${partySize}`);
      setAvailableTables(res.data.tables || []);
      setStep(2);
      setSelectedTable(null);
      setSelectedSlot('');
    } catch (err) {
      toast.error('Failed to load availability');
    } finally { setLoading(false); }
  };

  const handleBook = async () => {
    if (!selectedTable || !selectedSlot) return toast.error('Select a table and time slot.');
    setLoading(true);
    try {
      await api.post('/reservations', {
        tableId: selectedTable._id,
        date,
        timeSlot: selectedSlot,
        partySize,
        specialRequests
      });
      toast.success('Reservation confirmed!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setLoading(false); }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
           <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', color: '#171c1f', marginBottom: 8 }}>Book a Table</h1>
           <p style={{ color: '#3f484a' }}>Reserve your spot at LuxeReserve for an unforgettable dining experience.</p>
        </div>

        {step === 1 && (
          <div className="lx-card">
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              {MAT('search', 0, 24)} Find a Table
            </h2>
            <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Date</label>
                <input type="date" className="form-input" min={new Date().toISOString().split('T')[0]} required value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Party Size</label>
                <select className="form-input" value={partySize} onChange={e => setPartySize(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Searching...' : 'Check Availability'} {MAT('arrow_forward', 0, 18, '#fff')}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="btn btn-soft btn-sm" onClick={() => setStep(1)}>{MAT('arrow_back', 0, 16)} Back</button>
              <div style={{ fontSize: 14, color: '#3f484a', fontWeight: 600 }}>Showing availability for {new Date(date).toLocaleDateString()} for {partySize} guests</div>
            </div>

            <div className="table-map">
              {availableTables.map(table => {
                const isSelected = selectedTable?._id === table._id;
                const isBooked = table.isFullyBooked;
                return (
                  <div key={table._id} 
                       className={`table-tile ${isSelected ? 'selected' : ''} ${isBooked ? 'table-tile-booked' : ''}`}
                       onClick={() => { if (!isBooked) { setSelectedTable(table); setSelectedSlot(''); } }}>
                     <div className="table-tile-number">{table.tableNumber}</div>
                     <div className="table-tile-cap">{MAT('group',0,14)} Up to {table.capacity}</div>
                     <div className="table-tile-loc">{MAT('deck',0,14)} {LOC_LABELS[table.location]}</div>
                     <div className="table-tile-actions">
                        {isBooked ? <span className="badge badge-cancelled">Full</span> : <span className="badge badge-confirmed">Select</span>}
                     </div>
                  </div>
                );
              })}
            </div>

            {selectedTable && (
              <div className="lx-card" style={{ marginTop: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Select Time Slot for Table {selectedTable.tableNumber}</h3>
                <div className="slot-grid" style={{ marginBottom: 24 }}>
                  {['11:00-13:00', '13:00-15:00', '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00'].map(slot => {
                    const isAvailable = selectedTable.availableSlots.includes(slot);
                    const isSelected = selectedSlot === slot;
                    return (
                      <button key={slot} type="button" 
                        disabled={!isAvailable}
                        className={`slot-btn ${isAvailable ? 'available' : 'booked'} ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedSlot(slot)}>
                        {slot}
                      </button>
                    );
                  })}
                </div>

                {selectedSlot && (
                  <div style={{ borderTop: '1px solid #dbe4e6', paddingTop: 24 }}>
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Special Requests (Optional)</label>
                      <textarea className="form-input" rows="3" placeholder="Anniversary, allergies, etc."
                        value={specialRequests} onChange={e => setSpecialRequests(e.target.value)}></textarea>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                      <button className="btn btn-soft" onClick={() => { setSelectedTable(null); setSelectedSlot(''); }}>Cancel</button>
                      <button className="btn btn-primary" onClick={handleBook} disabled={loading}>
                        {loading ? 'Confirming...' : 'Confirm Reservation'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}