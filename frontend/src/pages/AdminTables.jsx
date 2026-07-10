import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const MAT = (name, fill = 0, size = 18, color = '') => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: size, color }}>{name}</span>
);

const LOC_IMAGES = {
  indoor: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  outdoor: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80',
  bar: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80',
  private: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&w=800&q=80'
};

const EXPERIENCES_LIST = [
  { id: 'v1', name: 'Family Gathering', desc: 'Spacious seating for the whole family.', location: 'indoor' },
  { id: 'v2', name: 'Romantic Anniversary', desc: 'Intimate, candlelit setting perfect for two.', location: 'private' },
  { id: 'v3', name: 'Friends Night Out', desc: 'Vibrant atmosphere for drinks and sharing.', location: 'bar' },
  { id: 'v4', name: 'Business Lunch', desc: 'Quiet, professional environment for meetings.', location: 'indoor' },
  { id: 'v5', name: 'Sunday Brunch', desc: 'Bask in the sun with fresh pastries.', location: 'outdoor' },
  { id: 'v6', name: 'Birthday Celebration', desc: 'Festive and lively setup for your special day.', location: 'indoor' },
  { id: 'v7', name: 'The Onyx Bar', desc: 'Exclusive cocktails and high seating.', location: 'bar' },
  { id: 'v8', name: 'Sunset Dining', desc: 'Enjoy the golden hour on the terrace.', location: 'outdoor' },
  { id: 'v9', name: 'The Grand Hall', desc: 'Our signature dining with opulent decor.', location: 'indoor' },
  { id: 'v10', name: 'Chef\'s Tasting', desc: 'A culinary journey near the open kitchen.', location: 'indoor' },
  { id: 'v11', name: 'Late Night Lounge', desc: 'Relaxed vibes with premium spirits.', location: 'bar' },
  { id: 'v12', name: 'Executive Retreat', desc: 'Absolute privacy for VIP guests.', location: 'private' }
];

export default function AdminTables() {
  const [tables, setTables] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({ tableNumber: '', capacity: 4, location: 'indoor' });
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => { load() }, []);
  const load = () => api.get('/tables').then(res => setTables(res.data.tables.sort((a, b) => a.tableNumber - b.tableNumber))).catch(console.error);

  const openModal = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({ tableNumber: table.tableNumber, capacity: table.capacity, location: table.location });
    } else {
      setEditingTable(null);
      setFormData({ tableNumber: '', capacity: 4, location: 'indoor' });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingTable) {
        await api.put(`/tables/${editingTable._id}`, { capacity: Number(formData.capacity), location: formData.location });
        toast.success('Table updated');
      } else {
        await api.post('/tables', { tableNumber: Number(formData.tableNumber), capacity: Number(formData.capacity), location: formData.location });
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
  }, { indoor: [], outdoor: [], bar: [], private: [] });

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="serif-heading" style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-text-main)', marginBottom: 8 }}>Venue Layout</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Configure and manage your dining areas and table capacities.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-surface)', padding: '10px 20px', borderRadius: 100, border: '1px solid rgba(129, 107, 31, 0.15)', minWidth: 300 }}>
            {MAT('search', 0, 20, 'var(--color-primary)')}
            <input 
              type="text" 
              placeholder="Search tables, zones, or experiences..." 
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

          <button className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: 100, fontSize: 14 }} onClick={() => openModal()}>
            {MAT('add', 0, 18)} Add New Table
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {Object.entries(groupedTables).map(([location, locTables]) => {
          if (locTables.length === 0) return null;
          return (
            <div key={location} style={{ background: 'var(--color-surface)', borderRadius: 32, overflow: 'hidden', border: '1px solid rgba(129, 107, 31, 0.1)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 160, position: 'relative' }}>
                <img src={LOC_IMAGES[location]} alt={location} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2))' }}></div>
                <div style={{ position: 'absolute', bottom: 24, left: 32, maxWidth: '80%' }}>
                  <div style={{ color: 'var(--color-primary)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>{location} Zone</div>
                  <h2 className="serif-heading" style={{ color: '#fff', fontSize: 32, fontWeight: 800, textTransform: 'capitalize', marginBottom: 8, lineHeight: 1.1 }}>{location} Dining</h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.5, margin: 0 }}>
                    <strong style={{ color: 'var(--color-primary)' }}>Experiences:</strong> {EXPERIENCES_LIST.filter(e => e.location === location).map(e => e.name).join(' • ')}
                  </p>
                </div>
              </div>
              
              <div style={{ padding: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24, background: 'var(--color-background)' }}>
                {locTables.map(table => (
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

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
          <div className="v-card" style={{ width: '100%', maxWidth: 440, background: 'var(--color-surface)', borderRadius: 32, padding: 40, boxShadow: '0 24px 48px -12px rgba(0,0,0,0.3)' }}>
            <h2 className="serif-heading" style={{ fontSize: 28, marginBottom: 8, color: 'var(--color-text-main)' }}>
              {editingTable ? `Edit Table T${editingTable.tableNumber}` : 'Add New Table'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>Configure the table specifications below.</p>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
                  <option value="indoor">Indoor Dining</option>
                  <option value="outdoor">Outdoor Terrace</option>
                  <option value="bar">The Bar</option>
                  <option value="private">Private Room</option>
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