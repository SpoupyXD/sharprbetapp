"use client"

import { useState } from "react"
import { Check, Clock, X, Gift } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { HorseRacingBetDialog } from "@/components/horse-racing-bet-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { HorseRacingBet } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { saveBonusBets, loadBonusBets } from "@/lib/storage"

interface HorseRacingListProps {
  filter?: string
  bets?: HorseRacingBet[]
  onSaveBet: (bet: HorseRacingBet) => void
}

export function HorseRacingList({ filter = "all", bets = [], onSaveBet }: HorseRacingListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    track: true,
    race: true,
    horse: true,
    betType: true,
    odds: true,
    stake: true,
    status: true,
    profit: true,
    bookie: true,
    result: true,
    position: false,
    isPromo: true,
    promoType: false,
    bonusTriggered: true,
    bonusBetValue: true,
    notes: false,
  })

  const [editBetOpen, setEditBetOpen] = useState(false)
  const [currentBet, setCurrentBet] = useState<HorseRacingBet | null>(null)

  // For bonus tracking popup
  const [bonusDialogOpen, setBonusDialogOpen] = useState(false)
  const [selectedBetId, setSelectedBetId] = useState<string | null>(null)
  const [bonusAmount, setBonusAmount] = useState("")

  const { toast } = useToast()

  const handleEditBet = (betId: string) => {
    const bet = bets.find((b) => b.id === betId)
    if (bet) {
      setCurrentBet(bet)
      setEditBetOpen(true)
    }
  }

  const handleSaveEditedBet = (updatedBet: HorseRacingBet) => {
    onSaveBet(updatedBet)
  }

  const handleBonusTriggered = (betId: string) => {
    const bet = bets.find((b) => b.id === betId)
    if (bet) {
      // Only allow triggering bonus for promo bets that haven't already triggered a bonus
      if (bet.isPromo && !bet.bonusTriggered) {
        setSelectedBetId(betId)
        setBonusAmount("")
        setBonusDialogOpen(true)
      } else {
        toast({
          title: bet.bonusTriggered ? "Bonus already triggered" : "Not a promotional bet",
          description: bet.bonusTriggered
            ? "This bet has already triggered a bonus"
            : "Only promotional bets can trigger bonuses",
          variant: "destructive",
        })
      }
    }
  }

  const saveBonusAmount = () => {
    if (!selectedBetId) return

    if (!bonusAmount || Number.parseFloat(bonusAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bonus amount greater than zero",
        variant: "destructive",
      })
      return
    }

    const bet = bets.find((b) => b.id === selectedBetId)
    if (bet) {
      const updatedBet = {
        ...bet,
        bonusTriggered: true,
        bonusBetValue: Number.parseFloat(bonusAmount) || 0,
      }
      onSaveBet(updatedBet)

      // Add the bonus bet to available bonus bets
      const bonusBets = loadBonusBets()
      const bookie = bet.bookie
      const bonusValue = Number.parseFloat(bonusAmount)

      if (bonusBets[bookie]) {
        bonusBets[bookie] = {
          amount: bonusBets[bookie].amount + bonusValue,
          count: bonusBets[bookie].count + 1,
          expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        }
      } else {
        bonusBets[bookie] = {
          amount: bonusValue,
          count: 1,
          expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        }
      }

      saveBonusBets(bonusBets)

      // Show success toast
      toast({
        title: "Bonus triggered successfully",
        description: `$${bonusAmount} bonus added from ${bet.bookie}`,
        variant: "success",
      })
    }

    setBonusDialogOpen(false)
    setSelectedBetId(null)
    setBonusAmount("")
  }

  const hasRaceStarted = (date: string, time: string) => {
    const raceDateTime = new Date(`${date}T${time || "00:00"}:00`)
    const now = new Date()
    return raceDateTime <= now
  }

  const getActualStatus = (bet: HorseRacingBet) => {
    if (bet.status === "won" || bet.status === "lost") {
      return bet.status
    }

    if (!hasRaceStarted(bet.date, bet.time)) {
      return "pending"
    }

    return "active"
  }

  const cycleBetStatus = (betId: string) => {
    const bet = bets.find((b) => b.id === betId)
    if (!bet) return

    const currentStatus = bet.status
    let newStatus: "pending" | "active" | "won" | "lost"

    if (currentStatus === "pending") newStatus = "active"
    else if (currentStatus === "active") newStatus = "won"
    else if (currentStatus === "won") newStatus = "lost"
    else newStatus = "pending"

    // Calculate profit based on new status
    let profit = 0
    if (newStatus === "won") {
      profit = (bet.odds - 1) * bet.stake
    } else if (newStatus === "lost") {
      profit = -bet.stake
    }

    const updatedBet = {
      ...bet,
      status: newStatus,
      profit: profit,
    }

    onSaveBet(updatedBet)
  }

  const filteredBets = bets.filter((bet) => {
    const actualStatus = getActualStatus(bet)

    if (filter !== "all" && filter !== actualStatus) {
      return false
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        bet.track?.toLowerCase().includes(searchLower) ||
        bet.horse?.toLowerCase().includes(searchLower) ||
        bet.betType?.toLowerCase().includes(searchLower) ||
        bet.bookie?.toLowerCase().includes(searchLower) ||
        (bet.notes && bet.notes.toLowerCase().includes(searchLower))
      )
    }

    return true
  })

  const sortedBets = [...filteredBets].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || "00:00"}:00`)
    const dateB = new Date(`${b.date}T${b.time || "00:00"}:00`)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search horse racing bets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.date && <TableHead>Date</TableHead>}
              {visibleColumns.track && <TableHead>Track</TableHead>}
              {visibleColumns.race && <TableHead>Race</TableHead>}
              {visibleColumns.horse && <TableHead>Horse</TableHead>}
              {visibleColumns.betType && <TableHead>Bet Type</TableHead>}
              {visibleColumns.odds && <TableHead>Odds</TableHead>}
              {visibleColumns.stake && <TableHead>Stake</TableHead>}
              {visibleColumns.status && <TableHead>Status</TableHead>}
              {visibleColumns.profit && <TableHead className="text-right">Profit/Loss</TableHead>}
              {visibleColumns.bookie && <TableHead>Bookie</TableHead>}
              {visibleColumns.result && <TableHead>Result</TableHead>}
              {visibleColumns.bonusTriggered && <TableHead>Bonus</TableHead>}
              {visibleColumns.bonusBetValue && <TableHead>Bonus Value</TableHead>}
              {visibleColumns.isPromo && <TableHead>Promo</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBets.length > 0 ? (
              sortedBets.map((bet) => {
                const actualStatus = getActualStatus(bet)
                return (
                  <TableRow key={bet.id}>
                    {visibleColumns.date && <TableCell>{bet.date}</TableCell>}
                    {visibleColumns.track && <TableCell>{bet.track}</TableCell>}
                    {visibleColumns.race && <TableCell>{bet.race}</TableCell>}
                    {visibleColumns.horse && <TableCell>{bet.horse}</TableCell>}
                    {visibleColumns.betType && <TableCell>{bet.betType}</TableCell>}
                    {visibleColumns.odds && <TableCell>{bet.odds}</TableCell>}
                    {visibleColumns.stake && <TableCell>${bet.stake}</TableCell>}
                    {visibleColumns.status && (
                      <TableCell>
                        <Badge
                          variant={
                            actualStatus === "won" ? "success" : actualStatus === "lost" ? "destructive" : "secondary"
                          }
                          className={`flex w-24 items-center justify-center gap-1 cursor-pointer ${
                            actualStatus === "won"
                              ? "bg-green-500 hover:bg-green-600"
                              : actualStatus === "pending" || actualStatus === "active"
                                ? "bg-gray-400 text-gray-800 hover:bg-gray-500"
                                : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            cycleBetStatus(bet.id)
                          }}
                        >
                          {actualStatus === "won" ? (
                            <Check className="h-3 w-3" />
                          ) : actualStatus === "lost" ? (
                            <X className="h-3 w-3" />
                          ) : actualStatus === "pending" ? (
                            <Clock className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3 animate-pulse" />
                          )}
                          {actualStatus.charAt(0).toUpperCase() + actualStatus.slice(1)}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.profit && (
                      <TableCell
                        className={`text-right ${bet.profit > 0 ? "text-green-600" : bet.profit < 0 ? "text-red-600" : ""}`}
                      >
                        {bet.profit > 0 ? `+$${bet.profit}` : bet.profit < 0 ? `-$${Math.abs(bet.profit)}` : "$0"}
                      </TableCell>
                    )}
                    {visibleColumns.bookie && <TableCell>{bet.bookie}</TableCell>}
                    {visibleColumns.result && <TableCell>{bet.result}</TableCell>}
                    {visibleColumns.bonusTriggered && (
                      <TableCell>
                        {bet.bonusTriggered ? (
                          <Badge variant="success" className="bg-green-500 hover:bg-green-600">
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.bonusBetValue && (
                      <TableCell>{bet.bonusTriggered && bet.bonusBetValue ? `$${bet.bonusBetValue}` : "-"}</TableCell>
                    )}
                    {visibleColumns.isPromo && (
                      <TableCell>
                        {bet.isPromo ? (
                          <Badge
                            variant="outline"
                            className="bg-purple-500/10 text-purple-600 border-purple-200 hover:bg-purple-500/20"
                          >
                            <Gift className="h-3 w-3 mr-1" />
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditBet(bet.id)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${
                            bet.isPromo
                              ? "text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-900 dark:hover:bg-purple-900/20"
                              : "text-muted-foreground border-muted"
                          }`}
                          onClick={() => handleBonusTriggered(bet.id)}
                          disabled={!bet.isPromo || bet.bonusTriggered}
                        >
                          <Gift className={`h-4 w-4 mr-1 ${bet.bonusTriggered ? "text-green-500" : ""}`} />
                          Promo
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={Object.values(visibleColumns).filter(Boolean).length + 1}
                  className="text-center py-6"
                >
                  No horse racing bets found. Click "Add Horse Racing Bet" to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Bet Dialog */}
      <HorseRacingBetDialog
        open={editBetOpen}
        onOpenChange={setEditBetOpen}
        onSaveBet={handleSaveEditedBet}
        editMode={true}
        initialBet={currentBet}
      />

      {/* Bonus Amount Dialog */}
      <Dialog open={bonusDialogOpen} onOpenChange={setBonusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trigger Promotional Bonus</DialogTitle>
            <DialogDescription>Enter the bonus amount received from this promotional bet.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedBetId && (
              <div className="text-sm bg-muted p-3 rounded-md">
                <p>
                  <strong>Bet:</strong> {bets.find((b) => b.id === selectedBetId)?.horse}
                </p>
                <p>
                  <strong>Promotion:</strong> {bets.find((b) => b.id === selectedBetId)?.promoDesc}
                </p>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bonusAmount" className="text-right">
                Bonus Amount ($)
              </Label>
              <Input
                id="bonusAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setBonusDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveBonusAmount}>
              Save Bonus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
