import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ adminOnly }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

export const PublicRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return <Outlet />;
};