import { useAppSelector } from "../app/hooks";
import { Navigate, Outlet } from 'react-router-dom';

interface RequireRoleProps {
  role: 'USER' | 'ADMIN';
}

export default function RequireRole({ role }: RequireRoleProps) {
  const {role: userRole} = useAppSelector(state => state.auth);
  
  if (userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
