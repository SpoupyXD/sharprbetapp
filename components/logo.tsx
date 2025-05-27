"use client"

import { TrendingUp } from "lucide-react"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
        <TrendingUp className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold brand-gradient">SharpR</span>
    </div>
  )
}
