import { Navigate, Outlet } from 'react-router-dom';
// TODO: Connect to Redux auth state or context
// This component should check if JWT exists and is valid

export default function RequireAuth() {
  // Placeholder: Replace with actual auth check from Redux or context
  const isAuthenticated = true; // TODO: Get from auth state
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
