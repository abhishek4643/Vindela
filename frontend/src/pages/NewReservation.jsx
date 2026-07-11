import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const RESTAURANTS = [
  { id: 'r1', name: 'Bawarchi', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', desc: 'Legendary biryani and authentic Hyderabadi flavors.' },
  { id: 'r2', name: 'Paradise', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', desc: 'World-famous biryani and royal Mughlai cuisine.' },
  { id: 'r3', name: 'Platform65', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80', desc: 'Unique train-themed dining with diverse Indian cuisine.' },
  { id: 'r4', name: 'Kritunga', image: 'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?auto=format&fit=crop&w=800&q=80', desc: 'Spicy, traditional Andhra and Rayalaseema delicacies.' },
  { id: 'r5', name: 'Devaraya', image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80', desc: 'Grand dining featuring heritage recipes and regal ambiance.' },
  { id: 'r6', name: 'Viyyalavari Kitchen', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', desc: 'Authentic Telugu cuisine with traditional homely flavors.' }
];

const EXPERIENCES = [
  { id: 'v1', name: 'Family Gathering', desc: 'Spacious seating for the whole family.', location: 'family', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
  { id: 'v2', name: 'Friends Night Out', desc: 'Vibrant atmosphere for drinks and sharing.', location: 'friends', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80' },
  { id: 'v3', name: 'Bar Dining', desc: 'Exclusive cocktails and high seating.', location: 'bar', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80' },
  { id: 'v4', name: 'Business Lunch', desc: 'Quiet, professional environment for meetings.', location: 'business', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80' },
  { id: 'v5', name: 'Sunday Brunch', desc: 'Bask in the sun with fresh pastries.', location: 'brunch', image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80' },
  { id: 'v6', name: 'Birthday Celebration', desc: 'Festive and lively setup for your special day.', location: 'birthday', image: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&w=800&q=80' },
  { id: 'v7', name: 'Sunset Dining', desc: 'Enjoy the golden hour on the terrace.', location: 'sunset', image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80' }
];

const LOC_LABELS = { family: 'Family', friends: 'Friends', bar: 'Bar', business: 'Business', brunch: 'Brunch', birthday: 'Birthday', sunset: 'Sunset' };
const MAT = (name, fill = 0, size = 20, color = 'inherit') => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: size, color }}>{name}</span>
);

export default function NewReservation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedExp, setSelectedExp] = useState(null);
  const [date, setDate] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [hoveredExp, setHoveredExp] = useState(null);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState('all');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!date) return toast.error('Please select a date.');
    setLoading(true);
    try {
      const res = await api.get(`/availability?date=${date}&guests=${partySize}`);
      // Removed the strict filter so users can pick any area (indoor, outdoor, bar) 
      // even if the selected experience suggests a specific area.
      setAvailableTables(res.data.tables || []);
      setStep(3);
      setSelectedTable(null);
      setSelectedSlot('');
      setSelectedAreaFilter('all');
    } catch (err) {
      toast.error('Failed to load availability');
    } finally { setLoading(false); }
  };

  const handleBook = async () => {
    if (!selectedTable || !selectedSlot) return toast.error('Select a table and time slot.');
    setLoading(true);
    try {
      const finalRequests = `[Venue: ${selectedExp.name}] ${specialRequests}`;
      await api.post('/reservations', { 
        tableId: selectedTable._id, date, timeSlot: selectedSlot, partySize, 
        specialRequests: finalRequests, restaurantName: selectedRestaurant?.name || 'Vindela Signature' 
      });
      toast.success('Reservation confirmed!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setLoading(false); }
  };

  return (
    <AppLayout>
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .exp-card img { transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .exp-card:hover img { transform: scale(1.1); }
        .exp-select-btn { transition: all 0.3s ease; }
        .exp-card:hover .exp-select-btn { background: var(--color-primary) !important; color: white !important; padding: 12px 24px !important; }
        .slot-pill:hover:not(:disabled) { border-color: var(--color-primary) !important; color: var(--color-primary) !important; }
      `}</style>
      
      <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
        
        {step === 0 && (
          <div style={{ animation: 'fade-in 0.6s ease-out' }}>
            <div style={{ marginBottom: 40, textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(129, 107, 31, 0.1)', color: 'var(--color-primary)', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                {MAT('storefront', 1, 16)} Our Locations
              </div>
              <h1 className="serif-heading" style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: 12, lineHeight: 1.1 }}>
                Select a Restaurant
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>
                Choose your preferred dining destination to begin your booking.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24, padding: '20px 0 60px 0' }}>
              {RESTAURANTS.map(res => (
                <div key={res.id} className="exp-card"
                  style={{ 
                    height: 340, borderRadius: 24, overflow: 'hidden', position: 'relative', cursor: 'pointer',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)',
                    transform: hoveredExp && hoveredExp !== res.id ? 'scale(0.97)' : 'scale(1)',
                    opacity: hoveredExp && hoveredExp !== res.id ? 0.7 : 1,
                    transition: 'all 0.4s ease'
                  }}
                  onMouseEnter={() => setHoveredExp(res.id)}
                  onMouseLeave={() => setHoveredExp(null)}
                  onClick={() => { setSelectedRestaurant(res); setStep(1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                >
                  <img src={res.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={res.name} />
                  <div style={{ 
                    position: 'absolute', inset: 0, 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' 
                  }}></div>
                  <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, color: 'white' }}>
                    <h3 className="serif-heading" style={{ fontSize: 28, margin: '0 0 8px 0', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{res.name}</h3>
                    <p style={{ opacity: 0.85, fontSize: 14, lineHeight: 1.5, margin: 0, marginBottom: 16 }}>{res.desc}</p>
                    <div className="exp-select-btn" style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, 
                      color: 'var(--color-primary)', background: '#ffffff', padding: '10px 20px', borderRadius: 100 
                    }}>
                      Select Location {MAT('arrow_forward', 0, 18)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ animation: 'fade-in 0.6s ease-out' }}>
            <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
               <button onClick={() => setStep(0)} style={{ background: 'var(--color-surface)', border: '1px solid rgba(129, 107, 31, 0.2)', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-main)', transition: 'all 0.2s' }}>
                 {MAT('arrow_back', 0, 20)}
               </button>
               <div>
                 <div style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Booking at {selectedRestaurant?.name}</div>
                 <h2 className="serif-heading" style={{ margin: 0, fontSize: 32, color: 'var(--color-text-main)', lineHeight: 1.1 }}>Select an Experience</h2>
               </div>
            </div>

            <div style={{ 
              display: 'flex', flexWrap: 'wrap', gap: 24, padding: '10px 0 60px 0'
            }}>
              {EXPERIENCES.map(exp => (
                <div key={exp.id} className="exp-card"
                  style={{ 
                    flex: '1 1 300px',
                    height: 320, borderRadius: 24, overflow: 'hidden', position: 'relative', cursor: 'pointer',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)',
                    transform: hoveredExp && hoveredExp !== exp.id ? 'scale(0.97)' : 'scale(1)',
                    opacity: hoveredExp && hoveredExp !== exp.id ? 0.7 : 1,
                    transition: 'all 0.4s ease'
                  }}
                  onMouseEnter={() => setHoveredExp(exp.id)}
                  onMouseLeave={() => setHoveredExp(null)}
                  onClick={() => { setSelectedExp(exp); setStep(2); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                >
                  <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', backdropFilter: 'blur(8px)', zIndex: 2 }}>
                    {LOC_LABELS[exp.location]}
                  </div>

                  <img src={exp.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={exp.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80'; }} />
                  
                  {/* Premium Full Gradient Overlay */}
                  <div style={{ 
                    position: 'absolute', inset: 0, 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
                    pointerEvents: 'none'
                  }}></div>

                  <div style={{ 
                    position: 'absolute', bottom: 24, left: 24, right: 24, 
                    color: 'white', display: 'flex', flexDirection: 'column', gap: 8
                  }}>
                    <h3 className="serif-heading" style={{ fontSize: 26, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{exp.name}</h3>
                    <p style={{ opacity: 0.85, fontSize: 14, lineHeight: 1.5, margin: 0 }}>
                      {exp.desc}
                    </p>
                    <div style={{ marginTop: 12 }}>
                      <div className="exp-select-btn" style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, 
                        color: 'var(--color-primary)', background: '#ffffff', padding: '10px 24px', borderRadius: 100 
                      }}>
                        Select {MAT('arrow_forward', 0, 18)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: 'fade-in 0.4s ease-out', maxWidth: 1000, margin: '0 auto' }}>
            <button className="btn btn-soft btn-sm" style={{ marginBottom: 24, borderRadius: 100, padding: '8px 16px' }} onClick={() => setStep(1)}>
              {MAT('arrow_back', 0, 16)} Choose a different area
            </button>
            <div style={{ display: 'flex', gap: 40, alignItems: 'stretch', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 360px', borderRadius: 32, overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', minHeight: 400, position: 'relative' }}>
                <img src={selectedExp?.image} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} alt={selectedExp?.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80'; }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}></div>
                <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, color: '#fff' }}>
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', backdropFilter: 'blur(4px)', display: 'inline-block', marginBottom: 12 }}>
                    {LOC_LABELS[selectedExp?.location]}
                  </div>
                  <h2 className="serif-heading" style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{selectedExp?.name}</h2>
                  <p style={{ opacity: 0.9, fontSize: 15, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{selectedExp?.desc}</p>
                </div>
              </div>

              <div style={{ flex: '1 1 400px', padding: '32px', background: 'var(--color-surface)', borderRadius: 32, border: '1px solid rgba(129, 107, 31, 0.1)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 className="serif-heading" style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-main)', marginBottom: 24 }}>Check Availability</h3>
                <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                      {MAT('calendar_today', 0, 16)} Select Date
                    </label>
                    <input type="date" className="form-input" min={new Date().toISOString().split('T')[0]} required value={date} onChange={e => setDate(e.target.value)} 
                           style={{ fontSize: 16, padding: '16px', borderRadius: 16, background: 'var(--color-background)', color: 'var(--color-text-main)', border: '1px solid rgba(129, 107, 31, 0.2)', width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                      {MAT('group', 0, 16)} Party Size
                    </label>
                    <select className="form-input" value={partySize} onChange={e => setPartySize(Number(e.target.value))}
                            style={{ fontSize: 16, padding: '16px', borderRadius: 16, background: 'var(--color-background)', color: 'var(--color-text-main)', border: '1px solid rgba(129, 107, 31, 0.2)', width: '100%' }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: 18, fontSize: 16, borderRadius: 16, display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
                    {loading ? 'Searching...' : 'Find Availability'} {MAT('arrow_forward', 0, 18, '#fff')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: 'fade-in 0.4s ease-out', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 24, borderBottom: '1px solid rgba(129, 107, 31, 0.1)', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 className="serif-heading" style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text-main)' }}>Select a Time</h2>
                <div style={{ fontSize: 15, color: 'var(--color-text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {MAT('event', 0, 16)} {new Date(date).toLocaleDateString()} &nbsp;·&nbsp; {MAT('group', 0, 16)} {partySize} Guests &nbsp;·&nbsp; {selectedExp?.name}
                </div>
              </div>
              <button className="btn btn-soft btn-sm" style={{ borderRadius: 100, padding: '8px 16px' }} onClick={() => setStep(2)}>{MAT('edit', 0, 16)} Modify</button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }} className="hide-scroll">
              {['all', 'indoor', 'outdoor', 'bar', 'private'].map(area => (
                <button key={area} onClick={() => setSelectedAreaFilter(area)}
                  style={{
                    padding: '8px 20px', borderRadius: 100, fontSize: 14, fontWeight: 600, textTransform: 'capitalize', whiteSpace: 'nowrap',
                    background: selectedAreaFilter === area ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: selectedAreaFilter === area ? '#fff' : 'var(--color-text-main)',
                    border: selectedAreaFilter === area ? '1px solid var(--color-primary)' : '1px solid rgba(129, 107, 31, 0.2)',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                  {area === 'all' ? 'All Areas' : LOC_LABELS[area]}
                </button>
              ))}
            </div>

            {availableTables.filter(t => selectedAreaFilter === 'all' || t.location === selectedAreaFilter).length === 0 ? (
              <div style={{ textAlign: 'center', padding: 80, background: 'var(--color-surface)', borderRadius: 32 }}>
                {MAT('search_off', 0, 64, 'var(--color-border)')}
                <h3 className="serif-heading" style={{ fontSize: 24, marginTop: 24, marginBottom: 8 }}>No tables available</h3>
                <div style={{ color: 'var(--color-text-muted)' }}>We're fully booked in this area on your selected date.</div>
                <button className="btn btn-soft" style={{ marginTop: 24, borderRadius: 100 }} onClick={() => setSelectedAreaFilter('all')}>View All Areas</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {availableTables.filter(t => selectedAreaFilter === 'all' || t.location === selectedAreaFilter).map(table => {
                  const isBooked = table.isFullyBooked;
                  const isTooSmall = table.capacity < partySize;
                  return (
                    <div key={table._id} style={{ 
                      background: 'var(--color-surface)', borderRadius: 24, padding: '24px 32px', 
                      border: selectedTable?._id === table._id ? '2px solid var(--color-primary)' : '1px solid rgba(129, 107, 31, 0.1)',
                      display: 'flex', flexDirection: 'column', gap: 20,
                      opacity: (isBooked || isTooSmall) ? 0.6 : 1, transition: 'all 0.3s'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(129, 107, 31, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                            {MAT('table_restaurant', 1, 28)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-text-main)' }}>Table {table.tableNumber}</div>
                            <div style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 2 }}>Up to {table.capacity} guests · {LOC_LABELS[table.location]}</div>
                          </div>
                        </div>
                        {isTooSmall ? (
                          <span style={{ background: '#f8ecec', color: '#ba1a1a', padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>Too Small ({table.capacity} max)</span>
                        ) : isBooked ? (
                          <span style={{ background: '#f8ecec', color: '#ba1a1a', padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>Fully Booked</span>
                        ) : null}
                      </div>

                      {(!isBooked && !isTooSmall) && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(129, 107, 31, 0.05)' }}>
                          {['11:00-13:00', '13:00-15:00', '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00'].map(slot => {
                            const isAvailable = table.availableSlots.includes(slot);
                            const isSelected = selectedTable?._id === table._id && selectedSlot === slot;
                            return (
                              <button key={slot} disabled={!isAvailable} className="slot-pill"
                                onClick={() => { setSelectedTable(table); setSelectedSlot(slot); window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'}); }}
                                style={{
                                  padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                                  background: isSelected ? 'var(--color-primary)' : isAvailable ? 'transparent' : 'rgba(129, 107, 31, 0.05)',
                                  color: isSelected ? '#fff' : isAvailable ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                  border: isSelected ? '2px solid var(--color-primary)' : isAvailable ? '2px solid rgba(129, 107, 31, 0.2)' : '2px solid rgba(129, 107, 31, 0.05)',
                                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                                  transition: 'all 0.2s',
                                  opacity: isAvailable ? 1 : 0.5
                                }}>
                                {slot.replace('-', ' - ')}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {selectedTable && selectedSlot && (
              <div style={{ marginTop: 32, padding: 40, background: 'var(--color-surface)', borderRadius: 32, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', border: '1px solid rgba(129, 107, 31, 0.1)', animation: 'fade-in 0.4s ease-out' }}>
                <h3 className="serif-heading" style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, color: 'var(--color-text-main)' }}>Finalize Booking</h3>
                <div style={{ marginBottom: 32 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{MAT('edit_note', 0, 16)} Special Requests (Optional)</label>
                  <textarea className="form-input" rows="3" placeholder="Dietary restrictions, anniversary notes, etc."
                    value={specialRequests} onChange={e => setSpecialRequests(e.target.value)}
                    style={{ fontSize: 15, padding: 16, borderRadius: 16, background: 'var(--color-background)', border: '1px solid rgba(129, 107, 31, 0.2)' }}></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, paddingTop: 24, borderTop: '1px solid rgba(129, 107, 31, 0.1)' }}>
                  <div style={{ fontSize: 16, color: 'var(--color-text-main)' }}>
                    Reserving <strong>Table {selectedTable.tableNumber}</strong> at <strong>{selectedSlot.split('-')[0]}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-soft" style={{ borderRadius: 100, padding: '12px 24px' }} onClick={() => { setSelectedTable(null); setSelectedSlot(''); }}>Cancel</button>
                    <button className="btn btn-primary" style={{ borderRadius: 100, padding: '12px 32px', fontSize: 16 }} onClick={handleBook} disabled={loading}>
                      {loading ? 'Confirming...' : 'Confirm Reservation'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}