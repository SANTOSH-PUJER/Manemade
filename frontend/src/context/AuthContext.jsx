import { createContext, useContext, useMemo, useState } from 'react';

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
      login: setSession,
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
