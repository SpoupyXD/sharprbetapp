"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

export function BonusBetsSummary() {
  const [bonusBets, setBonusBets] = useState({})
  const [expanded, setExpanded] = useState(false)

  // Initialize with sample data
  useEffect(() => {
    setBonusBets({
      Bet365: {
        amount: 50,
        count: 1,
        expiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      },
      Ladbrokes: {
        amount: 25,
        count: 1,
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      Sportsbet: {
        amount: 100,
        count: 2,
        expiry: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
      },
    })
  }, [])

  // Listen for bonus bet events
  useEffect(() => {
    const handleBonusBetTriggered = (event) => {
      const { bookie, amount } = event.detail
      setBonusBets((prev) => ({
        ...prev,
        [bookie]: {
          amount: (prev[bookie]?.amount || 0) + Number(amount),
          count: (prev[bookie]?.count || 0) + 1,
          expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
      }))
    }

    window.addEventListener("bonusBetTriggered", handleBonusBetTriggered)
    return () => {
      window.removeEventListener("bonusBetTriggered", handleBonusBetTriggered)
    }
  }, [])

  const totalBonusBets = Object.values(bonusBets).reduce((sum: number, bet: any) => sum + bet.count, 0)
  const totalAmount = Object.values(bonusBets).reduce((sum: number, bet: any) => sum + bet.amount, 0)

  // Calculate days remaining for each bonus bet
  const calculateDaysRemaining = (expiryDate) => {
    const now = new Date()
    const diffTime = expiryDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (totalBonusBets === 0) {
    return (
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Bonus Bets</CardTitle>
          <CardDescription>You don't have any bonus bets available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24 text-muted-foreground">No bonus bets available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Bonus Bets</CardTitle>
          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200">
            {totalBonusBets} Available
          </Badge>
        </div>
        <CardDescription>
          You have ${totalAmount.toFixed(2)} in bonus bets across {Object.keys(bonusBets).length} bookmakers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(bonusBets).map(([bookie, data]: [string, any]) => {
            const daysRemaining = calculateDaysRemaining(data.expiry)
            const expiryPercentage = Math.max(0, Math.min(100, (daysRemaining / 30) * 100))

            return (
              <div key={bookie} className="flex flex-col p-2 rounded-md bg-muted/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="font-medium">{bookie}</div>
                      <div className="text-xs text-muted-foreground">Expires: {data.expiry.toLocaleDateString()}</div>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="bg-purple-500 hover:bg-purple-600">${data.amount.toFixed(2)}</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {data.count} bonus {data.count === 1 ? "bet" : "bets"} available
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Expiry</span>
                    <span>{daysRemaining} days left</span>
                  </div>
                  <Progress value={expiryPercentage} className="h-1" />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Hide Details" : "Show Details"}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4">
            <div className="text-sm font-medium">How to Use Bonus Bets</div>
            <ol className="text-sm space-y-2 list-decimal pl-5">
              <li>Select a bonus bet when placing a new bet</li>
              <li>Bonus bets can only be used with the bookmaker that issued them</li>
              <li>Stake is not returned on winning bonus bets</li>
              <li>Bonus bets expire 30 days after issuance</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
