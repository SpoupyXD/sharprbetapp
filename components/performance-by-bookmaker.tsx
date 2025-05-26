"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

// Sample data for bookmaker performance
const bookmakerPerformance = [
  {
    id: 1,
    name: "Bet365",
    wagers: 17894.29,
    netProfit: 3307.68,
    unitProfit: 18.48,
    return: 18.48,
    includingBonus: 3307.68,
    wins: 134,
    bets: 371,
    winRate: 36.1,
  },
  {
    id: 2,
    name: "Ladbrokes",
    wagers: 853.91,
    netProfit: -98.65,
    unitProfit: -11.55,
    return: -11.55,
    includingBonus: -98.65,
    wins: 20,
    bets: 45,
    winRate: 44.4,
  },
  {
    id: 3,
    name: "William Hill",
    wagers: 1359.81,
    netProfit: 299.88,
    unitProfit: 22.05,
    return: 22.05,
    includingBonus: 299.88,
    wins: 23,
    bets: 42,
    winRate: 54.8,
  },
  {
    id: 4,
    name: "Betfair",
    wagers: 2280.0,
    netProfit: 103.46,
    unitProfit: 4.54,
    return: 4.54,
    includingBonus: 103.46,
    wins: 13,
    bets: 26,
    winRate: 50.0,
  },
  {
    id: 5,
    name: "Unibet",
    wagers: 7353.28,
    netProfit: 2346.09,
    unitProfit: 31.91,
    return: 31.91,
    includingBonus: 2346.09,
    wins: 29,
    bets: 62,
    winRate: 46.8,
  },
  {
    id: 6,
    name: "Sportsbet",
    wagers: 1563.48,
    netProfit: -169.31,
    unitProfit: -10.83,
    return: -10.83,
    includingBonus: -169.31,
    wins: 40,
    bets: 88,
    winRate: 45.5,
  },
  {
    id: 7,
    name: "PointsBet",
    wagers: 1809.01,
    netProfit: 271.04,
    unitProfit: 14.98,
    return: 14.98,
    includingBonus: 271.04,
    wins: 42,
    bets: 79,
    winRate: 53.2,
  },
  {
    id: 8,
    name: "TAB",
    wagers: 2840.0,
    netProfit: -742.96,
    unitProfit: -26.16,
    return: -26.16,
    includingBonus: -742.96,
    wins: 3,
    bets: 13,
    winRate: 23.1,
  },
  {
    id: 9,
    name: "Neds",
    wagers: 125.0,
    netProfit: -125.0,
    unitProfit: -100.0,
    return: -100.0,
    includingBonus: -125.0,
    wins: 0,
    bets: 3,
    winRate: 0.0,
  },
  {
    id: 10,
    name: "BlueBet",
    wagers: 210.0,
    netProfit: 310.0,
    unitProfit: 147.62,
    return: 147.62,
    includingBonus: 310.0,
    wins: 2,
    bets: 3,
    winRate: 66.7,
  },
]

export function PerformanceByBookmaker() {
  const [sortColumn, setSortColumn] = useState("netProfit")
  const [sortDirection, setSortDirection] = useState("desc")

  // Sort the data based on the selected column and direction
  const sortedData = [...bookmakerPerformance].sort((a, b) => {
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Calculate totals for the summary row
  const totals = bookmakerPerformance.reduce(
    (acc, bookie) => {
      acc.wagers += bookie.wagers
      acc.netProfit += bookie.netProfit
      acc.wins += bookie.wins
      acc.bets += bookie.bets
      return acc
    },
    { wagers: 0, netProfit: 0, wins: 0, bets: 0 },
  )

  // Calculate derived totals
  const totalReturn = (totals.netProfit / totals.wagers) * 100
  const totalWinRate = (totals.wins / totals.bets) * 100

  // Function to handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  // Function to render sort indicator
  const renderSortIndicator = (column) => {
    if (sortColumn === column) {
      return <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Bookmaker</CardTitle>
        <CardDescription>Detailed breakdown of your performance with each bookmaker</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("name")}>
                    Bookmaker {renderSortIndicator("name")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("wagers")}>
                    Wagers ($) {renderSortIndicator("wagers")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("netProfit")}>
                    Net Profit ($) {renderSortIndicator("netProfit")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("unitProfit")}>
                    Unit Profit {renderSortIndicator("unitProfit")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("return")}>
                    Return (%) {renderSortIndicator("return")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("includingBonus")}>
                    Inc. Bonus ($) {renderSortIndicator("includingBonus")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("wins")}>
                    Wins {renderSortIndicator("wins")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("bets")}>
                    Bets {renderSortIndicator("bets")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("winRate")}>
                    Win % {renderSortIndicator("winRate")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((bookie) => (
                <TableRow key={bookie.id}>
                  <TableCell className="font-medium">{bookie.name}</TableCell>
                  <TableCell className="text-right">
                    ${bookie.wagers.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell
                    className={`text-right ${bookie.netProfit > 0 ? "text-green-600" : bookie.netProfit < 0 ? "text-red-600" : ""}`}
                  >
                    {bookie.netProfit > 0 ? "+" : ""}$
                    {Math.abs(bookie.netProfit).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell
                    className={`text-right ${bookie.unitProfit > 0 ? "text-green-600" : bookie.unitProfit < 0 ? "text-red-600" : ""}`}
                  >
                    {bookie.unitProfit > 0 ? "+" : ""}
                    {bookie.unitProfit.toFixed(2)}
                  </TableCell>
                  <TableCell
                    className={`text-right ${bookie.return > 0 ? "text-green-600" : bookie.return < 0 ? "text-red-600" : ""}`}
                  >
                    {bookie.return > 0 ? "+" : ""}
                    {bookie.return.toFixed(2)}%
                  </TableCell>
                  <TableCell
                    className={`text-right ${bookie.includingBonus > 0 ? "text-green-600" : bookie.includingBonus < 0 ? "text-red-600" : ""}`}
                  >
                    {bookie.includingBonus > 0 ? "+" : ""}$
                    {Math.abs(bookie.includingBonus).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">{bookie.wins}</TableCell>
                  <TableCell className="text-right">{bookie.bets}</TableCell>
                  <TableCell
                    className={`text-right ${bookie.winRate > 55 ? "text-green-600" : bookie.winRate < 45 ? "text-red-600" : ""}`}
                  >
                    {bookie.winRate.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-medium">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-right">
                  ${totals.wagers.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell
                  className={`text-right ${totals.netProfit > 0 ? "text-green-600" : totals.netProfit < 0 ? "text-red-600" : ""}`}
                >
                  {totals.netProfit > 0 ? "+" : ""}$
                  {Math.abs(totals.netProfit).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell
                  className={`text-right ${totalReturn > 0 ? "text-green-600" : totalReturn < 0 ? "text-red-600" : ""}`}
                >
                  {totalReturn > 0 ? "+" : ""}
                  {((totals.netProfit / totals.wagers) * 100).toFixed(2)}
                </TableCell>
                <TableCell
                  className={`text-right ${totalReturn > 0 ? "text-green-600" : totalReturn < 0 ? "text-red-600" : ""}`}
                >
                  {totalReturn > 0 ? "+" : ""}
                  {totalReturn.toFixed(2)}%
                </TableCell>
                <TableCell
                  className={`text-right ${totals.netProfit > 0 ? "text-green-600" : totals.netProfit < 0 ? "text-red-600" : ""}`}
                >
                  {totals.netProfit > 0 ? "+" : ""}$
                  {Math.abs(totals.netProfit).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-right">{totals.wins}</TableCell>
                <TableCell className="text-right">{totals.bets}</TableCell>
                <TableCell
                  className={`text-right ${totalWinRate > 55 ? "text-green-600" : totalWinRate < 45 ? "text-red-600" : ""}`}
                >
                  {totalWinRate.toFixed(1)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
