import React, { createContext, useState, useEffect, useContext } from 'react';
import { getToken, setToken, removeToken } from '../utils/auth';
import { loginAPI, logoutAPI, profileAPI } from '../api/auth';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());

  useEffect(() => {
    const t = getToken();
    if (t) {
      setTokenState(t);
      (async () => {
        try {
          const profile = await profileAPI();  // GET /auth/me
          setUser(profile);
        } catch (err) {
          console.error('Failed to fetch profile:', err);
          if (err.response?.status === 401) {
          removeToken();
          setTokenState(null);
          }
        }
     })();
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await loginAPI(username, password);
    setToken(res.token);
    setTokenState(res.token);
    setUser(res.user);
  };

  const logout = async () => {
    await logoutAPI();
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}