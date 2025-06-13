"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
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
  bonus_expiry?: string;
  concluded_wagers?: number;
  net_winnings?: number;
  pending_qty?: number;
  pending_amount?: number;
  available_funds?: number;
}

export default function BookiesPage() {
  const [bookies, setBookies] = useState<Bookie[]>([]);
  const [activeBookie, setActiveBookie] = useState<Bookie | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositBonus, setDepositBonus] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/bookies")
      .then((res) => res.json())
      .then((data) => setBookies(data))
      .catch(() =>
        toast({ title: "Error", description: "Failed to load accounts.", variant: "destructive" })
      );
  }, [toast]);

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

  const handleDeposit = useCallback(async () => {
    if (!activeBookie) return;
// parse both deposit and bonus, but allow one or the other
const depositAmt = depositAmount.trim() ? parseFloat(depositAmount) : 0;
const bonusAmt = depositBonus.trim() ? parseFloat(depositBonus) : 0;

// require at least one positive value
if ((depositAmt <= 0 || isNaN(depositAmt)) && (bonusAmt <= 0 || isNaN(bonusAmt))) {
  toast({
    title: "Invalid Input",
    description: "Enter a deposit or bonus amount (or both).",
    variant: "destructive",
  });
  return;
}

// now proceed with either or both
setIsDepositOpen(false);
try {
  const res = await fetch("/api/deposits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bookie_id: activeBookie.id,
      amount: depositAmt,
      bonus_bets: bonusAmt,
    }),
  });
  const updated = await res.json();
  if (!res.ok) throw new Error(updated.error || "Deposit failed");

  setBookies((prev) =>
    prev.map((b) => (b.id === updated.id ? updated : b))
  );
  toast({
    title: "Deposit Successful",
    description: `Updated ${updated.name}: +$${depositAmt.toFixed(2)} deposit, +${bonusAmt} bonus`,
  });
} catch (err: any) {
  toast({
    title: "Error",
    description: err.message || "Could not process deposit/bonus",
    variant: "destructive",
  });
}

    setIsDepositOpen(false);
    try {
      const res = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookie_id: activeBookie.id, amount, bonus_bets: bonus }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || "Deposit failed");

      setBookies((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      toast({ title: "Deposit Successful", description: `Deposited $${amount.toFixed(2)} to ${updated.name}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Could not deposit", variant: "destructive" });
    }
  }, [activeBookie, depositAmount, depositBonus, toast]);

  const handleWithdraw = useCallback(async () => {
    if (!activeBookie) return;
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Enter a valid withdrawal amount.", variant: "destructive" });
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

      setBookies((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      toast({ title: "Withdrawal Successful", description: `Withdrew $${amount.toFixed(2)} from ${updated.name}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Could not withdraw", variant: "destructive" });
    }
  }, [activeBookie, withdrawAmount, toast]);

  return (
    <div className="pt-2 p-6 md:px-10 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-center">Accounts</h1>
          <p className="text-muted-foreground text-center">Manage your bookmaker, exchange, and bank accounts</p>
        </div>
        <Link href="/bookies/add">
          <Button variant="outline" size="sm">
            <Plus className="mr-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

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
                  <td className="px-4 py-2 text-center">${b.balance.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-primary hover:underline">{b.bonus_bets ?? 0}</button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Bonus Bets Expiry</DialogTitle></DialogHeader>
                        <div className="mt-2 text-center">Expires: {b.bonus_expiry || "—"}</div>
                        <DialogFooter><Button size="sm" variant="ghost">Close</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                  <td className="px-4 py-2 text-center">${(b.concluded_wagers ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">${(b.net_winnings ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-primary hover:underline">{b.pending_qty ?? 0}</button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Pending Bets</DialogTitle></DialogHeader>
                        <ul className="mt-2 list-disc list-inside text-center"><li>No pending bets</li></ul>
                        <DialogFooter><Button size="sm" variant="ghost">Close</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                  <td className="px-4 py-2 text-center">${(b.pending_amount ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">${(b.available_funds ?? b.balance).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center space-x-1">
                    <Button size="sm" variant="outline" className="p-0.5 h-6 w-6" onClick={() => openDeposit(b)}><Plus className="h-4 w-4"/></Button>
                    <Button size="sm" variant="outline" className="p-0.5 h-6 w-6" onClick={() => openWithdraw(b)}><Minus className="h-4 w-4"/></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Deposit to {activeBookie?.name}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <Label>Amount</Label>
            <Input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
            <Label>Bonus Bets</Label>
            <Input type="number" value={depositBonus} onChange={(e) => setDepositBonus(e.target.value)} />
          </div>
          <DialogFooter>
            <Button size="sm" variant="ghost" onClick={() => setIsDepositOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleDeposit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Withdraw from {activeBookie?.name}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <Label>Amount</Label>
            <Input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
          </div>
          <DialogFooter>
            <Button size="sm" variant="ghost" onClick={() => setIsWithdrawOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleWithdraw}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
