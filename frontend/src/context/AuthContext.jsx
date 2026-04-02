import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/userService';

const AuthContext = createContext(undefined);
const AUTH_STORAGE_KEY = 'manemade_user';

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const setSession = (session) => {
    if (session) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      setAuthState(session);
      return;
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState(null);
  };

  const value = useMemo(
    () => ({
      authState,
      token: authState?.token || null,
      user: authState?.user || null,
      isAuthenticated: Boolean(authState?.token),
      login: async (credentials) => {
        const response = await authService.login(credentials);
        setSession(response.data);
        return response.data;
      },
      register: async (userData) => {
        const response = await authService.register(userData);
        setSession(response.data);
        return response.data;
      },
      updateUser: (user) => setSession({ ...authState, user }),
      logout: () => setSession(null),
    }),
    [authState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
