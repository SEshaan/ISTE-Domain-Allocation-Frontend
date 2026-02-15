import { Navigate, Outlet } from 'react-router-dom';
// TODO: Optional domain-level admin check for additional security

export default function RequireAdmin() {
  // Placeholder: Replace with actual admin domain check
  // This checks if user is both ADMIN role and whitelisted admin domain
  
  const isAdmin = false; // TODO: Get from auth state
  const isWhitelistedDomain = true; // TODO: Check admin domain whitelist
  
  if (!isAdmin || !isWhitelistedDomain) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
