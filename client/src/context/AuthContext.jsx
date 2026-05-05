import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await authService.getMe();
      setUser(response.data?.data || response.data?.user || null);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err?.response?.data?.message || err.message || 'Unable to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const currentUser = response.data?.data || response.data?.user || null;
      setUser(currentUser);
      setError(null);
      return response;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      const registeredUser = response.data?.data || response.data?.user || null;
      setUser(registeredUser);
      setError(null);
      return response;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      setError(null);
      navigate('/');
    }
  };

  const updateProfile = async (formData) => {
    try {
      const response = await authService.updateProfile(formData);
      const updatedUser = response.data?.data || response.data?.user || null;
      setUser(updatedUser);
      setError(null);
      return response;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Update failed';
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
        isAuthenticated: Boolean(user),
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

