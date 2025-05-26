"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, X } from "lucide-react"

const betsByDate = {
  "2023-05-10": [
    {
      id: "BET-1243",
      date: "2023-05-10",
      time: "20:45",
      event: "PSG vs. Bayern Munich",
      selection: "Both Teams to Score",
      odds: 1.8,
      stake: 100,
      status: "won",
      profit: 80,
      bookie: "Unibet",
    },
  ],
  "2023-05-11": [
    {
      id: "BET-1242",
      date: "2023-05-11",
      time: "14:00",
      event: "Federer vs. Murray",
      selection: "Federer to win",
      odds: 1.7,
      stake: 150,
      status: "won",
      profit: 105,
      bookie: "Betfair",
    },
  ],
  "2023-05-12": [
    {
      id: "BET-1241",
      date: "2023-05-12",
      time: "19:00",
      event: "Celtics vs. Bucks",
      selection: "Celtics -4.5",
      odds: 1.95,
      stake: 100,
      status: "lost",
      profit: -100,
      bookie: "William Hill",
    },
  ],
  "2023-05-13": [
    {
      id: "BET-1240",
      date: "2023-05-13",
      time: "21:00",
      event: "Tyson vs. Jones",
      selection: "Tyson by KO",
      odds: 2.8,
      stake: 75,
      status: "active",
      profit: 0,
      bookie: "Ladbrokes",
    },
  ],
  "2023-05-14": [
    {
      id: "BET-1239",
      date: "2023-05-14",
      time: "16:30",
      event: "Liverpool vs. Chelsea",
      selection: "Draw",
      odds: 3.2,
      stake: 50,
      status: "won",
      profit: 110,
      bookie: "Bet365",
    },
  ],
  "2023-05-15": [
    {
      id: "BET-1238",
      date: "2023-05-15",
      time: "22:00",
      event: "McGregor vs. Poirier",
      selection: "McGregor in Round 2",
      odds: 4.5,
      stake: 25,
      status: "lost",
      profit: -25,
      bookie: "Unibet",
    },
  ],
  "2023-05-16": [
    {
      id: "BET-1237",
      date: "2023-05-16",
      time: "13:00",
      event: "Yankees vs. Red Sox",
      selection: "Yankees -1.5",
      odds: 2.2,
      stake: 100,
      status: "won",
      profit: 120,
      bookie: "Betfair",
    },
  ],
  "2023-05-17": [
    {
      id: "BET-1236",
      date: "2023-05-17",
      time: "20:00",
      event: "Djokovic vs. Nadal",
      selection: "Nadal to win",
      odds: 2.5,
      stake: 75,
      status: "active",
      profit: 0,
      bookie: "William Hill",
    },
    {
      id: "BET-1235",
      date: "2023-05-17",
      time: "15:00",
      event: "Man City vs. Arsenal",
      selection: "Over 2.5 Goals",
      odds: 1.9,
      stake: 50,
      status: "lost",
      profit: -50,
      bookie: "Ladbrokes",
    },
  ],
  "2023-05-18": [
    {
      id: "BET-1234",
      date: "2023-05-18",
      time: "19:30",
      event: "Lakers vs. Warriors",
      selection: "Lakers to win",
      odds: 2.1,
      stake: 100,
      status: "won",
      profit: 110,
      bookie: "Bet365",
    },
  ],
  "2025-05-25": [
    {
      id: "BET-1244",
      date: "2025-05-25",
      time: "19:30",
      event: "Upcoming Match",
      selection: "Home Win",
      odds: 2.0,
      stake: 50,
      status: "pending",
      profit: 0,
      bookie: "Bet365",
    },
  ],
}

export function BetsCalendar() {
  const [date, setDate] = useState(new Date())
  const formattedDate = date.toISOString().split("T")[0]

  // Get and sort the bets for the selected date
  const selectedDateBets = betsByDate[formattedDate] || []
  const sortedSelectedDateBets = [...selectedDateBets].sort((a, b) => {
    const timeA = a.time.split(":").map(Number)
    const timeB = b.time.split(":").map(Number)

    // Compare hours first
    if (timeA[0] !== timeB[0]) {
      return timeA[0] - timeB[0]
    }

    // If hours are the same, compare minutes
    return timeA[1] - timeB[1]
  })

  // Function to determine if an event has started
  const hasEventStarted = (date, time) => {
    const eventDateTime = new Date(`${date}T${time}:00`)
    const now = new Date()
    return eventDateTime <= now
  }

  // Function to get the actual status based on time
  const getActualStatus = (bet) => {
    if (bet.status === "won" || bet.status === "lost") {
      return bet.status
    }

    // If the event hasn't started yet, it's pending
    if (!hasEventStarted(bet.date, bet.time)) {
      return "pending"
    }

    // Otherwise it's active
    return "active"
  }

  // Function to determine the day's overall profit/loss status
  const getDayStatus = (dateStr) => {
    const bets = betsByDate[dateStr] || []
    if (bets.length === 0) return null

    const totalProfit = bets.reduce((sum, bet) => sum + bet.profit, 0)
    if (totalProfit > 0) return "profit"
    if (totalProfit < 0) return "loss"
    return "neutral"
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="rounded-md border"
          modifiers={{
            profit: (date) => {
              const dateStr = date.toISOString().split("T")[0]
              return getDayStatus(dateStr) === "profit"
            },
            loss: (date) => {
              const dateStr = date.toISOString().split("T")[0]
              return getDayStatus(dateStr) === "loss"
            },
            hasBets: (date) => {
              const dateStr = date.toISOString().split("T")[0]
              return betsByDate[dateStr] !== undefined
            },
          }}
          modifiersClassNames={{
            profit: "bg-green-100 text-green-800 font-bold",
            loss: "bg-red-100 text-red-800 font-bold",
            hasBets: "border-2 border-primary",
          }}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Bets for {date.toLocaleDateString()}</h3>
        {sortedSelectedDateBets.length > 0 ? (
          <div className="space-y-4">
            {sortedSelectedDateBets.map((bet) => {
              const actualStatus = getActualStatus(bet)
              return (
                <Card key={bet.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{bet.event}</h4>
                        <p className="text-sm text-muted-foreground">
                          {bet.selection} @ {bet.odds}
                        </p>
                        <p className="text-sm">
                          Time: {bet.time} | Stake: ${bet.stake} | Bookie: {bet.bookie}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge
                          variant={
                            actualStatus === "won" ? "success" : actualStatus === "lost" ? "destructive" : "secondary"
                          }
                          className={`flex items-center gap-1 mb-2 ${
                            actualStatus === "won"
                              ? "bg-green-500 hover:bg-green-600"
                              : actualStatus === "pending" || actualStatus === "active"
                                ? "bg-gray-400 text-gray-800 hover:bg-gray-500"
                                : ""
                          }`}
                        >
                          {actualStatus === "won" ? (
                            <Check className="h-3 w-3" />
                          ) : actualStatus === "lost" ? (
                            <X className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {actualStatus.charAt(0).toUpperCase() + actualStatus.slice(1)}
                        </Badge>
                        <span
                          className={`font-semibold ${
                            bet.profit > 0 ? "text-green-600" : bet.profit < 0 ? "text-red-600" : ""
                          }`}
                        >
                          {bet.profit > 0 ? `+$${bet.profit}` : bet.profit < 0 ? `-$${Math.abs(bet.profit)}` : "$0"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No bets found for this date</p>
        )}
      </div>
    </div>
  )
}
