"use client"
import { Edit, ExternalLink, MoreHorizontal, Trash, Link2, Building, Repeat, Lock, Eye, EyeOff } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const bookies = [
  {
    id: "bank-1",
    name: "Chase Bank",
    logo: "/placeholder.svg?height=40&width=40",
    balance: 3500,
    netDeposits: 500,
    website: "https://www.chase.com",
    notes: "Main bank account for deposits/withdrawals",
    color: "#4287f5",
    owner: "Victor",
    type: "bank",
    linkGroup: "main-accounts",
  },
  {
    id: "bank-2",
    name: "Bank of America",
    logo: "/placeholder.svg?height=40&width=40",
    balance: 2800,
    netDeposits: -200,
    website: "https://www.bankofamerica.com",
    notes: "Secondary bank account",
    color: "#e63946",
    owner: "Naomi",
    type: "bank",
    linkGroup: "naomi-accounts",
  },
  {
    id: "bookie-4",
    name: "Betfair",
    logo: "/placeholder.svg?height=40&width=40",
    balance: 900,
    netDeposits: 200,
    website: "https://www.betfair.com",
    notes: "Exchange betting and laying",
    color: "#FF8042",
    owner: "Victor",
    type: "exchange",
    linkGroup: "main-accounts",
  },
  {
    id: "bookie-1",
    name: "Bet365",
    logo: "/placeholder.svg?height=40&width=40",
    balance: 1200,
    netDeposits: 300,
    website: "https://www.bet365.com",
    notes: "Main account for football betting",
    color: "#0088FE",
    owner: "Victor",
    type: "bookie",
    linkGroup: "main-accounts",
  },
  {
    id: "bookie-2",
    name: "Ladbrokes",
    logo: "/placeholder.svg?height=40&width=40",
    balance: 800,
    netDeposits: -50,
    website: "https://www.ladbrokes.com",
    notes: "Used for horse racing",
    color: "#00C49F",
    owner: "Victor",
    type: "bookie",
    linkGroup: "main-accounts",
  },
  {
    id: "bookie-3",
    name: "William Hill",
    logo: "/placeholder.svg?height=40&width=40",
    balance: 1100,
    netDeposits: 100,
    website: "https://www.williamhill.com",
    notes: "Tennis and golf betting",
    color: "#FFBB28",
    owner: "Naomi",
    type: "bookie",
    linkGroup: "naomi-accounts",
  },
  {
    id: "bookie-5",
    name: "Unibet",
    logo: "/placeholder.svg?height=40&width=40",
    balance: 600,
    netDeposits: -75,
    website: "https://www.unibet.com",
    notes: "MMA and boxing bets",
    color: "#8884d8",
    owner: "Naomi",
    type: "bookie",
    linkGroup: "naomi-accounts",
  },
  {
    id: "bookie-6",
    name: "Sportsbet",
    logo: "/placeholder.svg?height=40&width=40",
    balance: 630,
    netDeposits: 150,
    website: "https://www.sportsbet.com",
    notes: "Australian sports",
    color: "#82ca9d",
    owner: "Victor",
    type: "bookie",
    linkGroup: "main-accounts",
  },
]

export function BookiesList() {
  const [isPremium, setIsPremium] = useState(false) // For testing purposes
  const [selectedOwner, setSelectedOwner] = useState("Victor") // Default owner for non-premium users
  const [showNotes, setShowNotes] = useState(true) // Toggle for notes column
  const [accountTypeFilter, setAccountTypeFilter] = useState("all") // Filter for account types

  const togglePremium = () => {
    setIsPremium((prev) => !prev)
  }

  const toggleNotes = () => {
    setShowNotes((prev) => !prev)
  }

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case "exchange":
        return <Repeat className="h-4 w-4 text-blue-500 dark:text-blue-400" />
      case "bank":
        return <Building className="h-4 w-4 text-green-600 dark:text-green-400" />
      default:
        return null
    }
  }

  const getAccountTypeBackground = (type) => {
    switch (type) {
      case "bank":
        return "bg-green-50 dark:bg-green-950/30"
      case "exchange":
        return "bg-blue-50 dark:bg-blue-950/30"
      default:
        return ""
    }
  }

  const linkGroups = bookies.reduce((groups, bookie) => {
    if (bookie.linkGroup) {
      if (!groups[bookie.linkGroup]) {
        groups[bookie.linkGroup] = []
      }
      groups[bookie.linkGroup].push(bookie.id)
    }
    return groups
  }, {})

  const owners = [...new Set(bookies.map((bookie) => bookie.owner))].filter(Boolean)

  // Filter by owner (for non-premium) and account type
  const filteredBookies = bookies.filter((bookie) => {
    // Owner filter (only for non-premium)
    if (!isPremium && bookie.owner !== selectedOwner) {
      return false
    }

    // Account type filter
    if (accountTypeFilter !== "all" && bookie.type !== accountTypeFilter) {
      return false
    }

    return true
  })

  // Group bookies by owner first (for premium users)
  const groupedBookies = filteredBookies.reduce((acc, bookie) => {
    if (!acc[bookie.owner]) {
      acc[bookie.owner] = []
    }
    acc[bookie.owner].push(bookie)
    return acc
  }, {})

  // Sort each owner's bookies by type
  Object.keys(groupedBookies).forEach((owner) => {
    groupedBookies[owner].sort((a, b) => {
      const typeOrder = { bank: 1, exchange: 2, bookie: 3 }
      const typeComparison = typeOrder[a.type] - typeOrder[b.type]

      if (typeComparison !== 0) return typeComparison
      return a.name.localeCompare(b.name)
    })
  })

  // For premium users, we want to display all owners' bookies grouped together
  // For free users, we only display the selected owner's bookies
  const sortedOwners = isPremium ? Object.keys(groupedBookies).sort() : [selectedOwner]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="bank">Banks</SelectItem>
              <SelectItem value="exchange">Exchanges</SelectItem>
              <SelectItem value="bookie">Bookies</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={toggleNotes} className="flex items-center gap-1">
            {showNotes ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showNotes ? "Hide Notes" : "Show Notes"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {!isPremium && (
            <div className="relative">
              <select
                className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
              >
                {owners.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
            </div>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Premium Features Available
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80 text-sm">
                  Multiple owner management is available for premium users. Upgrade to manage accounts across different
                  owners.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="outline" size="sm" onClick={togglePremium} className="ml-2 flex items-center gap-1">
            {isPremium ? "Pro" : "Free"}
            {isPremium && <span className="h-2 w-2 rounded-full bg-green-500"></span>}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Net Deposits</TableHead>
              <TableHead>Owner</TableHead>
              {showNotes && <TableHead>Notes</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOwners.map((owner) => (
              <React.Fragment key={owner}>
                {isPremium && groupedBookies[owner]?.length > 0 && (
                  <TableRow key={`header-${owner}`}>
                    <TableCell colSpan={showNotes ? 7 : 6} className="bg-muted/50 py-1">
                      <div className="font-medium">{owner}'s Accounts</div>
                    </TableCell>
                  </TableRow>
                )}
                {groupedBookies[owner]?.map((bookie) => (
                  <TableRow key={bookie.id} className={getAccountTypeBackground(bookie.type)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: bookie.color }}
                        >
                          {bookie.name.charAt(0)}
                        </div>
                        <div className="font-medium">{bookie.name}</div>
                        {linkGroups[bookie.linkGroup]?.length > 1 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link2 className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Linked account</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getAccountTypeIcon(bookie.type)}
                        <span className="capitalize">{bookie.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${bookie.balance}</TableCell>
                    <TableCell className={bookie.netDeposits >= 0 ? "text-green-600" : "text-red-600"}>
                      {bookie.netDeposits >= 0 ? "+" : "-"}${Math.abs(bookie.netDeposits)}
                    </TableCell>
                    <TableCell>
                      {bookie.owner ? (
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {bookie.owner}
                          </Badge>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    {showNotes && (
                      <TableCell className="max-w-[200px] truncate" title={bookie.notes}>
                        {bookie.notes}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={bookie.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Visit Website</span>
                          </a>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={!isPremium} className="flex items-center gap-1">
                              <Link2 className="mr-2 h-4 w-4" />
                              Manage Links
                              {!isPremium && <Lock className="h-3 w-3 ml-1" />}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
            {Object.values(groupedBookies).flat().length === 0 && (
              <TableRow>
                <TableCell colSpan={showNotes ? 7 : 6} className="text-center py-6 text-muted-foreground">
                  No accounts found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
