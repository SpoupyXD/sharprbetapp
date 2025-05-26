"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Sample data for bookmaker balances and bonus bets
const bookmakerData = [
  {
    name: "Bet365",
    netDeposits: 1200,
    bonusCredit: 0,
    freeBetsRemaining: 50,
    concludedWagers: 3500,
    netWinnings: 250,
    pendingBetsQuantity: 2,
    pendingBetsRisk: 100,
    creditFacilityRemaining: 0,
    availableFunds: 1450,
  },
  {
    name: "Ladbrokes",
    netDeposits: 800,
    bonusCredit: 0,
    freeBetsRemaining: 0,
    concludedWagers: 2200,
    netWinnings: -120,
    pendingBetsQuantity: 1,
    pendingBetsRisk: 50,
    creditFacilityRemaining: 0,
    availableFunds: 680,
  },
  {
    name: "William Hill",
    netDeposits: 1100,
    bonusCredit: 25,
    freeBetsRemaining: 75,
    concludedWagers: 2800,
    netWinnings: 325,
    pendingBetsQuantity: 0,
    pendingBetsRisk: 0,
    creditFacilityRemaining: 0,
    availableFunds: 1425,
  },
  {
    name: "Betfair",
    netDeposits: 900,
    bonusCredit: 0,
    freeBetsRemaining: 0,
    concludedWagers: 1800,
    netWinnings: 615,
    pendingBetsQuantity: 3,
    pendingBetsRisk: 150,
    creditFacilityRemaining: 0,
    availableFunds: 1515,
  },
  {
    name: "Unibet",
    netDeposits: 600,
    bonusCredit: 0,
    freeBetsRemaining: 25,
    concludedWagers: 1500,
    netWinnings: -95,
    pendingBetsQuantity: 1,
    pendingBetsRisk: 75,
    creditFacilityRemaining: 0,
    availableFunds: 505,
  },
  {
    name: "Sportsbet",
    netDeposits: 630,
    bonusCredit: 0,
    freeBetsRemaining: 30,
    concludedWagers: 1400,
    netWinnings: 187,
    pendingBetsQuantity: 0,
    pendingBetsRisk: 0,
    creditFacilityRemaining: 0,
    availableFunds: 817,
  },
]

export function BonusBetsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  // Calculate totals
  const totals = bookmakerData.reduce(
    (acc, bookie) => {
      acc.netDeposits += bookie.netDeposits
      acc.bonusCredit += bookie.bonusCredit
      acc.freeBetsRemaining += bookie.freeBetsRemaining
      acc.concludedWagers += bookie.concludedWagers
      acc.netWinnings += bookie.netWinnings
      acc.pendingBetsQuantity += bookie.pendingBetsQuantity
      acc.pendingBetsRisk += bookie.pendingBetsRisk
      acc.creditFacilityRemaining += bookie.creditFacilityRemaining
      acc.availableFunds += bookie.availableFunds
      return acc
    },
    {
      netDeposits: 0,
      bonusCredit: 0,
      freeBetsRemaining: 0,
      concludedWagers: 0,
      netWinnings: 0,
      pendingBetsQuantity: 0,
      pendingBetsRisk: 0,
      creditFacilityRemaining: 0,
      availableFunds: 0,
    },
  )

  // Filter bookmakers based on search term
  const filteredBookmakers = bookmakerData.filter((bookie) =>
    bookie.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort bookmakers based on sort criteria
  const sortedBookmakers = [...filteredBookmakers].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]

    if (typeof aValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    } else {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }
  })

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Bookmaker Balances & Bonus Bets</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track your deposits, bonuses, and available funds across all bookmakers
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bookmakers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold" onClick={() => handleSort("name")}>
                  Bookmaker
                </TableHead>
                <TableHead className="text-right font-bold" onClick={() => handleSort("netDeposits")}>
                  Net Deposits
                </TableHead>
                <TableHead className="text-right font-bold" onClick={() => handleSort("bonusCredit")}>
                  Bonus Credit
                </TableHead>
                <TableHead className="text-right font-bold" onClick={() => handleSort("freeBetsRemaining")}>
                  Free Bets Remaining
                </TableHead>
                <TableHead className="text-right font-bold" onClick={() => handleSort("concludedWagers")}>
                  Concluded Wagers
                </TableHead>
                <TableHead className="text-right font-bold" onClick={() => handleSort("netWinnings")}>
                  Net Winnings
                </TableHead>
                <TableHead className="text-right font-bold" onClick={() => handleSort("pendingBetsQuantity")}>
                  Pending Bets (quantity)
                </TableHead>
                <TableHead className="text-right font-bold" onClick={() => handleSort("pendingBetsRisk")}>
                  Pending Bets (funds at risk)
                </TableHead>
                <TableHead className="text-right font-bold" onClick={() => handleSort("creditFacilityRemaining")}>
                  Credit Facility Remaining
                </TableHead>
                <TableHead className="text-right font-bold" onClick={() => handleSort("availableFunds")}>
                  Available Funds
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="font-bold bg-primary/10">
                <TableCell>Totals</TableCell>
                <TableCell className="text-right">${totals.netDeposits.toLocaleString()}</TableCell>
                <TableCell className="text-right">${totals.bonusCredit.toLocaleString()}</TableCell>
                <TableCell className="text-right">${totals.freeBetsRemaining.toLocaleString()}</TableCell>
                <TableCell className="text-right">${totals.concludedWagers.toLocaleString()}</TableCell>
                <TableCell className={`text-right ${totals.netWinnings >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {totals.netWinnings >= 0 ? "$" : "-$"}
                  {Math.abs(totals.netWinnings).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">{totals.pendingBetsQuantity}</TableCell>
                <TableCell className="text-right">${totals.pendingBetsRisk.toLocaleString()}</TableCell>
                <TableCell className="text-right">${totals.creditFacilityRemaining.toLocaleString()}</TableCell>
                <TableCell className="text-right">${totals.availableFunds.toLocaleString()}</TableCell>
              </TableRow>
              {sortedBookmakers.map((bookie) => (
                <TableRow key={bookie.name}>
                  <TableCell className="font-medium">{bookie.name}</TableCell>
                  <TableCell className="text-right">${bookie.netDeposits.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${bookie.bonusCredit.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${bookie.freeBetsRemaining.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${bookie.concludedWagers.toLocaleString()}</TableCell>
                  <TableCell className={`text-right ${bookie.netWinnings >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {bookie.netWinnings >= 0 ? "$" : "-$"}
                    {Math.abs(bookie.netWinnings).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{bookie.pendingBetsQuantity}</TableCell>
                  <TableCell className="text-right">${bookie.pendingBetsRisk.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${bookie.creditFacilityRemaining.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${bookie.availableFunds.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
