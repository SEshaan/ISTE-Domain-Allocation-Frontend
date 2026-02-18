import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3500';
if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('VITE_API_URL is not set. Defaulting to http://localhost:3500');
}

const api = axios.create({
  baseURL: baseURL,
});


api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    config.headers['x-api-key'] = 'e854c681c0acc98dfb3a93686aeb9c3907198bddec47d88dc46c3a15856ff7b0';
    // Attach token from localStorage if available
    const token = localStorage.getItem('token');
    if (token && window.location.pathname.includes('/admin') && window.location.pathname !== '/adminLogin') {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
