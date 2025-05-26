"use client"

import { Check, Clock, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Regular bets data
const regularBets = [
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
    sport: "Basketball",
    strategy: "Value Betting",
    tipper: "SportsTips Pro",
    type: "regular",
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
    sport: "Soccer",
    strategy: "Over/Under",
    tipper: "Self",
    type: "regular",
  },
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
    sport: "Tennis",
    strategy: "Backing Favorites",
    tipper: "Tennis Insider",
    type: "regular",
  },
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
    sport: "Soccer",
    strategy: "Value Betting",
    tipper: "Self",
    type: "regular",
  },
]

// Horse racing bets data
const horseRacingBets = [
  {
    id: "HR-1234",
    date: "2023-05-18",
    time: "14:30",
    event: "Churchill Downs - Race 5",
    selection: "Lucky Strike (Win)",
    odds: 6.5,
    stake: 100,
    status: "won",
    profit: 550,
    bookie: "Bet365",
    sport: "Horse Racing",
    strategy: "Value Betting",
    tipper: "Racing Expert",
    type: "horse",
  },
  {
    id: "HR-1235",
    date: "2023-05-17",
    time: "13:15",
    event: "Belmont Park - Race 3",
    selection: "Fast Runner (Place)",
    odds: 3.2,
    stake: 50,
    status: "lost",
    profit: -50,
    bookie: "Ladbrokes",
    sport: "Horse Racing",
    strategy: "Form Analysis",
    tipper: "Self",
    type: "horse",
  },
  {
    id: "HR-1236",
    date: "2023-05-17",
    time: "16:45",
    event: "Santa Anita - Race 7",
    selection: "Thunder Bolt (Each Way)",
    odds: 12.0,
    stake: 25,
    status: "active",
    profit: 0,
    bookie: "William Hill",
    sport: "Horse Racing",
    strategy: "Longshot",
    tipper: "Horse Racing Pro",
    type: "horse",
  },
  {
    id: "HR-1242",
    date: "2025-05-25",
    time: "14:30",
    event: "Royal Ascot - Race 1",
    selection: "Future Champion (Win)",
    odds: 3.5,
    stake: 100,
    status: "pending",
    profit: 0,
    bookie: "Ladbrokes",
    sport: "Horse Racing",
    strategy: "Value Betting",
    tipper: "UK Racing",
    type: "horse",
  },
  {
    id: "HR-1243",
    date: "2025-05-25",
    time: "14:30",
    event: "Royal Ascot - Race 1",
    selection: "Future Champion (Win)",
    odds: 3.5,
    stake: 100,
    status: "pending",
    profit: 0,
    bookie: "Ladbrokes",
    sport: "Horse Racing",
    strategy: "Back & Lay",
    tipper: "UK Racing",
    type: "horse",
    notes: "Lay: Betfair @ 4.0 - Stake: $95",
  },
  {
    id: "HR-1244",
    date: "2025-05-25",
    time: "14:30",
    event: "Royal Ascot - Race 1",
    selection: "Future Champion (Win)",
    odds: 3.5,
    stake: 100,
    status: "pending",
    profit: 0,
    bookie: "Ladbrokes",
    sport: "Horse Racing",
    strategy: "Bonus Bet Turnover",
    tipper: "UK Racing",
    type: "horse",
    notes: "Lay: Smarkets @ 4.0 - Stake: $95",
  },
]

// Combine both bet types
const allBets = [...regularBets, ...horseRacingBets]

export function RecentBets() {
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

  // Add a similar function to render back & lay bets differently in the RecentBets component
  // Add this function before the return statement

  const renderBetRow = (bet) => {
    const actualStatus = getActualStatus(bet)

    // Check if this is a back & lay bet by looking at the strategy
    const isBackLayBet = bet.strategy === "Back & Lay" || bet.strategy === "Bonus Bet Turnover"

    if (!isBackLayBet) {
      // Regular bet rendering
      return (
        <TableRow key={bet.id}>
          <TableCell>
            {bet.date} {bet.time}
          </TableCell>
          <TableCell>{bet.event}</TableCell>
          <TableCell>{bet.selection}</TableCell>
          <TableCell>{bet.odds}</TableCell>
          <TableCell>${bet.stake}</TableCell>
          <TableCell>
            <Badge
              variant={actualStatus === "won" ? "success" : actualStatus === "lost" ? "destructive" : "secondary"}
              className={`flex w-24 items-center justify-center gap-1 ${
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
          </TableCell>
          <TableCell
            className={`text-right ${bet.profit > 0 ? "text-green-600" : bet.profit < 0 ? "text-red-600" : ""}`}
          >
            {bet.profit > 0 ? `+$${bet.profit}` : bet.profit < 0 ? `-$${Math.abs(bet.profit)}` : "$0"}
          </TableCell>
          <TableCell>{bet.bookie}</TableCell>
          <TableCell>{bet.strategy}</TableCell>
          <TableCell>{bet.tipper}</TableCell>
        </TableRow>
      )
    } else {
      // Parse the notes to extract lay bet details
      let layExchange = ""
      let layOdds = ""
      let layStake = ""

      if (bet.notes) {
        const layMatch = bet.notes.match(/Lay: ([^@]+) @ ([^ ]+) - Stake: \$([^ ]+)/)
        if (layMatch) {
          layExchange = layMatch[1]
          layOdds = layMatch[2]
          layStake = layMatch[3]
        }
      }

      // Back & Lay bet rendering - stacked in a single row
      return (
        <TableRow key={bet.id}>
          <TableCell>
            {bet.date} {bet.time}
          </TableCell>
          <TableCell>{bet.event}</TableCell>
          <TableCell>
            <div className="space-y-1">
              <div className="flex items-center">
                <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900 px-1 rounded mr-1">BACK</span>
                {bet.selection}
              </div>
              <div className="flex items-center">
                <span className="text-xs font-medium bg-red-100 dark:bg-red-900 px-1 rounded mr-1">LAY</span>
                {bet.selection}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1">
              <div className="text-blue-600">{bet.odds}</div>
              <div className="text-red-600">{layOdds}</div>
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1">
              <div className="text-blue-600">${bet.stake}</div>
              <div className="text-red-600">${layStake}</div>
            </div>
          </TableCell>
          <TableCell>
            <Badge
              variant={actualStatus === "won" ? "success" : actualStatus === "lost" ? "destructive" : "secondary"}
              className={`flex w-24 items-center justify-center gap-1 ${
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
          </TableCell>
          <TableCell
            className={`text-right ${bet.profit > 0 ? "text-green-600" : bet.profit < 0 ? "text-red-600" : ""}`}
          >
            {bet.profit > 0 ? `+$${bet.profit}` : bet.profit < 0 ? `-$${Math.abs(bet.profit)}` : "$0"}
          </TableCell>
          <TableCell>
            <div className="space-y-1">
              <div>{bet.bookie}</div>
              <div>{layExchange}</div>
            </div>
          </TableCell>
          <TableCell>{bet.strategy}</TableCell>
          <TableCell>{bet.tipper}</TableCell>
        </TableRow>
      )
    }
  }

  // Sort bets by date and time (most recent first)
  const sortedBets = [...allBets].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}:00`)
    const dateB = new Date(`${b.date}T${b.time}:00`)
    return dateB - dateA
  })

  // Take only the 10 most recent bets
  const recentBets = sortedBets.slice(0, 10)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date & Time</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Selection</TableHead>
          <TableHead>Odds</TableHead>
          <TableHead>Stake</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Profit/Loss</TableHead>
          <TableHead>Bookie</TableHead>
          <TableHead>Strategy</TableHead>
          <TableHead>Tipper</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{recentBets.map((bet) => renderBetRow(bet))}</TableBody>
    </Table>
  )
}
