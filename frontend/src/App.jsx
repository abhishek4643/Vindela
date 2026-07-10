import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import NewReservation from './pages/NewReservation';
import AdminDashboard from './pages/AdminDashboard';
import AdminReservations from './pages/AdminReservations';
import AdminTables from './pages/AdminTables';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#f6fafe',
              color: '#171c1f',
              boxShadow: '-8px -8px 20px #ffffff, 8px 8px 20px #cbd5e1',
              borderRadius: 12,
              fontSize: 14,
              fontFamily: 'Geist, sans-serif',
              border: 'none',
            },
            success: { iconTheme: { primary: '#00687a', secondary: '#f6fafe' } },
            error: { iconTheme: { primary: '#ba1a1a', secondary: '#f6fafe' } },
          }}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/reserve" element={<NewReservation />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
            <Route path="/admin/tables" element={<AdminTables />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}