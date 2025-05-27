"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Force logout on every page load (for development only!)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sharpr-auth");
    }
  }, []); // Only runs once

  useEffect(() => {
    // Check if user is already logged in
    const savedAuth = localStorage.getItem("sharpr-auth");
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUser(authData.user);
    }
    setLoading(false);
  }, []);

const login = async (email: string, password: string): Promise<boolean> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    console.error("Supabase login failed:", error?.message);
    return false;
  }

  const userData = { email: data.user.email ?? "", name: data.user.user_metadata?.name ?? "" };

  setIsAuthenticated(true);
  setUser(userData);
  localStorage.setItem("sharpr-auth", JSON.stringify({ user: userData }));
  return true;
};


  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("sharpr-auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
