"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

// 1️⃣ AuthContext Type - Only track user and loading status (simplified)
interface AuthContextType {
  user: any | null;           // You can type this more strictly later if you want!
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2️⃣ AuthProvider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // 3️⃣ Listen for Supabase Auth changes and set user accordingly
  useEffect(() => {
    // Get initial session on page load
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    getSession();

    // Subscribe to future login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  // 4️⃣ Login Function (returns true if success)
  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      console.error("Supabase login failed:", error?.message);
      return false;
    }
    setUser(data.user);
    return true;
  };

  // 5️⃣ Logout Function
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // 6️⃣ isAuthenticated for convenience
  const isAuthenticated = !!user;

  // 7️⃣ Provide all values to context
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// 8️⃣ Custom hook for using the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
