"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus, Pencil, Gift } from "lucide-react";

interface Bookie {
  id: string;
  name: string;
  balance: number;
  bonus_bets?: number;
  bonus_expiry?: string;
  concluded_wagers?: number;
  net_winnings?: number;
  pending_qty?: number;
  pending_amount?: number;
  available_funds?: number;
}

export default function BookiesPage() {
  const { toast } = useToast();
  const [bookies, setBookies] = useState<Bookie[]>([]);
  const [activeBookie, setActiveBookie] = useState<Bookie | null>(null);

  // Dialog toggles
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // Form fields
  const [depositAmount, setDepositAmount] = useState("");
  const [depositBonus, setDepositBonus] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [amountDelta, setAmountDelta] = useState("");
  const [bonusDelta, setBonusDelta] = useState("");
  const [amountMode, setAmountMode] = useState<"add" | "take">("add");
  const [bonusMode, setBonusMode] = useState<"add" | "take">("add");

  // Transfer fields + error state
  const [transferFromId, setTransferFromId] = useState("");
  const [transferToId, setTransferToId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferError, setTransferError] = useState("");

  // Load accounts
  useEffect(() => {
    fetch("/api/bookies")
      .then((res) => res.json())
      .then((data) => setBookies(data))
      .catch((err) =>
        toast({ title: "Error", description: err.message, variant: "destructive" })
      );
  }, [toast]);

  // Open dialog helpers
  const openDeposit = (b: Bookie) => {
    setActiveBookie(b);
    setDepositAmount("");
    setDepositBonus("");
    setIsDepositOpen(true);
  };
  const openWithdraw = (b: Bookie) => {
    setActiveBookie(b);
    setWithdrawAmount("");
    setIsWithdrawOpen(true);
  };
  const openEdit = (b: Bookie) => {
    setActiveBookie(b);
    setAmountDelta("");
    setBonusDelta("");
    setAmountMode("add");
    setBonusMode("add");
    setIsEditOpen(true);
  };
  const openTransfer = () => {
    setTransferFromId("");
    setTransferToId("");
    setTransferAmount("");
    setTransferError("");
    setIsTransferOpen(true);
  };

  // Deposit handler
  const handleDeposit = useCallback(async () => {
    if (!activeBookie) return;
    const amt = parseFloat(depositAmount) || 0;
    const bonus = parseFloat(depositBonus) || 0;
    if (amt <= 0 && bonus <= 0) {
      toast({ title: "Invalid Input", description: "Enter deposit or bonus.", variant: "destructive" });
      return;
    }
    setIsDepositOpen(false);
    const res = await fetch("/api/deposits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookie_id: activeBookie.id, amount: amt, bonus_bets: bonus }),
    });
    const updated = await res.json();
    if (!res.ok) throw new Error(updated.error);
    setBookies((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    toast({ title: "Deposit Success", description: `+${amt} deposit, +${bonus} bonus` });
  }, [activeBookie, depositAmount, depositBonus, toast]);

  // Withdraw handler
  const handleWithdraw = useCallback(async () => {
    if (!activeBookie) return;
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      toast({ title: "Invalid Input", description: "Enter valid withdrawal.", variant: "destructive" });
      return;
    }
    setIsWithdrawOpen(false);
    const res = await fetch("/api/withdrawals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookie_id: activeBookie.id, amount: amt }),
    });
    const updated = await res.json();
    if (!res.ok) throw new Error(updated.error);
    setBookies((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    toast({ title: "Withdraw Success", description: `-${amt}` });
  }, [activeBookie, withdrawAmount, toast]);

  // Edit handler
  const handleEdit = useCallback(async () => {
    if (!activeBookie) return;
    const deltaAmt = parseFloat(amountDelta) || 0;
    const deltaBon = parseFloat(bonusDelta) || 0;
    const base = activeBookie.available_funds ?? activeBookie.balance;
    const newBal = amountMode === "add" ? base + deltaAmt : base - deltaAmt;
    const newBon = bonusMode === "add"
      ? (activeBookie.bonus_bets || 0) + deltaBon
      : (activeBookie.bonus_bets || 0) - deltaBon;
    setIsEditOpen(false);
    const res = await fetch("/api/bookies", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: activeBookie.id, balance: newBal, bonus_bets: newBon }),
    });
    const updated = await res.json();
    if (!res.ok) throw new Error(updated.error);
    setBookies((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    toast({ title: "Edit Success" });
  }, [activeBookie, amountDelta, bonusDelta, amountMode, bonusMode, toast]);

  // Transfer handler
  const handleTransfer = useCallback(async () => {
    const amt = parseFloat(transferAmount) || 0;
    if (!transferFromId || !transferToId || isNaN(amt) || amt <= 0) {
      setTransferError("Select source, destination, and a positive amount.");
      return;
    }
    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from_id: transferFromId, to_id: transferToId, amount: amt }),
      });
      const data = await res.json();
      if (res.status === 400) {
        setTransferError(data.error || "Insufficient funds to transfer");
        return;
      }
      if (!res.ok) {
        setTransferError(data.error || "Transfer failed");
        return;
      }
      // success
      setTransferError("");
      setIsTransferOpen(false);
      // refresh table
      const listRes = await fetch("/api/bookies");
      const listData = await listRes.json();
      setBookies(listData);
      toast({ title: "Transfer Success", description: `$${amt.toFixed(2)} moved` });
    } catch (err: any) {
      setTransferError(err.message || "Unexpected error");
    }
  }, [transferFromId, transferToId, transferAmount, toast]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
          <p className="text-muted-foreground">Manage your accounts</p>
        </div>
        <div className="space-x-2">
          <Link href="/bookies/add">
            <Button variant="outline" size="sm">
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={openTransfer}>
            ↔️ Transfer
          </Button>
        </div>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Accounts</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-center">Account</th>
                <th className="px-4 py-2 text-center">Net Deposits</th>
                <th className="px-4 py-2 text-center">Bonus Bets</th>
                <th className="px-4 py-2 text-center">Concluded Wagers</th>
                <th className="px-4 py-2 text-center">Net Winnings</th>
                <th className="px-4 py-2 text-center">Pending Bets</th>
                <th className="px-4 py-2 text-center">Pending Amount</th>
                <th className="px-4 py-2 text-center">Available Funds</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookies.map((b) => (
                <tr key={b.id} className="hover:bg-accent">
                  <td className="px-4 py-2 text-center">{b.name}</td>
                  <td className="px-4 py-2 text-center">${b.balance.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-primary hover:underline" title={`Expires: ${b.bonus_expiry || "—"}`}>{b.bonus_bets || 0}</button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Bonus Bets</DialogTitle></DialogHeader>
                        <p className="text-center">Expires: {b.bonus_expiry || "—"}</p>
                        <DialogFooter><Button size="sm" variant="ghost">Close</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                  <td className="px-4 py-2 text-center">${(b.concluded_wagers || 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">${(b.net_winnings || 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">{b.pending_qty || 0}</td>
                  <td className="px-4 py-2 text-center">${(b.pending_amount || 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">${(b.available_funds || b.balance).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center space-x-1">
                    <Button size="sm" variant="outline" onClick={() => openDeposit(b)}><Plus /></Button>
                    <Button size="sm" variant="outline" onClick={() => openWithdraw(b)}><Minus /></Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(b)}><Pencil /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="p-4">
          <DialogHeader><DialogTitle>Deposit to {activeBookie?.name}</DialogTitle></DialogHeader>
          <Label>Amount</Label>
          <Input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
          <Label>Bonus Bets</Label>
          <Input type="number" value={depositBonus} onChange={(e) => setDepositBonus(e.target.value)} />
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsDepositOpen(false)}>Cancel</Button>
            <Button onClick={handleDeposit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="p-4">
          <DialogHeader><DialogTitle>Withdraw from {activeBookie?.name}</DialogTitle></DialogHeader>
          <Label>Amount</Label>
          <Input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsWithdrawOpen(false)}>Cancel</Button>
            <Button onClick={handleWithdraw}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="p-4">
          <DialogHeader><DialogTitle>Edit {activeBookie?.name}</DialogTitle></DialogHeader>
          <Label>Amount</Label>
          <div className="flex gap-2">
            <Button size="sm" variant={amountMode === "add" ? "default" : "outline"} onClick={() => setAmountMode("add")}>
              +
            </Button>
            <Button size="sm" variant={amountMode === "take" ? "default" : "outline"} onClick={() => setAmountMode("take")}>
              -
            </Button>
            <Input
              type="number"
              className="w-24"
              placeholder="0"
              value={amountDelta}
              onChange={(e) => setAmountDelta(e.target.value)}
            />
          </div>
          <Label>Bonus Bets</Label>
          <div className="flex gap-2">
            <Button size="sm" variant={bonusMode === "add" ? "default" : "outline"} onClick={() => setBonusMode("add")}>
              +
            </Button>
            <Button size="sm" variant={bonusMode === "take" ? "default" : "outline"} onClick={() => setBonusMode("take")}>
              -
            </Button>
            <Input
              type="number"
              className="w-24"
              placeholder="0"
              value={bonusDelta}
              onChange={(e) => setBonusDelta(e.target.value)}
            />
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent className="p-4 space-y-4">
          <DialogHeader><DialogTitle>Transfer Funds</DialogTitle></DialogHeader>
          {transferError && (
            <p className="text-sm text-destructive text-center">{transferError}</p>
          )}
          <Label>From Account</Label>
          <Select value={transferFromId} onValueChange={setTransferFromId}>
            <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              {bookies.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name} (${(b.available_funds || b.balance).toFixed(2)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>To Account</Label>
          <Select value={transferToId} onValueChange={setTransferToId}>
            <SelectTrigger><SelectValue placeholder="Destination" /></SelectTrigger>
            <SelectContent>
              {bookies.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name} (${(b.available_funds || b.balance).toFixed(2)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Amount</Label>
          <Input
            type="number"
            step="0.01"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />

          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsTransferOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransfer}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
