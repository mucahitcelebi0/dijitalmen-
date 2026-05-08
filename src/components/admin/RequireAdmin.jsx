import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

export default function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
