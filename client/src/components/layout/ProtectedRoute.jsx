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

  // 🔍 DEBUG LOGS
  console.log('🔒 ProtectedRoute DEBUG:', { loading, isAuthenticated, user, hasToken: !!localStorage.getItem('token'), role: user?.role });
  
  if (loading) {
    console.log('⏳ ProtectedRoute: Loading...');
    return <Loader />;
  }

  if (!isAuthenticated) {
    console.log('🚫 ProtectedRoute: Not authenticated → /auth');
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requireAdmin) {
    const userRole = user?.role?.trim().toLowerCase();
    console.log('👑 ProtectedRoute: Admin check', { userRole, isAdmin: userRole === 'admin' });
    if (userRole !== 'admin') {
      console.log('❌ ProtectedRoute: Not admin → /');
      return <Navigate to="/" replace />;
    }
  }

  console.log('✅ ProtectedRoute: Access granted');
  return children;
}
