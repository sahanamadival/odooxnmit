import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login with:', { email, password: '***' });
      
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', response.data);
      
      const { token } = response.data;

      // Create user data from the token payload or use email
      const userData = {
        id: email, // Use email as ID for now
        email: email,
        username: email.split('@')[0], // Extract username from email
        role: 'User',
        loginTime: new Date().toISOString()
      };

      console.log('👤 Setting user data:', userData);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      console.log('✅ Login successful, user set in context');
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Check credentials.'
      };
    }
  };

  // Signup function
  const signup = async (signupData) => {
    try {
      console.log('📝 Attempting signup with:', { 
        username: signupData.userId, 
        email: signupData.email, 
        password: '***' 
      });
      
      const payload = {
        username: signupData.userId,
        email: signupData.email,
        password: signupData.password,
        role: signupData.role
      };

      const response = await api.post('/auth/register', payload);
      console.log('✅ Registration successful:', response.data);

      // Auto-login after successful registration
      console.log('🔄 Auto-logging in after registration...');
      return await login(signupData.email, signupData.password);
    } catch (error) {
      console.error('❌ Signup error:', error.response?.data || error);
      let errorMsg = 'Signup failed.';
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error; // friendly backend message
      }
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
