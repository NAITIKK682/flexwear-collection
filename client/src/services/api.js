import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🚀 API Request:', config.method.toUpperCase(), config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
(response) => {
    console.log('✅ API Response:', response.status, response.config?.url);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      console.log('🔑 Token cleared due to 401 - handle in React');
    }
    const message = error.response?.data?.message || error.message || 'An error occurred';
    error.message = message;
    console.log('❌ API Error:', error.response?.status || 'Network Error', error.config?.url || 'unknown');
    return Promise.reject(error);
  }
);

export default api;

