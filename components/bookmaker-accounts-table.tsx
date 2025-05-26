"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building,
  ChevronLeft,
  ChevronRight,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Link2,
  Lock,
  MoreHorizontal,
  Repeat,
  Search,
  Trash,
} from "lucide-react"

// Sample data for different profile sets
const profileSets = [
  {
    id: "personal",
    name: "Victor",
    data: [
      {
        id: "bank-1",
        name: "Chase Bank",
        logo: "/placeholder.svg?height=40&width=40",
        netDeposits: 3500,
        bonusBets: 0,
        concludedWagers: 5000,
        netWinnings: 500,
        pendingBetsQuantity: 0,
        pendingBetsRisk: 0,
        availableFunds: 4000,
        website: "https://www.chase.com",
        notes: "Main bank account for deposits/withdrawals",
        color: "#4287f5",
        owner: "Victor",
        type: "bank",
        linkGroup: "main-accounts",
      },
      {
        id: "bookie-4",
        name: "Betfair",
        logo: "/placeholder.svg?height=40&width=40",
        netDeposits: 900,
        bonusBets: 0,
        concludedWagers: 1800,
        netWinnings: 615,
        pendingBetsQuantity: 3,
        pendingBetsRisk: 150,
        availableFunds: 1365,
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
        netDeposits: 1200,
        bonusBets: 50,
        concludedWagers: 3500,
        netWinnings: 250,
        pendingBetsQuantity: 2,
        pendingBetsRisk: 100,
        availableFunds: 1400,
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
        netDeposits: 800,
        bonusBets: 0,
        concludedWagers: 2200,
        netWinnings: -120,
        pendingBetsQuantity: 1,
        pendingBetsRisk: 50,
        availableFunds: 630,
        website: "https://www.ladbrokes.com",
        notes: "Used for horse racing",
        color: "#00C49F",
        owner: "Victor",
        type: "bookie",
        linkGroup: "main-accounts",
      },
      {
        id: "bookie-6",
        name: "Sportsbet",
        logo: "/placeholder.svg?height=40&width=40",
        netDeposits: 630,
        bonusBets: 30,
        concludedWagers: 1400,
        netWinnings: 187,
        pendingBetsQuantity: 0,
        pendingBetsRisk: 0,
        availableFunds: 847,
        website: "https://www.sportsbet.com",
        notes: "Australian sports",
        color: "#82ca9d",
        owner: "Victor",
        type: "bookie",
        linkGroup: "main-accounts",
      },
    ],
  },
  {
    id: "family",
    name: "Naomi",
    premium: true,
    data: [
      {
        id: "bank-2",
        name: "Bank of America",
        logo: "/placeholder.svg?height=40&width=40",
        netDeposits: 2800,
        bonusBets: 0,
        concludedWagers: 3000,
        netWinnings: -200,
        pendingBetsQuantity: 0,
        pendingBetsRisk: 0,
        availableFunds: 2600,
        website: "https://www.bankofamerica.com",
        notes: "Secondary bank account",
        color: "#e63946",
        owner: "Naomi",
        type: "bank",
        linkGroup: "naomi-accounts",
      },
      {
        id: "bookie-3",
        name: "William Hill",
        logo: "/placeholder.svg?height=40&width=40",
        netDeposits: 1100,
        bonusBets: 25,
        concludedWagers: 2800,
        netWinnings: 325,
        pendingBetsQuantity: 0,
        pendingBetsRisk: 0,
        availableFunds: 1425,
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
        netDeposits: 600,
        bonusBets: 25,
        concludedWagers: 1500,
        netWinnings: -95,
        pendingBetsQuantity: 1,
        pendingBetsRisk: 75,
        availableFunds: 455,
        website: "https://www.unibet.com",
        notes: "MMA and boxing bets",
        color: "#8884d8",
        owner: "Naomi",
        type: "bookie",
        linkGroup: "naomi-accounts",
      },
    ],
  },
]

export function BookmakerAccountsTable() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [isPremium, setIsPremium] = useState(false) // For testing purposes
  const [searchTerm, setSearchTerm] = useState("")
  const [showNotes, setShowNotes] = useState(true)
  const [accountTypeFilter, setAccountTypeFilter] = useState("all")
  const currentProfile = profileSets[currentProfileIndex]

  // Toggle premium status for testing
  const togglePremium = () => {
    setIsPremium((prev) => !prev)
  }

  // Toggle notes column visibility
  const toggleNotes = () => {
    setShowNotes((prev) => !prev)
  }

  // Navigation between profiles
  const nextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % profileSets.length)
  }

  const prevProfile = () => {
    setCurrentProfileIndex((prev) => (prev - 1 + profileSets.length) % profileSets.length)
  }

  // Get icon for account type
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

  // Get background color for account type
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

  // Find linked accounts
  const linkGroups = currentProfile.data.reduce((groups, account) => {
    if (account.linkGroup) {
      if (!groups[account.linkGroup]) {
        groups[account.linkGroup] = []
      }
      groups[account.linkGroup].push(account.id)
    }
    return groups
  }, {})

  // Filter accounts by type and search term
  const filteredAccounts = currentProfile.data.filter((account) => {
    // Account type filter
    if (accountTypeFilter !== "all" && account.type !== accountTypeFilter) {
      return false
    }

    // Search filter
    if (searchTerm && !account.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    return true
  })

  // Sort accounts by type
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    const typeOrder = { bank: 1, exchange: 2, bookie: 3 }
    const typeComparison = typeOrder[a.type] - typeOrder[b.type]

    if (typeComparison !== 0) return typeComparison
    return a.name.localeCompare(b.name)
  })

  // Calculate totals
  const totals = sortedAccounts.reduce(
    (acc, account) => {
      acc.netDeposits += account.netDeposits
      acc.bonusBets += account.bonusBets
      acc.concludedWagers += account.concludedWagers
      acc.netWinnings += account.netWinnings
      acc.pendingBetsQuantity += account.pendingBetsQuantity
      acc.pendingBetsRisk += account.pendingBetsRisk
      acc.availableFunds += account.availableFunds
      return acc
    },
    {
      netDeposits: 0,
      bonusBets: 0,
      concludedWagers: 0,
      netWinnings: 0,
      pendingBetsQuantity: 0,
      pendingBetsRisk: 0,
      availableFunds: 0,
    },
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevProfile} disabled={currentProfileIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="font-medium">{currentProfile.name}'s Accounts</span>
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
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
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
              <TableHead className="text-right">Net Deposits</TableHead>
              <TableHead className="text-right">Bonus Bets</TableHead>
              <TableHead className="text-right">Concluded Wagers</TableHead>
              <TableHead className="text-right">Net Winnings</TableHead>
              <TableHead className="text-right">Pending Bets (quantity)</TableHead>
              <TableHead className="text-right">Pending Bets (funds at risk)</TableHead>
              <TableHead className="text-right">Available Funds</TableHead>
              {showNotes && <TableHead>Notes</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="font-bold bg-primary/10">
              <TableCell colSpan={2}>Totals</TableCell>
              <TableCell className="text-right">${totals.netDeposits.toLocaleString()}</TableCell>
              <TableCell className="text-right">${totals.bonusBets.toLocaleString()}</TableCell>
              <TableCell className="text-right">${totals.concludedWagers.toLocaleString()}</TableCell>
              <TableCell className={`text-right ${totals.netWinnings >= 0 ? "text-green-600" : "text-red-600"}`}>
                {totals.netWinnings >= 0 ? "$" : "-$"}
                {Math.abs(totals.netWinnings).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">{totals.pendingBetsQuantity}</TableCell>
              <TableCell className="text-right">${totals.pendingBetsRisk.toLocaleString()}</TableCell>
              <TableCell className="text-right">${totals.availableFunds.toLocaleString()}</TableCell>
              {showNotes && <TableCell></TableCell>}
              <TableCell></TableCell>
            </TableRow>
            {sortedAccounts.map((account) => (
              <TableRow key={account.id} className={getAccountTypeBackground(account.type)}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: account.color }}
                    >
                      {account.name.charAt(0)}
                    </div>
                    <div className="font-medium">{account.name}</div>
                    {linkGroups[account.linkGroup]?.length > 1 && (
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
                    {getAccountTypeIcon(account.type)}
                    <span className="capitalize">{account.type}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">${account.netDeposits.toLocaleString()}</TableCell>
                <TableCell className="text-right">${account.bonusBets.toLocaleString()}</TableCell>
                <TableCell className="text-right">${account.concludedWagers.toLocaleString()}</TableCell>
                <TableCell className={`text-right ${account.netWinnings >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {account.netWinnings >= 0 ? "$" : "-$"}
                  {Math.abs(account.netWinnings).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">{account.pendingBetsQuantity}</TableCell>
                <TableCell className="text-right">${account.pendingBetsRisk.toLocaleString()}</TableCell>
                <TableCell className="text-right">${account.availableFunds.toLocaleString()}</TableCell>
                {showNotes && (
                  <TableCell className="max-w-[200px] truncate" title={account.notes}>
                    {account.notes}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={account.website} target="_blank" rel="noopener noreferrer">
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
            {sortedAccounts.length === 0 && (
              <TableRow>
                <TableCell colSpan={showNotes ? 10 : 9} className="text-center py-6 text-muted-foreground">
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
