import React, { createContext, useContext, useState, useEffect } from 'react';
import { logout as authLogout } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(token && user);

  const loginSuccess = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = async () => {
    try {
      await authLogout();
    } catch (e) {
      // ignore errors
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const syncAuth = () => {
    const curToken = localStorage.getItem('token');
    const curUser = localStorage.getItem('user');
    setToken(curToken);
    try {
      setUser(curUser ? JSON.parse(curUser) : null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    syncAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loginSuccess,
        logout: handleLogout,
        syncAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Fallback if rendered outside provider
    const token = localStorage.getItem('token');
    let user = null;
    try {
      const saved = localStorage.getItem('user');
      user = saved ? JSON.parse(saved) : null;
    } catch {
      user = null;
    }
    return {
      token,
      user,
      isAuthenticated: Boolean(token && user),
      loginSuccess: (t, u) => {
        localStorage.setItem('token', t);
        localStorage.setItem('user', JSON.stringify(u));
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },
      syncAuth: () => {},
    };
  }
  return context;
};
