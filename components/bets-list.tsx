"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type Bet = {
  id: string
  date: string
  event: string
  selection: string
  betType: string
  stake: number
  odds: number
  bookie: string
  status: "Won" | "Lost" | "Pending" | "Void"
  profitLoss: number
  isBonus?: boolean
  bonusBetValue?: number
}

interface BetsListProps {
  data: Bet[]
  cycleBetStatus?: (id: string) => void
  handleEditBet?: (bet: Bet) => void
}

export function BetsList({ data = [], cycleBetStatus, handleEditBet }: BetsListProps) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")

  // Define columns
  const columns: ColumnDef<Bet>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <div>{row.getValue("date")}</div>,
    },
    {
      accessorKey: "event",
      header: "Event",
      cell: ({ row }) => <div>{row.getValue("event")}</div>,
    },
    {
      accessorKey: "selection",
      header: "Selection",
      cell: ({ row }) => <div>{row.getValue("selection")}</div>,
    },
    {
      accessorKey: "betType",
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("betType")}</div>,
    },
    {
      accessorKey: "stake",
      header: "Stake",
      cell: ({ row }) => <div>${row.getValue("stake")}</div>,
    },
    {
      accessorKey: "odds",
      header: "Odds",
      cell: ({ row }) => <div>{row.getValue("odds")}</div>,
    },
    {
      accessorKey: "bookie",
      header: "Bookie",
      cell: ({ row }) => <div>{row.getValue("bookie")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return cycleBetStatus ? (
          <Button
            variant="ghost"
            onClick={() => cycleBetStatus(row.original.id)}
            className={`
              ${status === "Won" ? "text-green-600" : ""}
              ${status === "Lost" ? "text-red-600" : ""}
              ${status === "Void" ? "text-yellow-600" : ""}
              ${status === "Pending" ? "text-blue-600" : ""}
            `}
          >
            {status}
          </Button>
        ) : (
          <Badge
            className={`
              ${status === "Won" ? "bg-green-100 text-green-800" : ""}
              ${status === "Lost" ? "bg-red-100 text-red-800" : ""}
              ${status === "Void" ? "bg-yellow-100 text-yellow-800" : ""}
              ${status === "Pending" ? "bg-blue-100 text-blue-800" : ""}
            `}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "profitLoss",
      header: "Profit/Loss",
      cell: ({ row }) => {
        const profitLoss = row.getValue("profitLoss") as number
        const bonusBetValue = row.original.bonusBetValue

        return (
          <div className="flex flex-col">
            <span className={profitLoss >= 0 ? "text-green-600" : "text-red-600"}>${profitLoss?.toFixed(2)}</span>
            {bonusBetValue && bonusBetValue > 0 && (
              <span className="text-xs text-blue-600">Bonus: ${bonusBetValue.toFixed(2)}</span>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return handleEditBet ? (
          <Button variant="ghost" size="icon" onClick={() => handleEditBet(row.original)} className="h-8 w-8 p-0">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit bet</span>
          </Button>
        ) : null
      },
    },
  ]

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search bets..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No bets found. Click "Add Bet" to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
