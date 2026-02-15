import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Login() {
  const navigate = useNavigate();

  // TODO: Implement OAuth login flow
  useEffect(() => {
    // Redirect to OAuth provider
    // window.location.href = 'https://oauth-provider.com/auth?client_id=your-client-id';
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Login with OAuth</h1>
        <p className="mb-6">Redirecting to authentication provider...</p>
      </div>
    </div>
  );
}

export default Login;
