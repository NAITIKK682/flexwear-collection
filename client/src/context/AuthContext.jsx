import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ GET CURRENT USER
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    console.log('🔍 fetchUser: Token exists?', !!token);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await authService.getMe();
      const userData = res?.user;
      const normalizedUser = userData ? { ...userData, role: userData.role?.toLowerCase() } : null;
      console.log('🔍 AUTH RESPONSE:', res);
      console.log('🔍 NORMALIZED USER ROLE:', normalizedUser?.role);
      setUser(normalizedUser);
      setError(null);
    } catch (err) {
      console.log('❌ fetchUser error:', err.response?.status, err.response?.data?.message);
      setUser(null);
      localStorage.removeItem('token'); // Clear invalid token
      if (err.response?.status !== 401) {
        setError(err?.response?.data?.message || err.message);
      } else {
        console.log('🔐 401 - cleared token & logged out');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOGIN
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      setUser(res?.user || null);
      setError(null);
      return res;
    } catch (err) {
      const message = err?.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ REGISTER
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      setUser(res?.user || null);
      setError(null);
      return res;
    } catch (err) {
      const message = err?.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOGOUT
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setError(null);
      navigate('/');
    }
  };

  // ✅ UPDATE PROFILE
  const updateProfile = async (formData) => {
    try {
      const res = await authService.updateProfile(formData);
      setUser(res?.user || null);
      setError(null);
      return res;
    } catch (err) {
      const message = err?.response?.data?.message || err.message;
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}