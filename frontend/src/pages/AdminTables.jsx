import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const MAT = (name, fill = 0, size = 18, color = '') => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: size, color }}>{name}</span>
);

const LOC_IMAGES = {
  family: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  friends: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
  bar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  business: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
  brunch: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80',
  birthday: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&w=800&q=80',
  sunset: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80'
};

const ZONE_LABELS = {
  family: 'Family Gathering',
  friends: 'Friends Night Out',
  bar: 'Bar Dining',
  business: 'Business Lunch',
  brunch: 'Sunday Brunch',
  birthday: 'Birthday Celebration',
  sunset: 'Sunset Dining'
};

const EXPERIENCES_LIST = [
  { id: 'v1', name: 'Family Gathering', desc: 'Spacious seating for the whole family.', location: 'family' },
  { id: 'v2', name: 'Friends Night Out', desc: 'Vibrant atmosphere for drinks and sharing.', location: 'friends' },
  { id: 'v3', name: 'Bar Dining', desc: 'Exclusive cocktails and high seating.', location: 'bar' },
  { id: 'v4', name: 'Business Lunch', desc: 'Quiet, professional environment for meetings.', location: 'business' },
  { id: 'v5', name: 'Sunday Brunch', desc: 'Bask in the sun with fresh pastries.', location: 'brunch' },
  { id: 'v6', name: 'Birthday Celebration', desc: 'Festive and lively setup for your special day.', location: 'birthday' },
  { id: 'v7', name: 'Sunset Dining', desc: 'Enjoy the golden hour on the terrace.', location: 'sunset' }
];

const RESTAURANTS = [
  { id: 'r1', name: 'Bawarchi', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', desc: 'Legendary biryani and authentic Hyderabadi flavors.' },
  { id: 'r2', name: 'Paradise', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', desc: 'World-famous biryani and royal Mughlai cuisine.' },
  { id: 'r3', name: 'Platform65', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80', desc: 'Unique train-themed dining with diverse Indian cuisine.' },
  { id: 'r4', name: 'Kritunga', image: 'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?auto=format&fit=crop&w=800&q=80', desc: 'Spicy, traditional Andhra and Rayalaseema delicacies.' },
  { id: 'r5', name: 'Devaraya', image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80', desc: 'Grand dining featuring heritage recipes and regal ambiance.' },
  { id: 'r6', name: 'Viyyalavari Kitchen', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', desc: 'Authentic Telugu cuisine with traditional homely flavors.' }
];

export default function AdminTables() {
  const [tables, setTables] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({ tableNumber: '', capacity: 4, location: 'indoor', restaurantName: 'Bawarchi' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRestaurant, setFilterRestaurant] = useState('Bawarchi');
  
  useEffect(() => { load() }, []);
  const load = () => api.get('/tables').then(res => setTables(res.data.tables.sort((a, b) => a.tableNumber - b.tableNumber))).catch(console.error);

  const openModal = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({ tableNumber: table.tableNumber, capacity: table.capacity, location: table.location, restaurantName: table.restaurantName || 'Vindela Signature' });
    } else {
      setEditingTable(null);
      setFormData({ tableNumber: '', capacity: 4, location: 'indoor', restaurantName: filterRestaurant });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingTable) {
        await api.put(`/tables/${editingTable._id}`, { capacity: Number(formData.capacity), location: formData.location, restaurantName: formData.restaurantName });
        toast.success('Table updated');
      } else {
        await api.post('/tables', { tableNumber: Number(formData.tableNumber), capacity: Number(formData.capacity), location: formData.location, restaurantName: formData.restaurantName });
        toast.success('Table added');
      }
      setModalOpen(false);
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to save table'); }
  };

  const handleToggleActive = async (table) => {
    try {
      await api.put(`/tables/${table._id}`, { isActive: !table.isActive });
      toast.success(`Table ${table.tableNumber} is now ${!table.isActive ? 'Active' : 'Inactive'}`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update table');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return;
    try {
      await api.delete(`/tables/${id}`);
      toast.success('Table deleted');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete table');
    }
  };

  const filteredTables = tables.filter(t => {
    // Filter by selected restaurant (fallback to Bawarchi for legacy tables)
    if ((t.restaurantName || 'Bawarchi') !== filterRestaurant) return false;
    
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    
    // Check table number and capacity
    if (t.tableNumber.toString().includes(query)) return true;
    if (t.capacity.toString().includes(query)) return true;
    
    // Check location / zone
    if (t.location.toLowerCase().includes(query)) return true;
    
    // Check experience name or description
    const exps = EXPERIENCES_LIST.filter(e => e.location === t.location);
    if (exps.some(e => e.name.toLowerCase().includes(query) || e.desc.toLowerCase().includes(query))) {
      return true;
    }
    
    return false;
  });

  const groupedTables = filteredTables.reduce((acc, t) => {
    if (!acc[t.location]) acc[t.location] = [];
    acc[t.location].push(t);
    return acc;
  }, { family: [], friends: [], bar: [], business: [], brunch: [], birthday: [], sunset: [] });

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="serif-heading" style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-text-main)', marginBottom: 8 }}>Venue Layout</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Configure and manage your dining areas and table capacities.</p>
        </div>
      </div>
      {/* Drill-down View Logic */}
      {!filterRestaurant ? (
        <div style={{ marginBottom: 40 }}>
          <h2 className="serif-heading" style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text-main)', marginBottom: 24 }}>Select a Venue to Manage</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {RESTAURANTS.map(rest => (
              <div 
                key={rest.id} 
                onClick={() => setFilterRestaurant(rest.name)}
                className="v-card"
                style={{ 
                  height: 240, borderRadius: 24, overflow: 'hidden', position: 'relative', cursor: 'pointer',
                  transition: 'all 0.3s ease', border: '1px solid rgba(129, 107, 31, 0.1)'
                }}
              >
                <img src={rest.image} alt={rest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 100%)' }}></div>
                <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
                  <h3 className="serif-heading" style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{rest.name}</h3>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {MAT('arrow_forward', 0, 18, 'var(--color-primary)')}
                    <span>Click to manage tables</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button 
            className="btn btn-soft" 
            style={{ marginBottom: 32, padding: '8px 16px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14 }}
            onClick={() => setFilterRestaurant('')}
          >
            {MAT('arrow_back', 0, 18)} Back to Venues
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <h2 className="serif-heading" style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-text-main)' }}>{filterRestaurant} Layout</h2>
            {/* Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-surface)', padding: '10px 20px', borderRadius: 100, border: '1px solid rgba(129, 107, 31, 0.15)', minWidth: 300 }}>
              {MAT('search', 0, 20, 'var(--color-primary)')}
              <input 
                type="text" 
                placeholder="Search tables or zones..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: 'var(--color-text-main)', width: '100%' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 0 }}>
                  {MAT('close', 0, 16)}
                </button>
              )}
            </div>
          </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {Object.entries(groupedTables).map(([location, locTables]) => {
          return (
            <div key={location} style={{ background: 'var(--color-surface)', borderRadius: 32, overflow: 'hidden', border: '1px solid rgba(129, 107, 31, 0.1)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 160, position: 'relative' }}>
                <img src={LOC_IMAGES[location]} alt={location} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2))' }}></div>
                <div style={{ position: 'absolute', bottom: 24, left: 32, maxWidth: '80%' }}>
                  <div style={{ color: 'var(--color-primary)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>{location} Zone</div>
                  <h2 className="serif-heading" style={{ color: '#fff', fontSize: 32, fontWeight: 800, textTransform: 'capitalize', marginBottom: 8, lineHeight: 1.1 }}>{ZONE_LABELS[location]}</h2>
                </div>
                <button className="btn btn-primary" style={{ position: 'absolute', right: 32, bottom: 24, padding: '10px 20px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }} onClick={() => { setFormData({ ...formData, location }); setModalOpen(true); }}>
                  {MAT('add', 0, 18)} Add Table Here
                </button>
              </div>
              
              <div style={{ padding: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24, background: 'var(--color-background)' }}>
                {locTables.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
                    {MAT('table_restaurant', 0, 48, 'var(--color-border)')}
                    <div style={{ marginTop: 16, fontSize: 16, fontWeight: 600 }}>No tables found in {location} zone.</div>
                    <div style={{ fontSize: 14 }}>Click "Add Table Here" to configure the layout.</div>
                  </div>
                ) : locTables.map(table => (
                  <div key={table._id} style={{ 
                    background: 'var(--color-surface)', borderRadius: 24, padding: 24,
                    border: '1px solid', borderColor: table.isActive ? 'rgba(129, 107, 31, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    opacity: table.isActive ? 1 : 0.7,
                    boxShadow: '0 8px 30px -10px rgba(0,0,0,0.05)',
                    position: 'relative', display: 'flex', flexDirection: 'column'
                  }}>
                    <div style={{ position: 'absolute', top: 16, right: 16 }}>
                      <span className={`badge ${table.isActive ? 'badge-confirmed' : 'badge-cancelled'}`} style={{ padding: '4px 10px', fontSize: 10 }}>{table.isActive ? 'Active' : 'Offline'}</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(129, 107, 31, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800 }}>
                        T{table.tableNumber}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: 2 }}>Capacity</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {MAT('group',1,18,'var(--color-primary)')} Up to {table.capacity}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
                      <button className="btn btn-soft btn-sm" style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', fontSize: 11, fontWeight: 600, border: 'none' }} onClick={() => openModal(table)}>
                        {MAT('edit', 0, 18, 'var(--color-text-main)')} Edit
                      </button>
                      <button className="btn btn-soft btn-sm" style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', fontSize: 11, fontWeight: 600, border: 'none' }} onClick={() => handleToggleActive(table)}>
                        {MAT(table.isActive ? 'visibility_off' : 'visibility', 0, 18, 'var(--color-text-main)')} {table.isActive ? 'Hide' : 'Show'}
                      </button>
                      <button className="btn btn-soft btn-sm" style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', fontSize: 11, fontWeight: 600, color: '#ef4444', border: 'none' }} onClick={() => handleDelete(table._id)}>
                        {MAT('delete', 0, 18, '#ef4444')} Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      </div>
      )}

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
          <div className="v-card" style={{ width: '100%', maxWidth: 440, background: 'var(--color-surface)', borderRadius: 32, padding: 40, boxShadow: '0 24px 48px -12px rgba(0,0,0,0.3)' }}>
            <h2 className="serif-heading" style={{ fontSize: 28, marginBottom: 8, color: 'var(--color-text-main)' }}>
              {editingTable ? `Edit Table T${editingTable.tableNumber}` : 'Add New Table'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>Configure the table specifications below.</p>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Restaurant</label>
                <select className="v-input" value={formData.restaurantName} onChange={e => setFormData({...formData, restaurantName: e.target.value})} style={{ appearance: 'none', backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPositionX: 'calc(100% - 16px)', backgroundPositionY: 'center' }}>
                  <option value="Bawarchi">Bawarchi</option>
                  <option value="Paradise">Paradise</option>
                  <option value="Platform65">Platform65</option>
                  <option value="Kritunga">Kritunga</option>
                  <option value="Devaraya">Devaraya</option>
                  <option value="Viyyalavari Kitchen">Viyyalavari Kitchen</option>
                  <option value="Vindela Signature">Vindela Signature</option>
                </select>
              </div>
              {!editingTable && (
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Table Number</label>
                  <input type="number" className="v-input" required value={formData.tableNumber} onChange={e => setFormData({...formData, tableNumber: e.target.value})} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Maximum Capacity</label>
                <input type="number" className="v-input" required min="1" max="20" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zone Location</label>
                <select className="v-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ appearance: 'none', backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPositionX: 'calc(100% - 16px)', backgroundPositionY: 'center' }}>
                  <option value="family">Family Gathering</option>
                  <option value="friends">Friends Night Out</option>
                  <option value="bar">Bar Dining</option>
                  <option value="business">Business Lunch</option>
                  <option value="brunch">Sunday Brunch</option>
                  <option value="birthday">Birthday Celebration</option>
                  <option value="sunset">Sunset Dining</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                <button type="button" className="btn btn-soft" style={{ flex: 1, padding: 16, borderRadius: 100 }} onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: 16, borderRadius: 100 }}>{editingTable ? 'Save Changes' : 'Create Table'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}