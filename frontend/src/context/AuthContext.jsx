import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/userService';

const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await authService.getMe();
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loadingAuth,
      login: async (credentials) => {
        try {
          const response = await authService.login(credentials);
          setUser(response.data.user);
          setIsAuthenticated(true);
          return response.data;
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        }
      },
      loginWithOtp: async (otpData) => {
        try {
          const response = await authService.loginWithOtp(otpData);
          setUser(response.data.user);
          setIsAuthenticated(true);
          return response.data;
        } catch (error) {
          console.error("OTP Login failed:", error);
          throw error;
        }
      },
      register: async (userData) => {
        try {
          const response = await authService.register(userData);
          return response.data;
        } catch (error) {
          console.error("Registration failed:", error);
          throw error;
        }
      },
      updateUser: (updatedUser) => setUser(updatedUser),
      logout: async () => {
        try {
          await authService.logout();
        } finally {
          setUser(null);
          setIsAuthenticated(false);
        }
      },
    }),
    [user, isAuthenticated, loadingAuth],
  );

  if (loadingAuth) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-[9999]">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--accent-muted)] opacity-20" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[var(--accent-strong)] animate-spin" />
        </div>
        <div className="mt-8 space-y-2 text-center">
            <h2 className="font-display text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                Preparing <span className="text-[var(--accent-strong)]">Manemade</span>
            </h2>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Regional Excellence</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
