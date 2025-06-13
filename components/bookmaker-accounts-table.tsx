"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
  Repeat,
  Link2,
  MoreHorizontal,
  Trash,
} from "lucide-react"

// TypeScript interface matching your Supabase "bookmaker_accounts" table.
interface Account {
  id: string
  name: string
  type: "bookie" | "exchange" | "bank"
  website: string | null
  balance: number
  available_promos: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

interface Props {
  accounts: Account[]
  onDelete(id: string): void
  onRefresh(): void
}

export function BookmakerAccountsTable({ accounts, onDelete, onRefresh }: Props) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [accountTypeFilter, setAccountTypeFilter] = React.useState<"all" | "bank" | "exchange" | "bookie">("all")
  const [showNotes, setShowNotes] = React.useState(true)

  // Icon for account type
  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "exchange":
        return <Repeat className="h-4 w-4 text-blue-500 dark:text-blue-400" />
      case "bank":
        return <Building className="h-4 w-4 text-green-600 dark:text-green-400" />
      default:
        return null
    }
  }

  // Background color for account type row
  const getAccountTypeBackground = (type: string) => {
    switch (type) {
      case "bank":
        return "bg-green-50 dark:bg-green-950/30"
      case "exchange":
        return "bg-blue-50 dark:bg-blue-950/30"
      default:
        return ""
    }
  }

  // Filter and sort
  const filtered = accounts.filter((acct) => {
    if (accountTypeFilter !== "all" && acct.type !== accountTypeFilter) {
      return false
    }
    if (searchTerm && !acct.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const order = { bank: 1, exchange: 2, bookie: 3 }
    const diff = order[a.type] - order[b.type]
    if (diff !== 0) return diff
    return a.name.localeCompare(b.name)
  })

  return (
    <div>
      {/* Controls: filter/search/refresh */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Select value={accountTypeFilter} onValueChange={(v) => setAccountTypeFilter(v as any)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="bank">Banks</SelectItem>
              <SelectItem value="exchange">Exchanges</SelectItem>
              <SelectItem value="bookie">Bookies</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNotes((prev) => !prev)}
            className="flex items-center gap-1"
          >
            {showNotes ? "Hide Notes" : "Show Notes"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Available Promos</TableHead>
              {showNotes && <TableHead>Notes</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((acct) => (
              <TableRow key={acct.id} className={getAccountTypeBackground(acct.type)}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: "#8884d8" }}
                    >
                      {acct.name.charAt(0)}
                    </div>
                    <div className="font-medium">{acct.name}</div>
                    {acct.website && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Visit Website</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getAccountTypeIcon(acct.type)}
                    <span className="capitalize">{acct.type}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">${acct.balance.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {acct.available_promos !== null ? acct.available_promos : 0}
                </TableCell>
                {showNotes && (
                  <TableCell className="max-w-[200px] truncate" title={acct.notes || ""}>
                    {acct.notes || ""}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
                        <DropdownMenuItem
                          onClick={() => window.open(acct.website || "#", "_blank")}
                          disabled={!acct.website}
                        >
                          <ExternalLinkIcon className="mr-2 h-4 w-4" />
                          Visit Website
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive flex items-center gap-1"
                          onClick={() => onDelete(acct.id)}
                        >
                          <Trash className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={showNotes ? 5 : 4} className="text-center py-6 text-muted-foreground">
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

// Placeholder icons used above
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M…" clipRule="evenodd" /></svg>
}
function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} viewBox="0 0 20 20" fill="currentColor"><path d="M…" /></svg>
}
