import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('aitwin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      apiClient.get('/auth/me')
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const accessToken = res.data.access_token;
    localStorage.setItem('aitwin_token', accessToken);
    setToken(accessToken);
    setUser(res.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await apiClient.post('/auth/register', { name, email, password });
    const accessToken = res.data.access_token;
    localStorage.setItem('aitwin_token', accessToken);
    setToken(accessToken);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('aitwin_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
