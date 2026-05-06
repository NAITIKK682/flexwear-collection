import api from './api';

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const logout = async () => {
  // We call the backend to invalidate the session if necessary
  const response = await api.post('/auth/logout');
  return response.data;
};

const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

const updateProfile = async (formData) => {
  const response = await api.put('/auth/me', formData);
  return response.data;
};

const changePassword = async (passwords) => {
  const response = await api.put('/auth/change-password', passwords);
  return response.data;
};

// Exporting as default to match your AuthContext imports
export default {
  login,
  register,
  logout,
  getMe,
  updateProfile,
  changePassword
};