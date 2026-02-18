
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase';
import { loginSuccess } from '../../features/authSlice';
import api from '../../utils/api';

function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginWithGoogle = async () => {
    try {
      // 1️⃣ Firebase Login
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      // 2️⃣ Send token to backend admin login endpoint
        const response = await api.post('/admin/login', {}, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

      if (response.status !== 200 || !response.data || !response.data.user) {
        throw new Error('Admin backend login failed');
      }

        const data = response.data;
      // 3️⃣ Dispatch to Redux with ADMIN role
      dispatch(
        loginSuccess({
          user: {
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            regNo: data.user.regNo,
            branch: data.user.branch,
            githubLink: data.user.githubLink || '',
            leetcodeLink: data.user.leetcodeLink || '',
            portfolioLink: data.user.portfolioLink || '',
            selectedDomainIds: data.user.selectedDomainIds || [],
          },
          token: idToken,
          role: 'ADMIN',
          profileComplete: true, // or set as needed
        })
      );

      // 4️⃣ Store token
      localStorage.setItem('token', idToken);

      // 5️⃣ Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Admin Login Error:', error);
      alert('Admin login failed. Please try again or contact support.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <button
          onClick={loginWithGoogle}
          className="inline-block rounded-lg bg-primary px-8 py-3 font-medium text-black text-3xl transition hover:scale-105 hover:bg-white"
        >
          Login with Google (Admin)
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
