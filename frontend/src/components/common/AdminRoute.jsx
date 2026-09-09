import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-headline text-xl animate-pulse">
          VERIFYING ACCESS...
        </div>
      </div>
    );
  }

  // If not authenticated or role is not admin, redirect to admin login
  if (!isAuthenticated || !isAdmin || user?.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
