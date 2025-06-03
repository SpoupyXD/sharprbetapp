"use client"

import { useState, useEffect } from "react"
import { BetsList, type Bet } from "@/components/bets-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, TrendingUp, TrendingDown, Clock, Target, DollarSign, Percent } from "lucide-react"
import { AddBetDialog } from "@/components/add-bet-dialog"
import { supabase } from "@/lib/supabase"

export default function BetsPage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [isAddBetOpen, setIsAddBetOpen] = useState(false)
  const [editingBet, setEditingBet] = useState<Bet | null>(null)

  // Fetch bets from Supabase on mount
  useEffect(() => {
    const fetchBets = async () => {
      const { data, error } = await supabase
        .from("bets")
        .select("*")
        // .eq("user_id", user.id) // Uncomment this if you have user-based filtering
        .order("created_at", { ascending: false })

      if (error) {
        setBets([])
        return
      }
      setBets(data || [])
    }
    fetchBets()
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

  // Update bet status (cycle through Pending, Won, Lost, Void)
  const cycleBetStatus = async (id: string) => {
    // Find the current bet
    const currentBet = bets.find((bet) => bet.id === id)
    if (!currentBet) return

    const statuses: Bet["status"][] = ["Pending", "Won", "Lost", "Void"]
    const currentIndex = statuses.indexOf(currentBet.status)
    const nextIndex = (currentIndex + 1) % statuses.length
    const newStatus = statuses[nextIndex]

    // Calculate profit/loss based on new status
    let profitLoss = 0
    if (newStatus === "Won") {
      profitLoss = currentBet.stake * currentBet.odds - currentBet.stake
    } else if (newStatus === "Lost") {
      profitLoss = -currentBet.stake
    }

    // Update the bet in Supabase
    await supabase
      .from("bets")
      .update({ status: newStatus, profitLoss })
      .eq("id", id)

    // Re-fetch bets to update UI
    const { data } = await supabase.from("bets").select("*")
    setBets(data || [])
  }

  // Add new bet to Supabase
  const handleAddBet = async (newBet: Omit<Bet, "id" | "profitLoss">) => {
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

    await supabase.from("bets").insert([betWithId])
    // Re-fetch bets after adding
    const { data } = await supabase.from("bets").select("*")
    setBets(data || [])

    setIsAddBetOpen(false)
  }

  // Open dialog to edit bet
  const handleEditBet = (bet: Bet) => {
    setEditingBet(bet)
    setIsAddBetOpen(true)
  }

  // Update existing bet in Supabase
  const handleUpdateBet = async (updatedBet: Omit<Bet, "id" | "profitLoss">) => {
    if (!editingBet) return

    let profitLoss = 0
    if (updatedBet.status === "Won") {
      profitLoss = updatedBet.stake * updatedBet.odds - updatedBet.stake
    } else if (updatedBet.status === "Lost") {
      profitLoss = -updatedBet.stake
    }

    await supabase
      .from("bets")
      .update({ ...updatedBet, profitLoss })
      .eq("id", editingBet.id)

    // Re-fetch bets after updating
    const { data } = await supabase.from("bets").select("*")
    setBets(data || [])

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
