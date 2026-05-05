import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Loader = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
    <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">Loading...</div>
  </div>
);

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
