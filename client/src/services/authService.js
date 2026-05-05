import api from './api';

const login = async (credentials) => {
  return api.post('/auth/login', credentials);
};

const register = async (userData) => {
  return api.post('/auth/register', userData);
};

const logout = async () => {
  return api.post('/auth/logout');
};

const getMe = async () => {
  return api.get('/auth/me');
};

const updateProfile = async (formData) => {
  return api.put('/auth/me', formData);
};

const changePassword = async (passwords) => {
  return api.put('/auth/change-password', passwords);
};

export default {
  login,
  register,
  logout,
  getMe,
  updateProfile,
  changePassword
};
