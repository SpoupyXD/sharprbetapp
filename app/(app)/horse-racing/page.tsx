"use client"

import { useState, useCallback, useEffect } from "react"
import { HorseRacingList } from "@/components/horse-racing-list"
import { HorseRacingBetDialog } from "@/components/horse-racing-bet-dialog"
import { PromoUsageDialog } from "@/components/promo-usage-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, BarChart2, DollarSign, Percent, Clock, Target, TrendingUp, Trophy } from "lucide-react"
import { Table, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { loadHorseRacingBets, saveHorseRacingBets } from "@/lib/storage"

const HorseRacingPage = () => {
  const [addBetOpen, setAddBetOpen] = useState(false)
  const [promoUsageOpen, setPromoUsageOpen] = useState(false)
  const [bets, setBets] = useState([])

  // Load bets from localStorage on component mount
  useEffect(() => {
    const storedBets = loadHorseRacingBets()
    if (storedBets && storedBets.length > 0) {
      setBets(storedBets)
    }
  }, [])

  // Calculate statistics
  const pendingBets = bets.filter((bet) => bet.status === "pending" || bet.status === "active")
  const wonBets = bets.filter((bet) => bet.status === "won")
  const lostBets = bets.filter((bet) => bet.status === "lost")

  const totalProfit = bets.reduce((sum, bet) => sum + (bet.profit || 0), 0)
  const totalStaked = bets.reduce((sum, bet) => sum + (bet.stake || 0), 0)
  const winRate = bets.length > 0 ? (wonBets.length / (wonBets.length + lostBets.length)) * 100 : 0
  const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0
  const averageOdds = bets.length > 0 ? bets.reduce((sum, bet) => sum + (bet.odds || 0), 0) / bets.length : 0

  // Track performance
  const trackStats = bets.reduce((acc, bet) => {
    if (!acc[bet.track]) {
      acc[bet.track] = { wins: 0, total: 0, profit: 0 }
    }
    acc[bet.track].total++
    acc[bet.track].profit += bet.profit || 0
    if (bet.status === "won") acc[bet.track].wins++
    return acc
  }, {})

  const bestTrack = Object.entries(trackStats).sort((a, b) => b[1].profit - a[1].profit)[0]

  const handleSaveBet = useCallback((bet) => {
    // For demo purposes, we'll add the bet to our local state
    setBets((prevBets) => {
      const existingBetIndex = prevBets.findIndex((b) => b.id === bet.id)
      let updatedBets

      if (existingBetIndex >= 0) {
        // Update existing bet
        updatedBets = [...prevBets]
        updatedBets[existingBetIndex] = bet
      } else {
        // Add new bet with ID if it doesn't have one
        const newBet = bet.id ? bet : { ...bet, id: `HR-${Date.now()}` }
        updatedBets = [...prevBets, newBet]
      }

      // Save to localStorage for persistence
      saveHorseRacingBets(updatedBets)
      return updatedBets
    })
  }, [])

  return (
    <div className="pt-2 p-6 md:px-10 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Horse Racing</h1>
          <p className="text-muted-foreground">Track and analyze your horse racing bets</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-lg" onClick={() => setPromoUsageOpen(true)}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Promo Usage
          </Button>
          <Button className="rounded-lg" onClick={() => setAddBetOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Horse Racing Bet
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <Card className="metric-card mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Horse Racing Statistics</CardTitle>
          <CardDescription>Comprehensive overview of your horse racing betting performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Profit</div>
              <div className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                {totalProfit >= 0 ? "+" : ""}${totalProfit.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">From {bets.length} races</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg">
                  <Percent className="h-4 w-4 text-blue-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Win Rate</div>
              <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {wonBets.length}W / {lostBets.length}L
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg">
                  <Clock className="h-4 w-4 text-yellow-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Active Bets</div>
              <div className="text-2xl font-bold">{pendingBets.length}</div>
              <p className="text-xs text-muted-foreground">
                ${pendingBets.reduce((sum, bet) => sum + (bet.stake || 0), 0).toFixed(2)} at risk
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-1">ROI</div>
              <div className={`text-2xl font-bold ${roi >= 0 ? "text-green-400" : "text-red-400"}`}>
                {roi >= 0 ? "+" : ""}
                {roi.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Return on investment</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg">
                  <Trophy className="h-4 w-4 text-orange-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Best Track</div>
              <div className="text-2xl font-bold">{bestTrack ? bestTrack[0] : "None"}</div>
              <p className="text-xs text-muted-foreground">
                {bestTrack ? `+$${bestTrack[1].profit.toFixed(2)} profit` : "No data"}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg">
                  <Target className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Avg Odds</div>
              <div className="text-2xl font-bold">{averageOdds.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Average odds taken</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Bets</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="won">Won</TabsTrigger>
          <TabsTrigger value="lost">Lost</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Horse Racing Bets</CardTitle>
              <CardDescription>View all your horse racing bets across all tracks</CardDescription>
            </CardHeader>
            <CardContent>
              <HorseRacingList filter="all" bets={bets} onSaveBet={handleSaveBet} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Bets</CardTitle>
              <CardDescription>View your currently active horse racing bets</CardDescription>
            </CardHeader>
            <CardContent>
              <HorseRacingList filter="active" bets={bets} onSaveBet={handleSaveBet} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="won">
          <Card>
            <CardHeader>
              <CardTitle>Won Bets</CardTitle>
              <CardDescription>View your winning horse racing bets</CardDescription>
            </CardHeader>
            <CardContent>
              <HorseRacingList filter="won" bets={bets} onSaveBet={handleSaveBet} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="lost">
          <Card>
            <CardHeader>
              <CardTitle>Lost Bets</CardTitle>
              <CardDescription>View your losing horse racing bets</CardDescription>
            </CardHeader>
            <CardContent>
              <HorseRacingList filter="lost" bets={bets} onSaveBet={handleSaveBet} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Horse Racing Statistics</CardTitle>
              <CardDescription>Analyze your horse racing betting performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {bets.length > 0
                        ? `${((bets.filter((b) => b.status === "won").length / bets.length) * 100).toFixed(1)}%`
                        : "0.0%"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {bets.filter((b) => b.status === "won").length} wins from {bets.length} bets
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${bets.reduce((sum, bet) => sum + (bet.profit || 0), 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {bets.reduce((sum, bet) => sum + (bet.profit || 0), 0) >= 0 ? "+" : ""}$
                      {bets.reduce((sum, bet) => sum + (bet.profit || 0), 0).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {bets.length > 0
                        ? `${((bets.reduce((sum, bet) => sum + (bet.profit || 0), 0) / bets.reduce((sum, bet) => sum + (bet.stake || 0), 0)) * 100).toFixed(1)}% ROI`
                        : "0.0% ROI"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Best Track</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {bets.length > 0
                        ? Object.entries(
                            bets.reduce((acc, bet) => {
                              if (!acc[bet.track]) acc[bet.track] = { wins: 0, total: 0 }
                              acc[bet.track].total++
                              if (bet.status === "won") acc[bet.track].wins++
                              return acc
                            }, {}),
                          ).sort((a, b) => b[1].wins / b[1].total - a[1].wins / a[1].total)[0]?.[0] || "None"
                        : "None"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {bets.length > 0
                        ? (() => {
                            const tracks = bets.reduce((acc, bet) => {
                              if (!acc[bet.track]) acc[bet.track] = { wins: 0, total: 0 }
                              acc[bet.track].total++
                              if (bet.status === "won") acc[bet.track].wins++
                              return acc
                            }, {})
                            const bestTrack = Object.entries(tracks).sort(
                              (a, b) => b[1].wins / b[1].total - a[1].wins / a[1].total,
                            )[0]
                            return bestTrack
                              ? `${((bestTrack[1].wins / bestTrack[1].total) * 100).toFixed(0)}% win rate (${bestTrack[1].wins}/${bestTrack[1].total})`
                              : "No data"
                          })()
                        : "No data"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Best Bet Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {bets.length > 0
                        ? Object.entries(
                            bets.reduce((acc, bet) => {
                              if (!acc[bet.betType]) acc[bet.betType] = { wins: 0, total: 0 }
                              acc[bet.betType].total++
                              if (bet.status === "won") acc[bet.betType].wins++
                              return acc
                            }, {}),
                          ).sort((a, b) => b[1].wins / b[1].total - a[1].wins / a[1].total)[0]?.[0] || "None"
                        : "None"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {bets.length > 0
                        ? (() => {
                            const betTypes = bets.reduce((acc, bet) => {
                              if (!acc[bet.betType]) acc[bet.betType] = { wins: 0, total: 0 }
                              acc[bet.betType].total++
                              if (bet.status === "won") acc[bet.betType].wins++
                              return acc
                            }, {})
                            const bestType = Object.entries(betTypes).sort(
                              (a, b) => b[1].wins / b[1].total - a[1].wins / a[1].total,
                            )[0]
                            return bestType
                              ? `${((bestType[1].wins / bestType[1].total) * 100).toFixed(0)}% win rate (${bestType[1].wins}/${bestType[1].total})`
                              : "No data"
                          })()
                        : "No data"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Performance by Track</h3>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHead>Track</TableHead>
                      <TableHead>Bets</TableHead>
                      <TableHead>Wins</TableHead>
                      <TableHead>Win %</TableHead>
                      <TableHead className="text-right">Profit/Loss</TableHead>
                      <TableHead className="text-right">ROI</TableHead>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bets.length > 0 ? (
                      Object.entries(
                        bets.reduce((acc, bet) => {
                          if (!acc[bet.track]) {
                            acc[bet.track] = {
                              bets: 0,
                              wins: 0,
                              profit: 0,
                              stake: 0,
                            }
                          }
                          acc[bet.track].bets++
                          acc[bet.track].stake += bet.stake || 0
                          acc[bet.track].profit += bet.profit || 0
                          if (bet.status === "won") acc[bet.track].wins++
                          return acc
                        }, {}),
                      )
                        .sort((a, b) => b[1].profit - a[1].profit)
                        .map(([track, data]) => (
                          <TableRow key={track}>
                            <TableCell>{track}</TableCell>
                            <TableCell>{data.bets}</TableCell>
                            <TableCell>{data.wins}</TableCell>
                            <TableCell>{((data.wins / data.bets) * 100).toFixed(0)}%</TableCell>
                            <TableCell className={`text-right ${data.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {data.profit >= 0 ? "+" : ""}
                              {data.profit.toFixed(2)}
                            </TableCell>
                            <TableCell className={`text-right ${data.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {data.profit >= 0 ? "+" : ""}
                              {((data.profit / data.stake) * 100).toFixed(0)}%
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No bets recorded yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Horse Racing Bet Dialog */}
      <HorseRacingBetDialog open={addBetOpen} onOpenChange={setAddBetOpen} onSaveBet={handleSaveBet} />

      {/* Promo Usage Dialog */}
      <PromoUsageDialog open={promoUsageOpen} onOpenChange={setPromoUsageOpen} />
    </div>
  )
}

export default HorseRacingPage
