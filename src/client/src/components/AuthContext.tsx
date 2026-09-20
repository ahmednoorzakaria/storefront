import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { api } from "../lib/api";

export type User = {
  id: number;
  username: string;
  role: "ADMIN" | "YCT" | "CCT" | "ACT" | "AACT";
  permissions: string[];
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  can: (permission: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem("store_token"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("store_user");
    return raw ? JSON.parse(raw) as User : null;
  });

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    async login(username, password) {
      const response = await api<{ token: string; user: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem("store_token", response.token);
      localStorage.setItem("store_user", JSON.stringify(response.user));
    },
    logout() {
      setToken(null);
      setUser(null);
      localStorage.removeItem("store_token");
      localStorage.removeItem("store_user");
    },
    can(permission) {
      return user?.role === "ADMIN" || Boolean(user?.permissions.includes(permission));
    }
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
