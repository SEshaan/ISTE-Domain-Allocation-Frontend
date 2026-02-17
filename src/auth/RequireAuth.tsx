import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

export default function RequireAuth() {
  const auth = useAppSelector((state) => state.auth);
  const { isAuthenticated } = auth;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
