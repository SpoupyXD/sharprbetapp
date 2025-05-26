"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Gift } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import React from "react"

export function BonusBetDialog({ open, onOpenChange, bookie, onConfirm, initialValue = "" }) {
  const [bonusAmount, setBonusAmount] = useState(initialValue)
  const { toast } = useToast()

  React.useEffect(() => {
    if (open && initialValue) {
      setBonusAmount(initialValue.toString())
    }
  }, [open, initialValue])

  const handleConfirm = () => {
    // Validate input
    const amount = Number.parseFloat(bonusAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bonus bet amount",
        variant: "destructive",
      })
      return
    }

    // Call the onConfirm callback with the amount
    onConfirm(amount)

    // Reset and close
    setBonusAmount("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-500" />
            {initialValue ? "Edit Bonus Bet" : "Bonus Bet Received"}
          </DialogTitle>
          <DialogDescription>Enter the value of the bonus bet you received from {bookie}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bonus-amount">Bonus Bet Amount ($)</Label>
            <Input
              id="bonus-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 50.00"
              value={bonusAmount}
              onChange={(e) => setBonusAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-purple-600 hover:bg-purple-700">
            {initialValue ? "Update Bonus Bet" : "Add Bonus Bet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
