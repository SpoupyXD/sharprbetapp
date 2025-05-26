// /app/dashboard/layout.tsx

import AppContent from "@/components/AppContent"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppContent>
      {children}
    </AppContent>
  )
}
