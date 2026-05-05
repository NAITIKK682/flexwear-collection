import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // 1. Loading state handle (prevents redirect loops & blank screens)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Verifying access...
      </div>
    );
  }

  // 2. Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 3. Admin check (role already normalized to lowercase in AuthContext)
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 4. Render protected content
  return children;
}

export default ProtectedRoute;