"use client"

import { useState } from "react"
import { DollarSign, Percent, BookOpen, BarChart3, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookiePerformanceSummary } from "@/components/bookie-performance-summary"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { CompactCalendar } from "@/components/compact-calendar"
import { SystemTime } from "@/components/system-time"

export default function DashboardContent() {
  const [profitDialogOpen, setProfitDialogOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const profitData = {
    day: { amount: "$45.89", change: "+5.2%" },
    week: { amount: "$120.45", change: "+12.3%" },
    month: { amount: "$1,245.89", change: "+20.1%" },
    year: { amount: "$5,432.10", change: "+35.7%" },
  }

  const performanceData = [
    { date: "Jan 1", profit: 120 },
    { date: "Jan 15", profit: 210 },
    { date: "Feb 1", profit: 180 },
    { date: "Feb 15", profit: 290 },
    { date: "Mar 1", profit: 250 },
    { date: "Mar 15", profit: 310 },
    { date: "Apr 1", profit: 280 },
    { date: "Apr 15", profit: 420 },
    { date: "May 1", profit: 380 },
    { date: "May 15", profit: 450 },
  ]

  return (
    <div className="flex">
      {/* Left Side */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 accent-text" />
              <h1 className="text-2xl font-semibold">Betting Overview</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="status-indicator"></div>
              <span className="text-sm success-text font-medium">LIVE</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 modern-button">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
              <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="cursor-pointer" onClick={() => setProfitDialogOpen(true)}>
              <div className="text-3xl font-bold mb-1">$1,245.89</div>
              <p className="text-sm text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg">
                <Percent className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">58.2%</div>
              <p className="text-sm text-muted-foreground">+4.3% from last month</p>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Bets</CardTitle>
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg">
                <BookOpen className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">12</div>
              <p className="text-sm text-muted-foreground">4 pending results</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="modern-card modern-chart">
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" tickFormatter={(v) => `$${v}`} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#60a5fa" }}
                    activeDot={{ r: 6, fill: "#60a5fa" }}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Modal */}
        <Dialog open={profitDialogOpen} onOpenChange={setProfitDialogOpen}>
          <DialogContent className="sm:max-w-md modern-card">
            <DialogHeader>
              <DialogTitle>Profit Breakdown</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {["day", "week", "month", "year"].map((period) => (
                <div
                  key={period}
                  className={`cursor-pointer rounded-lg border p-4 transition-all ${
                    selectedPeriod === period ? "border-primary bg-primary/10" : "hover:border-border"
                  }`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  <div className="text-sm font-medium text-muted-foreground">{period}</div>
                  <div className="mt-1 text-2xl font-bold">{profitData[period as keyof typeof profitData].amount}</div>
                  <div className="mt-1 text-xs success-text">{profitData[period as keyof typeof profitData].change}</div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Bookmaker Summary */}
        <BookiePerformanceSummary />
      </div>

      {/* Sidebar */}
      <div className="w-72 modern-sidebar border-l border-border/50 p-4 space-y-4">
        <div className="scale-90 origin-top">
          <SystemTime />
        </div>
        <div className="scale-90 origin-top">
          <CompactCalendar />
        </div>
      </div>
    </div>
  )
}
