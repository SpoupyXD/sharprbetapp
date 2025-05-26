"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react"

interface DayData {
  date: string
  profit: number
  betsPlaced: number
  betsWon: number
  betsLost: number
  winRate: number
  totalStaked: number
  bets: Array<{
    id: string
    event: string
    selection: string
    odds: number
    stake: number
    status: "won" | "lost"
    profit: number
  }>
}

const dailyData: Record<string, DayData> = {
  "2025-05-01": {
    date: "2025-05-01",
    profit: 120.5,
    betsPlaced: 3,
    betsWon: 2,
    betsLost: 1,
    winRate: 66.7,
    totalStaked: 250,
    bets: [
      {
        id: "1",
        event: "Lakers vs Warriors",
        selection: "Lakers +5",
        odds: 1.9,
        stake: 100,
        status: "won",
        profit: 90,
      },
      { id: "2", event: "Chelsea vs Arsenal", selection: "Over 2.5", odds: 1.8, stake: 75, status: "won", profit: 60 },
      {
        id: "3",
        event: "Yankees vs Red Sox",
        selection: "Yankees ML",
        odds: 2.1,
        stake: 75,
        status: "lost",
        profit: -75,
      },
    ],
  },
  "2025-05-02": {
    date: "2025-05-02",
    profit: 85.75,
    betsPlaced: 2,
    betsWon: 2,
    betsLost: 0,
    winRate: 100,
    totalStaked: 150,
    bets: [
      { id: "4", event: "Man City vs Liverpool", selection: "BTTS", odds: 1.7, stake: 100, status: "won", profit: 70 },
      { id: "5", event: "Federer vs Nadal", selection: "Federer ML", odds: 1.6, stake: 50, status: "won", profit: 30 },
    ],
  },
  "2025-05-03": {
    date: "2025-05-03",
    profit: -45.2,
    betsPlaced: 1,
    betsWon: 0,
    betsLost: 1,
    winRate: 0,
    totalStaked: 45.2,
    bets: [
      {
        id: "6",
        event: "Celtics vs Heat",
        selection: "Celtics -7.5",
        odds: 1.9,
        stake: 45.2,
        status: "lost",
        profit: -45.2,
      },
    ],
  },
  "2025-05-04": {
    date: "2025-05-04",
    profit: 210.3,
    betsPlaced: 4,
    betsWon: 3,
    betsLost: 1,
    winRate: 75,
    totalStaked: 300,
    bets: [
      { id: "7", event: "PSG vs Bayern", selection: "PSG ML", odds: 2.5, stake: 100, status: "won", profit: 150 },
      {
        id: "8",
        event: "Djokovic vs Murray",
        selection: "Over 3.5 Sets",
        odds: 1.8,
        stake: 50,
        status: "won",
        profit: 40,
      },
      {
        id: "9",
        event: "Cowboys vs Giants",
        selection: "Under 45.5",
        odds: 1.9,
        stake: 75,
        status: "won",
        profit: 67.5,
      },
      {
        id: "10",
        event: "Dodgers vs Padres",
        selection: "Dodgers -1.5",
        odds: 2.0,
        stake: 75,
        status: "lost",
        profit: -75,
      },
    ],
  },
}

export function CompactCalendar() {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const handleDayClick = (day: number) => {
    const dateKey = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayData = dailyData[dateKey]
    if (dayData) {
      setSelectedDay(dayData)
      setDialogOpen(true)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <Card className="modern-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Profit Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={i} className="text-xs font-medium text-muted-foreground p-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1
              const dateKey = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const dayData = dailyData[dateKey]
              const isProfit = dayData && dayData.profit > 0
              const isLoss = dayData && dayData.profit < 0

              const date = new Date(currentYear, currentMonth - 1, day)
              const isValidDay = date.getMonth() === currentMonth - 1

              if (!isValidDay) return <div key={`empty-${i}`} className="h-8"></div>

              return (
                <div
                  key={dateKey}
                  className={`h-8 w-8 rounded-md flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200 ${
                    dayData
                      ? isProfit
                        ? "bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 hover:scale-110"
                        : "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 hover:scale-110"
                      : "border border-border/30 text-muted-foreground hover:border-border/60"
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  {day}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl modern-card">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Daily Summary</span>
              {selectedDay && (
                <Badge variant={selectedDay.profit > 0 ? "default" : "destructive"} className="ml-2">
                  {selectedDay.profit > 0 ? "Profit" : "Loss"}
                </Badge>
              )}
            </DialogTitle>
            {selectedDay && <p className="text-sm text-muted-foreground">{formatDate(selectedDay.date)}</p>}
          </DialogHeader>

          {selectedDay && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-effect p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className={`text-lg font-bold ${selectedDay.profit > 0 ? "success-text" : "text-red-400"}`}>
                    {selectedDay.profit > 0 ? "+" : ""}${selectedDay.profit.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Net Profit</div>
                </div>

                <div className="glass-effect p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-lg font-bold">{selectedDay.betsPlaced}</div>
                  <div className="text-xs text-muted-foreground">Bets Placed</div>
                </div>

                <div className="glass-effect p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-1">
                    {selectedDay.winRate >= 50 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <div className="text-lg font-bold">{selectedDay.winRate.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                </div>

                <div className="glass-effect p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-lg font-bold">${selectedDay.totalStaked}</div>
                  <div className="text-xs text-muted-foreground">Total Staked</div>
                </div>
              </div>

              {/* Bet Details */}
              <div>
                <h4 className="text-sm font-medium mb-3 uppercase tracking-wider text-muted-foreground">Bet Details</h4>
                <div className="space-y-3">
                  {selectedDay.bets.map((bet) => (
                    <div key={bet.id} className="glass-effect p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{bet.event}</div>
                          <div className="text-sm text-muted-foreground">
                            {bet.selection} @ {bet.odds}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Stake: ${bet.stake}</div>
                        </div>
                        <div className="text-right">
                          <Badge variant={bet.status === "won" ? "default" : "destructive"}>
                            {bet.status.toUpperCase()}
                          </Badge>
                          <div
                            className={`text-sm font-medium mt-1 ${bet.profit > 0 ? "success-text" : "text-red-400"}`}
                          >
                            {bet.profit > 0 ? "+" : ""}${bet.profit.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
