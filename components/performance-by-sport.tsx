"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

// Sample data for sport performance
const sportPerformance = [
  {
    id: 1,
    name: "Horse Racing",
    wagers: 37284.38,
    netProfit: 5227.77,
    unitProfit: 14.02,
    return: 14.02,
    includingBonus: 5227.77,
    wins: 134,
    bets: 371,
    winRate: 36.1,
  },
  {
    id: 2,
    name: "Football - EPL",
    wagers: 9922.18,
    netProfit: -152.39,
    unitProfit: -1.54,
    return: -1.54,
    includingBonus: -152.39,
    wins: 64,
    bets: 145,
    winRate: 44.1,
  },
  {
    id: 3,
    name: "Tennis",
    wagers: 870.0,
    netProfit: 153.85,
    unitProfit: 17.68,
    return: 17.68,
    includingBonus: 153.85,
    wins: 6,
    bets: 12,
    winRate: 50.0,
  },
  {
    id: 4,
    name: "NBA",
    wagers: 5113.93,
    netProfit: 334.41,
    unitProfit: 6.54,
    return: 6.54,
    includingBonus: 334.41,
    wins: 301,
    bets: 733,
    winRate: 41.1,
  },
  {
    id: 5,
    name: "Cricket",
    wagers: 1624.02,
    netProfit: 174.05,
    unitProfit: 10.72,
    return: 10.72,
    includingBonus: 174.05,
    wins: 6,
    bets: 9,
    winRate: 66.7,
  },
  {
    id: 6,
    name: "AFL",
    wagers: 560.0,
    netProfit: -467.0,
    unitProfit: -83.39,
    return: -83.39,
    includingBonus: -467.0,
    wins: 1,
    bets: 9,
    winRate: 11.1,
  },
  {
    id: 7,
    name: "Soccer",
    wagers: 2828.75,
    netProfit: 54.42,
    unitProfit: 1.92,
    return: 1.92,
    includingBonus: 54.42,
    wins: 15,
    bets: 32,
    winRate: 46.9,
  },
  {
    id: 8,
    name: "Formula 1",
    wagers: 120.0,
    netProfit: 30.5,
    unitProfit: 25.42,
    return: 25.42,
    includingBonus: 30.5,
    wins: 2,
    bets: 3,
    winRate: 66.7,
  },
]

export function PerformanceBySport() {
  const [sortColumn, setSortColumn] = useState("netProfit")
  const [sortDirection, setSortDirection] = useState("desc")

  // Sort the data based on the selected column and direction
  const sortedData = [...sportPerformance].sort((a, b) => {
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Calculate totals for the summary row
  const totals = sportPerformance.reduce(
    (acc, sport) => {
      acc.wagers += sport.wagers
      acc.netProfit += sport.netProfit
      acc.wins += sport.wins
      acc.bets += sport.bets
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
        <CardTitle>Performance by Sport</CardTitle>
        <CardDescription>Detailed breakdown of your performance across different sports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("name")}>
                    Sport {renderSortIndicator("name")}
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
              {sortedData.map((sport) => (
                <TableRow key={sport.id}>
                  <TableCell className="font-medium">{sport.name}</TableCell>
                  <TableCell className="text-right">
                    ${sport.wagers.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell
                    className={`text-right ${sport.netProfit > 0 ? "text-green-600" : sport.netProfit < 0 ? "text-red-600" : ""}`}
                  >
                    {sport.netProfit > 0 ? "+" : ""}$
                    {Math.abs(sport.netProfit).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell
                    className={`text-right ${sport.unitProfit > 0 ? "text-green-600" : sport.unitProfit < 0 ? "text-red-600" : ""}`}
                  >
                    {sport.unitProfit > 0 ? "+" : ""}
                    {sport.unitProfit.toFixed(2)}
                  </TableCell>
                  <TableCell
                    className={`text-right ${sport.return > 0 ? "text-green-600" : sport.return < 0 ? "text-red-600" : ""}`}
                  >
                    {sport.return > 0 ? "+" : ""}
                    {sport.return.toFixed(2)}%
                  </TableCell>
                  <TableCell
                    className={`text-right ${sport.includingBonus > 0 ? "text-green-600" : sport.includingBonus < 0 ? "text-red-600" : ""}`}
                  >
                    {sport.includingBonus > 0 ? "+" : ""}$
                    {Math.abs(sport.includingBonus).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">{sport.wins}</TableCell>
                  <TableCell className="text-right">{sport.bets}</TableCell>
                  <TableCell
                    className={`text-right ${sport.winRate > 55 ? "text-green-600" : sport.winRate < 45 ? "text-red-600" : ""}`}
                  >
                    {sport.winRate.toFixed(1)}%
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
