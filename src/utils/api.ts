import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3500',
});


api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    config.headers['x-api-key'] = 'e854c681c0acc98dfb3a93686aeb9c3907198bddec47d88dc46c3a15856ff7b0';
    // Attach token from localStorage if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
