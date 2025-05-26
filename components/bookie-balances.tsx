"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Lock, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import React from "react"

// Sample data for different profile sets
const profileSets = [
  {
    id: "personal",
    name: "Personal",
    data: [
      { name: "Bet365", balance: 1200, profit: 250, color: "#0088FE" },
      { name: "Ladbrokes", balance: 800, profit: -120, color: "#00C49F" },
      { name: "William Hill", balance: 1100, profit: 325, color: "#FFBB28" },
      { name: "Betfair", balance: 900, profit: 615, color: "#FF8042" },
      { name: "Unibet", balance: 600, profit: -95, color: "#8884d8" },
      { name: "Sportsbet", balance: 630, profit: 187, color: "#82ca9d" },
    ],
  },
  {
    id: "family",
    name: "Family",
    premium: true,
    data: [
      { name: "Bet365", balance: 950, profit: 150, color: "#0088FE" },
      { name: "Ladbrokes", balance: 1200, profit: 320, color: "#00C49F" },
      { name: "William Hill", balance: 750, profit: -80, color: "#FFBB28" },
      { name: "Betfair", balance: 1100, profit: 210, color: "#FF8042" },
    ],
  },
  {
    id: "team",
    name: "Team",
    premium: true,
    data: [
      { name: "Bet365", balance: 2200, profit: 450, color: "#0088FE" },
      { name: "Ladbrokes", balance: 1800, profit: -220, color: "#00C49F" },
      { name: "Betfair", balance: 1500, profit: 380, color: "#FF8042" },
      { name: "Unibet", balance: 900, profit: 120, color: "#8884d8" },
      { name: "Sportsbet", balance: 1100, profit: -150, color: "#82ca9d" },
    ],
  },
]

export function BookieBalances() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [viewMode, setViewMode] = useState("profit")
  const [isPremium, setIsPremium] = useState(false) // For testing purposes
  const currentProfile = profileSets[currentProfileIndex]

  // Add state for bonus bets
  const [bonusBets, setBonusBets] = useState({})

  // Add effect to listen for bonus bet events
  React.useEffect(() => {
    const handleBonusBetTriggered = (event) => {
      const { bookie, amount } = event.detail
      setBonusBets((prev) => ({
        ...prev,
        [bookie]: (prev[bookie] || 0) + Number(amount),
      }))
    }

    window.addEventListener("bonusBetTriggered", handleBonusBetTriggered)
    return () => {
      window.removeEventListener("bonusBetTriggered", handleBonusBetTriggered)
    }
  }, [])

  // Add a toggle button for premium status for testing
  const togglePremium = () => {
    setIsPremium((prev) => !prev)
  }

  const nextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % profileSets.length)
  }

  const prevProfile = () => {
    setCurrentProfileIndex((prev) => (prev - 1 + profileSets.length) % profileSets.length)
  }

  // Format data for the bar chart based on view mode
  const chartData = currentProfile.data.map((item) => ({
    name: item.name,
    value: viewMode === "profit" ? item.profit : item.balance,
    color: item.color,
  }))

  return (
    <div className="h-[300px] w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevProfile} disabled={currentProfileIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="font-medium">{currentProfile.name}</span>
            {currentProfile.premium && !isPremium && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Pro
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64 text-sm">
                      Multiple profile sets are available with a Pro subscription. Upgrade to access family and team
                      profiles.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={nextProfile}
            disabled={currentProfileIndex === profileSets.length - 1 || (!isPremium && currentProfileIndex > 0)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Select value={viewMode} onValueChange={setViewMode}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="View mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="profit">Profit/Loss</SelectItem>
            <SelectItem value="balance">Balance</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={togglePremium} className="ml-2 flex items-center gap-1">
          {isPremium ? "Pro" : "Free"}
          {isPremium && <span className="h-2 w-2 rounded-full bg-green-500"></span>}
        </Button>
      </div>

      <ResponsiveContainer width="100%" height="70%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(value) => `$${Math.abs(value)}`}
            domain={viewMode === "profit" ? ["auto", "auto"] : [0, "auto"]}
          />
          <RechartsTooltip
            formatter={(value) => {
              const prefix = value >= 0 ? "$" : "-$"
              return [`${prefix}${Math.abs(value)}`, viewMode === "profit" ? "Profit/Loss" : "Balance"]
            }}
          />
          <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={500}>
            {chartData.map((entry, index) => (
              <Bar
                key={`bar-${index}`}
                fill={viewMode === "profit" ? (entry.value >= 0 ? "#4ade80" : "#f87171") : entry.color}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {currentProfile.data.map((bookie) => (
          <div key={bookie.name} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: bookie.color }} />
            <div className="text-sm">
              <div className="flex items-center justify-between">
                <span>{bookie.name}:</span>
                <span
                  className={
                    viewMode === "profit"
                      ? bookie.profit > 0
                        ? "text-green-600"
                        : bookie.profit < 0
                          ? "text-red-600"
                          : ""
                      : ""
                  }
                >
                  {viewMode === "profit"
                    ? bookie.profit > 0
                      ? `+$${bookie.profit}`
                      : bookie.profit < 0
                        ? `-$${Math.abs(bookie.profit)}`
                        : "$0"
                    : `$${bookie.balance}`}
                </span>
              </div>
              {bonusBets[bookie.name] > 0 && (
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="flex items-center gap-1">
                    <Gift className="h-3 w-3 text-purple-500" />
                    Bonus Bets:
                  </span>
                  <span className="text-purple-600 font-medium">${bonusBets[bookie.name]}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
