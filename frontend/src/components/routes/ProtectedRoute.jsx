import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    // Return nothing or a spinner while determining session status
    return null; 
  }

  if (!isAuthenticated) {
    const redirectPath = adminOnly ? '/admin' : '/login';
    return <Navigate to={redirectPath} replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && user?.role !== 'ADMIN' && user?.role !== 'ADMINISTRATOR') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
