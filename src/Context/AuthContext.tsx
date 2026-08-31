import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContexts";
import { tokenStorage } from "@/lib/TokenStorage";
import * as authService from "@/services/AuthService";
import type { LoginCredentials, RegisterCredentials } from "@/types/authType";
import type { User } from "@/types/userType";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      if (!tokenStorage.get()) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const profile = await authService.getProfile();
        if (isMounted) setUser(profile);
      } catch {
        tokenStorage.remove();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
    return response.user;
  };

  const register = async (credentials: RegisterCredentials) => {
    const response = await authService.register(credentials);
    setUser(response.user);
    return response.user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      tokenStorage.remove();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
