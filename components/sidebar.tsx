"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  CreditCard,
  Home,
  Settings,
  Settings2,
  Dog as Horse,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)

  const toggleSidebar = () => setExpanded(!expanded)

  return (
    <div
      className={`h-full border-r border-border/50 bg-black transition-all duration-300 ease-in-out ${
        expanded ? "w-56" : "w-16"
      } flex flex-col`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end px-2 py-2">
        <button
          onClick={toggleSidebar}
          className="text-zinc-400 hover:text-white transition"
        >
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2 px-2">
        <SidebarItem
          icon={Home}
          label="Dashboard"
          href="/dashboard"
          active={pathname === "/dashboard"}
          expanded={expanded}
        />
        <SidebarItem
          icon={BookOpen}
          label="My Bets"
          href="/bets"
          active={pathname === "/bets"}
          expanded={expanded}
        />
        <SidebarItem
          icon={Horse}
          label="Horse Racing"
          href="/horse-racing"
          active={pathname === "/horse-racing"}
          expanded={expanded}
        />
        <SidebarItem
          icon={CreditCard}
          label="Bookmakers"
          href="/bookies"
          active={pathname === "/bookies"}
          expanded={expanded}
        />
        <SidebarItem
          icon={BarChart3}
          label="Analytics"
          href="/performance"
          active={pathname === "/performance"}
          expanded={expanded}
        />
        <SidebarItem
          icon={Settings2}
          label="Setup"
          href="/setup"
          active={pathname === "/setup"}
          expanded={expanded}
        />
        <SidebarItem
          icon={Settings}
          label="Settings"
          href="/settings"
          active={pathname === "/settings"}
          expanded={expanded}
        />
      </nav>

      {/* Footer info (optional) */}
      <div className={`${expanded ? "mt-auto px-4 py-6 text-xs text-muted-foreground" : "hidden"}`}>
        <div className="mb-2">System Status</div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-green-500">Online</span>
          </div>
          <div className="flex justify-between">
            <span>Version</span>
            <span>v2.1.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  href,
  active,
  expanded,
}: {
  icon: React.ElementType
  label: string
  href: string
  active: boolean
  expanded: boolean
}) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center transition-colors rounded-md px-3 py-2 cursor-pointer ${
          active ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-zinc-800"
        } ${expanded ? "justify-start" : "justify-center"}`}
      >
        <Icon className="h-5 w-5" />
        {expanded && <span className="ml-3 text-sm">{label}</span>}
      </div>
    </Link>
  )
}
