import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sync token changes to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  // Sync user changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Check auth session on startup
  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data && response.data.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.warn('Authentication token check failed:', err.message);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please verify credentials.';
      setAuthError(message);
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(message);
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore network errors on logout
      console.warn('Logout API error:', err.message);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    loading,
    authError,
    login,
    register,
    logout,
    updateUser,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
