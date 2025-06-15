"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Pencil, Gift, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
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

interface Bookie {
  id: string;
  name: string;
  type: string;
  balance: number;
   bonus_bets?: number;
   bonus_records?: {
     id: string;
     amount: number;
     type: "deposit_offer" | "bet_return";
     expiry: string;
     created_at: string;
   }[];
  concluded_wagers?: number;
  net_winnings?: number;
  pending_qty?: number;
  pending_amount?: number;
  available_funds?: number;
}

export default function BookiesPage() {
  /* ───────────────────────── State ───────────────────────── */
  const [bookies, setBookies] = useState<Bookie[]>([]);
  const [activeBookie, setActiveBookie] = useState<Bookie | null>(null);

  // dialog toggles
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // form values
  const [depositAmount, setDepositAmount] = useState("");
  const [depositBonus, setDepositBonus] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [editBalance, setEditBalance] = useState("");
  const [editBonus,   setEditBonus]   = useState("");
  const [amountMode,  setAmountMode]  = useState<"add" | "take">("add");
  const [amountDelta, setAmountDelta] = useState("");
  const [bonusMode,   setBonusMode]   = useState<"add" | "take">("add");
  const [bonusDelta,  setBonusDelta]  = useState("");
  const [addAmount,    setAddAmount]    = useState("");
const [takeAmount,   setTakeAmount]   = useState("");
const [addBonus,     setAddBonus]     = useState("");
const [takeBonus,    setTakeBonus]    = useState("");

  const { toast } = useToast();

  /* ─────────────────── initial fetch ─────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/bookies");
        if (!res.ok) {
          console.error("GET /api/bookies returned", res.status, res.statusText);
          throw new Error(`Server returned ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          console.error("GET /api/bookies payload is not an array:", data);
          throw new Error("Invalid data format");
        }
        setBookies(data);
      } catch (err: any) {
        console.error("Load bookies failed:", err);
        toast({
          title: "Error",
          description: err.message || "Could not load accounts.",
          variant: "destructive",
        });
        setBookies([]); // ensure table can still render
      }
    })();
  }, [toast]);

  /* ─────────────────── dialog open helpers ─────────────────── */
  const openDeposit = useCallback((b: Bookie) => {
    setActiveBookie(b);
    setDepositAmount("");
    setDepositBonus("");
    setIsDepositOpen(true);
  }, []);

  const openWithdraw = useCallback((b: Bookie) => {
    setActiveBookie(b);
    setWithdrawAmount("");
    setIsWithdrawOpen(true);
  }, []);

  const openEdit = useCallback((b: Bookie) => {
    setActiveBookie(b);
    setEditBalance(b.balance.toString());
    setEditBonus((b.bonus_bets ?? 0).toString());
    setIsEditOpen(true);

setAddAmount("");
setTakeAmount("");
setAddBonus("");
setTakeBonus("");
  }, []);

  /* ─────────────────── handlers ─────────────────── */

  // add deposit and/or bonus
  const handleDeposit = useCallback(async () => {
    if (!activeBookie) return;

    const amt  = depositAmount.trim() ? parseFloat(depositAmount) : 0;
    const bonus = depositBonus.trim() ? parseFloat(depositBonus) : 0;

    if ((amt <= 0 || isNaN(amt)) && (bonus <= 0 || isNaN(bonus))) {
      toast({
        title: "Invalid Input",
        description: "Enter a deposit or bonus amount (or both).",
        variant: "destructive",
      });
      return;
    }

    setIsDepositOpen(false);
    try {
      const res = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookie_id: activeBookie.id,
          amount: amt,
          bonus_bets: bonus,
        }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || "Deposit failed");

      setBookies((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
      toast({
        title: "Deposit Successful",
        description: `Updated ${updated.name}: +$${amt.toFixed(
          2
        )} deposit, +${bonus} bonus`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not process deposit/bonus",
        variant: "destructive",
      });
    }
  }, [activeBookie, depositAmount, depositBonus, toast]);

  // withdraw
  const handleWithdraw = useCallback(async () => {
    if (!activeBookie) return;
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    setIsWithdrawOpen(false);
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookie_id: activeBookie.id, amount }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || "Withdrawal failed");

      setBookies((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
      toast({
        title: "Withdrawal Successful",
        description: `Withdrew $${amount.toFixed(2)} from ${updated.name}`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not withdraw",
        variant: "destructive",
      });
    }
  }, [activeBookie, withdrawAmount, toast]);

  // manual edit (pencil)
  const handleEdit = useCallback(async () => {
    if (!activeBookie) return;
    // ❌ old code overwritten the values
    const deltaAmt = parseFloat(amountDelta) || 0;
    const deltaBon = parseFloat(bonusDelta)  || 0;
    const baseFunds = activeBookie.available_funds ?? activeBookie.balance;
    const baseBon   = activeBookie.bonus_bets    ?? 0;
    const newFunds  = amountMode === "add"  ? baseFunds + deltaAmt : baseFunds - deltaAmt;
    const newBonus  = bonusMode  === "add"  ? baseBon   + deltaBon : baseBon   - deltaBon;
  
    setIsEditOpen(false);
    try {
      const res = await fetch("/api/bookies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeBookie.id,
          balance: newFunds,
          bonus_bets: newBonus
        }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || "Edit failed");
  
      setBookies(prev => prev.map(b => b.id === updated.id ? updated : b));
      toast({ title: "Account Updated", description: `${updated.name} balances adjusted.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Could not update account", variant: "destructive" });
    }
  }, [activeBookie, amountMode, amountDelta, bonusMode, bonusDelta, toast]);

  /* ─────────────────── UI ─────────────────── */
  return (
    <div className="pt-2 p-6 md:px-10 md:pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-center">
            Accounts
          </h1>
          <p className="text-muted-foreground text-center">
            Manage your bookmaker, exchange, and bank accounts
          </p>
        </div>
        <Link href="/bookies/add">
          <Button variant="outline" size="sm">
            <Plus className="mr-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Accounts table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Your Accounts</CardTitle>
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
                  <td className="px-4 py-2 text-center">
                    ${b.balance.toFixed(2)}
                  </td>

                  {/* bonus bets with quick view */}
                  <td className="px-4 py-2 text-center">
  <Dialog>
    <DialogTrigger asChild>
      <button
        className="flex items-center justify-center text-primary hover:underline"
        title={`Expires: ${b.bonus_expiry ?? "—"}`}
      >
        <Gift className="inline-block w-4 h-4 mr-1" />
        {b.bonus_bets ?? 0}
      </button>
    </DialogTrigger>
    <DialogContent className="p-4 bg-secondary rounded-lg">
  <DialogHeader>
    <DialogTitle className="flex items-center gap-2">
      {b.bonus_expiry
        ? <Gift className="w-5 h-5 text-yellow-400"/>
        : <RefreshCw className="w-5 h-5 text-blue-400"/>}
      {b.bonus_expiry ? "Deposit Bonus" : "Bet Return Bonus"}
    </DialogTitle>
  </DialogHeader>

  <div className="mt-3 space-y-1 text-center">
    <p className="text-lg font-semibold">{b.bonus_bets ?? 0} Bets</p>
    <p className="text-sm text-muted-foreground">
      Received:{" "}
      {new Date(
        b.bonus_expiry 
          ? Date.now() - 30*24*60*60*1000  // approximate deposit date
          : Date.parse(b.updated_at as string)
      ).toLocaleDateString()}
    </p>
    {b.bonus_expiry && (
      <p className="text-sm text-muted-foreground">
        Expires: {new Date(b.bonus_expiry).toLocaleDateString()}
      </p>
    )}
  </div>

  <DialogFooter className="mt-4">
    <Button size="sm" variant="ghost">Close</Button>
  </DialogFooter>
</DialogContent>
  </Dialog>
</td>

                  <td className="px-4 py-2 text-center">
                    ${(b.concluded_wagers ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    ${(b.net_winnings ?? 0).toFixed(2)}
                  </td>

                  {/* pending qty quick view */}
                  <td className="px-4 py-2 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-primary hover:underline">
                          {b.pending_qty ?? 0}
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Pending Bets</DialogTitle>
                        </DialogHeader>
                        <ul className="mt-2 list-disc list-inside text-center">
                          <li>No pending bets</li>
                        </ul>
                        <DialogFooter>
                          <Button size="sm" variant="ghost">
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>

                  <td className="px-4 py-2 text-center">
                    ${(b.pending_amount ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    ${(b.available_funds ?? b.balance).toFixed(2)}
                  </td>

                  {/* action buttons */}
                  <td className="px-4 py-2 text-center space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="p-0.5 h-6 w-6"
                      onClick={() => openDeposit(b)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="p-0.5 h-6 w-6"
                      onClick={() => openWithdraw(b)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-0.5 h-6 w-6"
                      onClick={() => openEdit(b)}
                      aria-label="Edit balances"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ─────────────── Deposit Dialog ─────────────── */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit to {activeBookie?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Label>Amount</Label>
            <Input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <Label>Bonus Bets</Label>
            <Input
              type="number"
              value={depositBonus}
              onChange={(e) => setDepositBonus(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDepositOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleDeposit}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─────────────── Withdraw Dialog ─────────────── */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw from {activeBookie?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Label>Amount</Label>
            <Input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsWithdrawOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleWithdraw}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit {activeBookie?.name}</DialogTitle>
    </DialogHeader>

    {/* current snapshot */}
    <div className="space-y-2 text-sm">
      <p><strong>Current Amount:</strong> ${(activeBookie?.available_funds ?? activeBookie?.balance)?.toFixed(2)}</p>
      <p><strong>Current Bonus Bets:</strong> {activeBookie?.bonus_bets ?? 0}</p>
    </div>

    {/* two simple rows */}
    <div className="grid gap-4 mt-4">
      {/* Amount row */}
      <div className="flex items-center gap-2">
        <Label className="shrink-0">Amount</Label>
        <div className="inline-flex rounded-md overflow-hidden">
          <Button
            size="sm"
            variant={amountMode === "add" ? "default" : "outline"}
            onClick={() => setAmountMode("add")}
          >
            +
          </Button>
          <Button
            size="sm"
            variant={amountMode === "take" ? "default" : "outline"}
            onClick={() => setAmountMode("take")}
          >
            –
          </Button>
        </div>
        <Input
          type="number"
          className="w-24"
          placeholder="0"
          value={amountDelta}
          onChange={(e) => setAmountDelta(e.target.value)}
        />
      </div>

      {/* Bonus row */}
      <div className="flex items-center gap-2">
        <Label className="shrink-0">Bonus Bets</Label>
        <div className="inline-flex rounded-md overflow-hidden">
          <Button
            size="sm"
            variant={bonusMode === "add" ? "default" : "outline"}
            onClick={() => setBonusMode("add")}
          >
            +
          </Button>
          <Button
            size="sm"
            variant={bonusMode === "take" ? "default" : "outline"}
            onClick={() => setBonusMode("take")}
          >
            –
          </Button>
        </div>
        <Input
          type="number"
          className="w-24"
          placeholder="0"
          value={bonusDelta}
          onChange={(e) => setBonusDelta(e.target.value)}
        />
      </div>
    </div>

    {/* preview of new values */}
    <div className="mt-4 p-4 bg-muted rounded-md text-sm space-y-1">
      <p>
        <strong>New Balance:</strong>{" "}
        ${(
          (activeBookie?.available_funds ?? activeBookie?.balance) +
          (amountMode === "add" ? parseFloat(amountDelta) || 0 : -(parseFloat(amountDelta) || 0))
        ).toFixed(2)}
      </p>
      <p>
        <strong>New Bonus Bets:</strong>{" "}
        {(
          (activeBookie?.bonus_bets ?? 0) +
          (bonusMode === "add" ? parseFloat(bonusDelta) || 0 : -(parseFloat(bonusDelta) || 0))
        )}
      </p>
    </div>

    <DialogFooter className="mt-6">
      <Button size="sm" variant="ghost" onClick={() => setIsEditOpen(false)}>
        Cancel
      </Button>
      <Button size="sm" onClick={handleEdit}>
        Save
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
}