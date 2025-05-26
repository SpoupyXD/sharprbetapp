"use client"

import Link from "next/link"
import { Search, Bell, Moon, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="modern-header border-b border-border/50 p-4 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold brand-gradient">SharpR</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search bets..." className="pl-10 w-80 modern-input" />
          </div>
          <Button variant="ghost" size="icon" className="modern-button">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="modern-button">
            <Moon className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">SR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
