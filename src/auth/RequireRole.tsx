import { Navigate, Outlet } from 'react-router-dom';

interface RequireRoleProps {
  role: 'USER' | 'ADMIN';
}

export default function RequireRole({ role }: RequireRoleProps) {
  // TODO: Connect to Redux auth state to get user role
  // This component should check if user has required role
  
  const userRole = 'ADMIN'; // TODO: Get from auth state
  
  if (userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
