'use client';

import React from "react";
import { useAuth } from "../components/auth-provider";
import { Sidebar } from "../components/sidebar";
import { Header } from "../components/header";
import { useRouter, usePathname } from "next/navigation";

export default function AppContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // ⬇️ All hooks must be called before any return!
  React.useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== "/landing") {
      router.push("/landing");
    }
    // Don't redirect if loading is true
  }, [loading, isAuthenticated, pathname, router]);

  // ⬇️ Handle loading first (now it's okay to return early)
  if (loading) {
    return null; // Or a spinner: <div>Loading...</div>
  }

  // ⬇️ Don't render the app content if user is not authenticated and not on landing
  if (!isAuthenticated && pathname !== "/landing") {
    return null;
  }

  // ⬇️ Normal render if authenticated or on landing page
  return pathname === "/landing" ? (
    <>{children}</>
  ) : (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto pt-16">
          {children}
        </main>
      </div>
    </div>
  )
  ;
}
