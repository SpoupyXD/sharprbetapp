"use client";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Top Nav/Header */}
      <Header />
      {/* Page content below header */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
