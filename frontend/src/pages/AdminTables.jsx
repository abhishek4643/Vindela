import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AdminTables() {
  const [tables, setTables] = useState([]);
  
  useEffect(() => { load() }, []);
  const load = () => api.get('/tables').then(res => setTables(res.data.tables)).catch(console.error);

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Manage Tables</h1>
      </div>

      <div className="table-map">
        {tables.map(table => (
          <div key={table._id} className="table-tile" style={{ opacity: table.isActive ? 1 : 0.5 }}>
            <div className="table-tile-number">{table.tableNumber}</div>
            <div className="table-tile-cap">Up to {table.capacity} Guests</div>
            <div className="table-tile-loc">{table.location}</div>
            <div className="table-tile-actions">
              <span className={`badge ${table.isActive ? 'badge-confirmed' : 'badge-cancelled'}`}>{table.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}