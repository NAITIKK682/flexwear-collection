import { Navigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // 🔍 DEBUG LOGS
  useEffect(() => {
    console.log('🛡️ === ProtectedRoute Check ===');
    console.log('loading:', loading);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('user.role:', user?.role);
    console.log('requireAdmin:', requireAdmin);
    console.log('role === "admin":', user?.role === 'admin');
    console.log('role check result:', user?.role?.toLowerCase()?.trim() === 'admin');
    console.log('===========================');
  }, [user, isAuthenticated, loading, requireAdmin]);

  // 1. Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        🔐 Loading...
      </div>
    );
  }

  // 2. Not authenticated
  if (!isAuthenticated || !user) {
    console.warn('🚫 NOT AUTHENTICATED → Redirect to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 3. Admin check (with normalization)
  if (requireAdmin) {
    const isAdmin = user?.role?.toLowerCase()?.trim() === 'admin';
    console.log(' isAdmin check:', isAdmin, '(role was:', user?.role + ')');
    
    if (!isAdmin) {
      console.warn('🚫 NOT ADMIN → Redirect to /');
      return <Navigate to="/" replace />;
    }
  }

  console.log('✅ Access granted!');
  return children;
}

export default ProtectedRoute;