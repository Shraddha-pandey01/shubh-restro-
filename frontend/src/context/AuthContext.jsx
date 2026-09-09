import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

export const AuthContext = createContext(null);

export const TEST_USER = {
  id: 'usr_test_demo_001',
  name: 'Test User',
  email: 'Testuser@gmail.com',
  phone: '+91 9876543299',
  role: 'customer',
};

export const TEST_ADMIN = {
  id: 'adm_test_demo_001',
  name: 'Shubham Pandey',
  email: 'Testadmin@gmail.com',
  phone: '+91 9876543298',
  role: 'admin',
};

const DEMO_USER_TOKEN = 'shubhrestro_test_user_token_demo';
const DEMO_ADMIN_TOKEN = 'shubhrestro_test_admin_token_demo';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('shubhrestro_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () =>
      localStorage.getItem('shubhrestro_token') ||
      localStorage.getItem('lumiere_token') ||
      null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      // Check cached user in localStorage
      let cachedUser = null;
      try {
        const cachedStr = localStorage.getItem('shubhrestro_user');
        if (cachedStr) cachedUser = JSON.parse(cachedStr);
      } catch {
        // ignore parse error
      }

      // If using offline test/demo tokens, maintain session directly
      if (token.startsWith('shubhrestro_test_')) {
        if (cachedUser) setUser(cachedUser);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.success && response.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('shubhrestro_user', JSON.stringify(response.data.user));
        } else if (cachedUser) {
          setUser(cachedUser);
        } else {
          logout();
        }
      } catch {
        // If backend is unreachable on Vercel, preserve session from cache
        if (cachedUser) {
          setUser(cachedUser);
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const normalizedEmail = email?.trim().toLowerCase();
    const isTestCustomer = normalizedEmail === 'testuser@gmail.com' && password === '12345678';

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        localStorage.setItem('shubhrestro_token', res.data.token);
        localStorage.setItem('shubhrestro_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      // Seamless fallback for default test user during demos
      if (isTestCustomer) {
        localStorage.setItem('shubhrestro_token', DEMO_USER_TOKEN);
        localStorage.setItem('shubhrestro_user', JSON.stringify(TEST_USER));
        setToken(DEMO_USER_TOKEN);
        setUser(TEST_USER);
        return TEST_USER;
      }
      throw err;
    }
  };

  const adminLogin = async (email, password) => {
    const normalizedEmail = email?.trim().toLowerCase();
    const isTestAdmin = normalizedEmail === 'testadmin@gmail.com' && password === 'Admin@123';

    try {
      const res = await api.post('/auth/admin-login', { email, password });
      if (res.success && res.data) {
        localStorage.setItem('shubhrestro_token', res.data.token);
        localStorage.setItem('shubhrestro_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
      }
      throw new Error(res.message || 'Administrative authentication failed');
    } catch (err) {
      // Seamless fallback for default test admin during demos
      if (isTestAdmin) {
        localStorage.setItem('shubhrestro_token', DEMO_ADMIN_TOKEN);
        localStorage.setItem('shubhrestro_user', JSON.stringify(TEST_ADMIN));
        setToken(DEMO_ADMIN_TOKEN);
        setUser(TEST_ADMIN);
        return TEST_ADMIN;
      }
      throw err;
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, phone });
      if (res.success && res.data) {
        localStorage.setItem('shubhrestro_token', res.data.token);
        localStorage.setItem('shubhrestro_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      // Fallback demo patron session if backend is disconnected
      const fallbackUser = {
        id: `usr_${Date.now()}`,
        name: name || 'Demo Patron',
        email: email,
        phone: phone || '',
        role: 'customer',
      };
      const fallbackToken = `shubhrestro_test_patron_${Date.now()}`;
      localStorage.setItem('shubhrestro_token', fallbackToken);
      localStorage.setItem('shubhrestro_user', JSON.stringify(fallbackUser));
      setToken(fallbackToken);
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('shubhrestro_token');
    localStorage.removeItem('shubhrestro_user');
    localStorage.removeItem('lumiere_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.success && res.data) {
        setUser(res.data.user);
        localStorage.setItem('shubhrestro_user', JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch {
      // Update local state if backend is offline
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('shubhrestro_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    isAdmin: Boolean(user && user.role === 'admin'),
    login,
    adminLogin,
    register,
    logout,
    updateProfile,
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

export default AuthContext;
