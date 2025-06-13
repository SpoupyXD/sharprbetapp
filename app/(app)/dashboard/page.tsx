// /app/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import { DollarSign, Percent, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookiePerformanceSummary } from "@/components/bookie-performance-summary"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { CompactCalendar } from "@/components/compact-calendar"
import { SystemTime } from "@/components/system-time"

// Utility to format a Date as "MMM YYYY" (e.g. "Jan 2025")
function formatMonthYear(date: Date) {
  return date.toLocaleString("default", { month: "short", year: "numeric" })
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [bets, setBets] = useState<any[]>([])
  const [metrics, setMetrics] = useState<{
    totalProfit: number
    winRate: number
    activeCount: number
  }>({
    totalProfit: 0,
    winRate: 0,
    activeCount: 0,
  })
  const [performanceData, setPerformanceData] = useState<{ date: string; profit: number }[]>([])
  const [profitDialogOpen, setProfitDialogOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month" | "year">("month")

  useEffect(() => {
    async function checkAuthAndLoad() {
      // 1) Check if the user is logged in
      const {
        data: { user },
        error: fetchUserError,
      } = await supabase.auth.getUser()

      if (fetchUserError || !user) {
        // Not logged in → redirect to /login
        router.replace("/login")
        return
      }

      // 2) If the user is logged in but not confirmed, redirect to “please confirm”
      if (!user.confirmed_at) {
        const emailParam = encodeURIComponent(user.email || "")
        router.replace(`/registration-success?email=${emailParam}`)
        return
      }

      // 3) Fetch the user’s profile row from “users” table (optional check)
      const { data: userRows, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .limit(1)

      if (profileError) {
        console.error("Error fetching profile:", profileError.message || profileError)
        // We allow them to continue even if profile row is missing
      } else if (userRows && userRows.length > 0) {
        setUserProfile(userRows[0])
      }

      // 4) Fetch all bets belonging to this user
      const { data: betRows, error: betError } = await supabase
        .from("bets")
        .select("id, amount, profit, status, settled_at")
        .eq("user_id", user.id)

      if (betError) {
        // If there's an error (e.g. RLS or table not found), log a concise message, but do not block loading
        console.warn("Could not load bets:", betError.message || betError)
        // We leave bets as an empty array
      } else if (betRows) {
        setBets(betRows)
      }

      // 5) Compute metrics on whatever “bets” we have (could be empty)
      const allBets = betRows || []
      const settledBets = allBets.filter((b) => b.status !== "pending")
      const totalProfit = settledBets.reduce((sum, b) => sum + (b.profit ?? 0), 0)
      const wins = settledBets.filter((b) => b.profit !== null && b.profit > 0)
      const winRate = settledBets.length > 0 ? (wins.length / settledBets.length) * 100 : 0
      const activeCount = allBets.filter((b) => b.status === "pending").length

      setMetrics({
        totalProfit,
        winRate: parseFloat(winRate.toFixed(1)),
        activeCount,
      })

      // 6) Build performance data: aggregate profit by month for last 6 months
      const now = new Date()
      const monthMap: Record<string, number> = {}
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        monthMap[formatMonthYear(d)] = 0
      }
      settledBets.forEach((b) => {
        if (b.settled_at) {
          const dateObj = new Date(b.settled_at)
          const key = formatMonthYear(dateObj)
          if (monthMap[key] !== undefined) {
            monthMap[key] += b.profit ?? 0
          }
        }
      })
      const perfArray = Object.entries(monthMap).map(([date, profit]) => ({
        date,
        profit,
      }))
      setPerformanceData(perfArray)

      setLoading(false)
    }

    checkAuthAndLoad()
  }, [router])

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-6 pt-16">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Betting Overview</h1>
          <p className="text-muted-foreground">Your monthly performance breakdown</p>
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
              <div className="text-3xl font-bold">${metrics.totalProfit.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">+{metrics.winRate}% from last month</p>
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
              <div className="text-3xl font-bold">{metrics.winRate.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">
                {metrics.winRate >= 0 ? `+${metrics.winRate.toFixed(1)}%` : `${metrics.winRate.toFixed(1)}%`}{" "}
                from last month
              </p>
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
              <div className="text-3xl font-bold">{metrics.activeCount}</div>
              <p className="text-sm text-muted-foreground">
                {metrics.activeCount} pending result{metrics.activeCount !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="modern-card modern-chart">
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
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

        {/* Profit Breakdown Modal */}
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
                  onClick={() => setSelectedPeriod(period as "day" | "week" | "month" | "year")}
                >
                  <div className="text-sm font-medium text-muted-foreground">{period}</div>
                  <div className="mt-1 text-2xl font-bold">${metrics.totalProfit.toLocaleString()}</div>
                  <div className="mt-1 text-xs success-text">+{metrics.winRate.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Bookmaker Performance Summary */}
        <BookiePerformanceSummary />
      </div>

      {/* Sidebar */}
      <div className="w-72 border-l border-border/50 p-4 space-y-4 min-h-screen">
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
