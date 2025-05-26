"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, BookOpen, CreditCard, Home, Settings, Settings2, DogIcon as Horse } from "lucide-react"
import { Button } from "@/components/ui/button"

// ✅ This is your function declaration!
export function Sidebar() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Show sidebar when mouse is within 50px of left edge
      if (e.clientX <= 50) {
        setIsVisible(true)
      }
      // Hide sidebar when mouse moves away from sidebar area (beyond 300px from left)
      else if (e.clientX > 300) {
        setIsVisible(false)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 modern-sidebar border-r border-border/50 p-4 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <nav className="space-y-2">
        <Link href="/">
          <Button variant="ghost" className={`w-full justify-start modern-button ${pathname === "/" ? "active" : ""}`}>
            <Home className="mr-3 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/bets">
          <Button
            variant="ghost"
            className={`w-full justify-start modern-button ${pathname === "/bets" ? "active" : ""}`}
          >
            <BookOpen className="mr-3 h-4 w-4" />
            My Bets
          </Button>
        </Link>
        <Link href="/horse-racing">
          <Button
            variant="ghost"
            className={`w-full justify-start modern-button ${pathname === "/horse-racing" ? "active" : ""}`}
          >
            <Horse className="mr-3 h-4 w-4" />
            Horse Racing
          </Button>
        </Link>
        <Link href="/bookies">
          <Button
            variant="ghost"
            className={`w-full justify-start modern-button ${pathname === "/bookies" ? "active" : ""}`}
          >
            <CreditCard className="mr-3 h-4 w-4" />
            Bookmakers
          </Button>
        </Link>
        <Link href="/performance">
          <Button
            variant="ghost"
            className={`w-full justify-start modern-button ${pathname === "/performance" ? "active" : ""}`}
          >
            <BarChart3 className="mr-3 h-4 w-4" />
            Analytics
          </Button>
        </Link>
        <Link href="/setup">
          <Button
            variant="ghost"
            className={`w-full justify-start modern-button ${pathname === "/setup" ? "active" : ""}`}
          >
            <Settings2 className="mr-3 h-4 w-4" />
            Setup
          </Button>
        </Link>
        <Link href="/settings">
          <Button
            variant="ghost"
            className={`w-full justify-start modern-button ${pathname === "/settings" ? "active" : ""}`}
          >
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </nav>

      <div className="mt-8 pt-8 border-t border-border/50">
        <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">System Status</div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <div className="flex items-center space-x-2">
              <div className="status-indicator"></div>
              <span className="success-text text-xs">Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Version</span>
            <span className="text-xs">v2.1.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
