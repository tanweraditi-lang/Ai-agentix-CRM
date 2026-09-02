import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    throw new Error(message);
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.warn('Logout endpoint warning:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const validateSession = async () => {
  try {
    const response = await api.get('/auth/validate-session');
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { valid: false };
  }
};

export const getMe = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await api.get('/auth/me');
    if (response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data.user;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};

