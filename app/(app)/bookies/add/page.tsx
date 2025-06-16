"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function AddBookiePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [accountType, setAccountType] = useState("bookie");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [balance, setBalance] = useState("");
  const [owner, setOwner] = useState("");
  const [color, setColor] = useState("#000000");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      toast({ title: "Missing Name", description: "Enter account name.", variant: "destructive" });
      return;
    }
    if (!balance.trim() || isNaN(Number(balance))) {
      toast({ title: "Invalid Balance", description: "Enter valid balance.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const payload = {
      name: name.trim(),
      type: accountType,
      website: website.trim() || null,
      balance: parseFloat(balance),
      owner: owner.trim() || null,
      color: color || null,
      notes: notes.trim() || null,
    };

    const res = await fetch("/api/bookies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (!res.ok) {
      toast({ title: "Error", description: result.error || "Failed to create.", variant: "destructive" });
    } else {
      toast({ title: "Created", description: `Added ${result.name}` });
      router.push("/bookies");
    }

    setIsSaving(false);
  }, [accountType, name, website, balance, owner, color, notes, router, toast]);

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center mb-6">
        <Link href="/bookies">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Account</h1>
          <p className="text-muted-foreground">Add a new bookmaker, exchange, or bank</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Enter the details of your new account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <Label>Account Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Bet365" />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={accountType} onValueChange={(val) => setAccountType(val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bookie">Bookmaker</SelectItem>
                    <SelectItem value="exchange">Exchange</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Website URL</Label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
              </div>
              <div>
                <Label>Balance ($)</Label>
                <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="1000" />
              </div>
              <div>
                <Label>Owner</Label>
                <Input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Owner name" />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <Label>Color</Label>
                <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes..." />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Account"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
