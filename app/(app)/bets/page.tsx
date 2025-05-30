"use client"

import { useState, useEffect } from "react"
import { BetsList, type Bet } from "@/components/bets-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, TrendingUp, TrendingDown, Clock, Target, DollarSign, Percent } from "lucide-react"
import { AddBetDialog } from "@/components/add-bet-dialog"

// Helper functions for localStorage
const BETS_STORAGE_KEY = "generalBets"

const saveBets = (bets: Bet[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(BETS_STORAGE_KEY, JSON.stringify(bets))
  }
}

const loadBets = (): Bet[] => {
  if (typeof window !== "undefined") {
    const storedBets = localStorage.getItem(BETS_STORAGE_KEY)
    return storedBets ? JSON.parse(storedBets) : []
  }
  return []
}

export default function BetsPage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [isAddBetOpen, setIsAddBetOpen] = useState(false)
  const [editingBet, setEditingBet] = useState<Bet | null>(null)

  // Load bets from localStorage on component mount
  useEffect(() => {
    const storedBets = loadBets()
    if (storedBets.length > 0) {
      setBets(storedBets)
    }
  }, [])

  // Calculate statistics
  const pendingBets = bets.filter((bet) => bet.status === "Pending")
  const wonBets = bets.filter((bet) => bet.status === "Won")
  const lostBets = bets.filter((bet) => bet.status === "Lost")
  const voidBets = bets.filter((bet) => bet.status === "Void")

  const totalProfit = bets.reduce((sum, bet) => sum + (bet.profitLoss || 0), 0)
  const totalStaked = bets.reduce((sum, bet) => sum + bet.stake, 0)
  const winRate = bets.length > 0 ? (wonBets.length / (wonBets.length + lostBets.length)) * 100 : 0
  const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0
  const averageOdds = bets.length > 0 ? bets.reduce((sum, bet) => sum + bet.odds, 0) / bets.length : 0

  const cycleBetStatus = (id: string) => {
    setBets((currentBets) => {
      const updatedBets = currentBets.map((bet) => {
        if (bet.id === id) {
          const statuses: Bet["status"][] = ["Pending", "Won", "Lost", "Void"]
          const currentIndex = statuses.indexOf(bet.status)
          const nextIndex = (currentIndex + 1) % statuses.length
          const newStatus = statuses[nextIndex]

          // Calculate profit/loss based on status
          let profitLoss = 0
          if (newStatus === "Won") {
            profitLoss = bet.stake * bet.odds - bet.stake
          } else if (newStatus === "Lost") {
            profitLoss = -bet.stake
          }

          return { ...bet, status: newStatus, profitLoss }
        }
        return bet
      })

      // Save to localStorage
      saveBets(updatedBets)
      return updatedBets
    })
  }

  const handleAddBet = (newBet: Omit<Bet, "id" | "profitLoss">) => {
    const id = `BET-${Date.now()}`
    let profitLoss = 0

    if (newBet.status === "Won") {
      profitLoss = newBet.stake * newBet.odds - newBet.stake
    } else if (newBet.status === "Lost") {
      profitLoss = -newBet.stake
    }

    const betWithId: Bet = {
      ...newBet,
      id,
      profitLoss,
    }

    setBets((currentBets) => {
      const updatedBets = [...currentBets, betWithId]
      // Save to localStorage
      saveBets(updatedBets)
      return updatedBets
    })

    setIsAddBetOpen(false)
  }

  const handleEditBet = (bet: Bet) => {
    setEditingBet(bet)
    setIsAddBetOpen(true)
  }

  const handleUpdateBet = (updatedBet: Omit<Bet, "id" | "profitLoss">) => {
    if (!editingBet) return

    let profitLoss = 0
    if (updatedBet.status === "Won") {
      profitLoss = updatedBet.stake * updatedBet.odds - updatedBet.stake
    } else if (updatedBet.status === "Lost") {
      profitLoss = -updatedBet.stake
    }

    setBets((currentBets) => {
      const updatedBets = currentBets.map((bet) =>
        bet.id === editingBet.id ? { ...updatedBet, id: bet.id, profitLoss } : bet,
      )

      // Save to localStorage
      saveBets(updatedBets)
      return updatedBets
    })

    setEditingBet(null)
    setIsAddBetOpen(false)
  }

  return (
    <div className="flex justify-center pt-2 px-6 pb-10">
      <div className="max-w-6xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">General Bets</h1>
            <p className="text-muted-foreground">Track and manage all your betting activity</p>
          </div>
          <Button onClick={() => setIsAddBetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Bet
          </Button>
        </div>

        {/* Statistics Overview */}
        <Card className="metric-card mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Betting Statistics Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Total Profit</span>
                </div>
                <div className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {totalProfit >= 0 ? "+" : ""}${totalProfit.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">From {bets.length} total bets</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Percent className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Win Rate</span>
                </div>
                <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {wonBets.length}W / {lostBets.length}L
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Pending Bets</span>
                </div>
                <div className="text-2xl font-bold">{pendingBets.length}</div>
                <p className="text-xs text-muted-foreground">
                  ${pendingBets.reduce((sum, bet) => sum + bet.stake, 0).toFixed(2)} at risk
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-400 mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">ROI</span>
                </div>
                <div className={`text-2xl font-bold ${roi >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {roi >= 0 ? "+" : ""}
                  {roi.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Return on investment</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-orange-400 mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Total Staked</span>
                </div>
                <div className="text-2xl font-bold">${totalStaked.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total wagered</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingDown className="h-5 w-5 text-cyan-400 mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Avg Odds</span>
                </div>
                <div className="text-2xl font-bold">{averageOdds.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Average odds taken</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <BetsList data={bets} cycleBetStatus={cycleBetStatus} handleEditBet={handleEditBet} />

        <AddBetDialog
          open={isAddBetOpen}
          onOpenChange={setIsAddBetOpen}
          onAddBet={editingBet ? handleUpdateBet : handleAddBet}
          editMode={!!editingBet}
          initialBet={editingBet}
        />
      </div>
    </div>
  )
}
