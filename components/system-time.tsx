"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SystemTime() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="modern-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          System Time
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-2xl font-bold accent-text mb-1">{formatTime(currentTime)}</div>
        <div className="text-sm text-muted-foreground mb-4">{formatDate(currentTime)}</div>

        <div className="grid grid-cols-1 gap-3">
          <div className="glass-effect p-3 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Uptime</div>
            <div className="text-sm font-bold">14d</div>
            <div className="text-xs accent-text">06:42:18</div>
          </div>
          <div className="glass-effect p-3 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Time Zone</div>
            <div className="text-sm font-bold">UTC-08:00</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
