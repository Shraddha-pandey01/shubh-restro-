import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const clean = envUrl.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('shubhrestro_token') ||
      localStorage.getItem('lumiere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Check if the request hit a static host without backend connectivity
    if (
      error.response?.status === 405 ||
      (!import.meta.env.VITE_API_URL &&
        typeof window !== 'undefined' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1' &&
        error.response?.status === 404)
    ) {
      return Promise.reject(
        new Error(
          'Backend connection failed. VITE_API_URL is not configured in Vercel settings. Please set VITE_API_URL to your deployed backend URL in Vercel Project Settings > Environment Variables.'
        )
      );
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

export default api;
