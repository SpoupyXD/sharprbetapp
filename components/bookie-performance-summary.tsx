"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown } from "lucide-react"

export function BookiePerformanceSummary() {
  const [timeframe, setTimeframe] = useState("all")

  // Sample data for bookmaker performance
  const bookmakerData = [
    {
      name: "Bet365",
      wagers: 5200,
      netProfit: 780.5,
      unitProfit: 15.01,
      return: 15.01,
      wins: 42,
      bets: 68,
      winRate: 61.76,
    },
    {
      name: "Betfair",
      wagers: 4100,
      netProfit: 615,
      unitProfit: 15.0,
      return: 15.0,
      wins: 31,
      bets: 45,
      winRate: 68.89,
    },
    {
      name: "William Hill",
      wagers: 2500,
      netProfit: 325.25,
      unitProfit: 13.01,
      return: 13.01,
      wins: 19,
      bets: 32,
      winRate: 59.38,
    },
    {
      name: "Sportsbet",
      wagers: 2200,
      netProfit: 187.5,
      unitProfit: 8.52,
      return: 8.52,
      wins: 18,
      bets: 29,
      winRate: 62.07,
    },
    {
      name: "Unibet",
      wagers: 1800,
      netProfit: -95.5,
      unitProfit: -5.31,
      return: -5.31,
      wins: 12,
      bets: 24,
      winRate: 50.0,
    },
    {
      name: "Ladbrokes",
      wagers: 3800,
      netProfit: -120.75,
      unitProfit: -3.18,
      return: -3.18,
      wins: 28,
      bets: 54,
      winRate: 51.85,
    },
  ]

  // Calculate totals
  const totals = bookmakerData.reduce(
    (acc, bookie) => {
      acc.wagers += bookie.wagers
      acc.netProfit += bookie.netProfit
      acc.wins += bookie.wins
      acc.bets += bookie.bets
      return acc
    },
    { wagers: 0, netProfit: 0, wins: 0, bets: 0 },
  )

  const totalUnitProfit = (totals.netProfit / totals.wagers) * 100
  const totalWinRate = (totals.wins / totals.bets) * 100

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Bookmaker Performance Summary</CardTitle>
          <p className="text-sm text-muted-foreground">Track your performance across all bookmakers</p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bookmaker</TableHead>
                <TableHead className="text-right">Wagers ($)</TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end">
                    Net Profit ($)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Unit Profit (%)</TableHead>
                <TableHead className="text-right">Return (%)</TableHead>
                <TableHead className="text-right">Wins</TableHead>
                <TableHead className="text-right">Bets</TableHead>
                <TableHead className="text-right">Win %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookmakerData.map((bookie) => (
                <TableRow key={bookie.name}>
                  <TableCell className="font-medium">{bookie.name}</TableCell>
                  <TableCell className="text-right">${bookie.wagers.toLocaleString()}</TableCell>
                  <TableCell className={`text-right ${bookie.netProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {bookie.netProfit >= 0 ? "+" : ""}${bookie.netProfit.toFixed(2)}
                  </TableCell>
                  <TableCell className={`text-right ${bookie.unitProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {bookie.unitProfit >= 0 ? "+" : ""}
                    {bookie.unitProfit.toFixed(2)}%
                  </TableCell>
                  <TableCell className={`text-right ${bookie.return >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {bookie.return >= 0 ? "+" : ""}
                    {bookie.return.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">{bookie.wins}</TableCell>
                  <TableCell className="text-right">{bookie.bets}</TableCell>
                  <TableCell className="text-right text-green-500">{bookie.winRate.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-right">${totals.wagers.toLocaleString()}</TableCell>
                <TableCell className={`text-right ${totals.netProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {totals.netProfit >= 0 ? "+" : ""}${totals.netProfit.toFixed(2)}
                </TableCell>
                <TableCell className={`text-right ${totalUnitProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {totalUnitProfit >= 0 ? "+" : ""}
                  {totalUnitProfit.toFixed(2)}%
                </TableCell>
                <TableCell className={`text-right ${totalUnitProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {totalUnitProfit >= 0 ? "+" : ""}
                  {totalUnitProfit.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right">{totals.wins}</TableCell>
                <TableCell className="text-right">{totals.bets}</TableCell>
                <TableCell className="text-right text-green-500">{totalWinRate.toFixed(2)}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
