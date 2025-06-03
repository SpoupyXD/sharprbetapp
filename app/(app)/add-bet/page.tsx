"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function AddBetPage() {
  const router = useRouter()
  // Single Bet
  const [event, setEvent] = useState("")
  const [selection, setSelection] = useState("")
  // Multi Bet
  const [multiLegs, setMultiLegs] = useState("")
  // System Bet
  const [systemType, setSystemType] = useState("")
  // Arbitrage Bet
  const [arbEvent, setArbEvent] = useState("")
  // Dutching Bet
  const [dutchEvent, setDutchEvent] = useState("")
  // Back & Lay Bet
  const [backLayEvent, setBackLayEvent] = useState("")
  // Shared
  const [isSaving, setIsSaving] = useState(false)

  // Handler for Single Bet
  const handleSaveSingleBet = async () => {
    setIsSaving(true)
    const newBet = {
      id: `BET-${Date.now()}`,
      type: "single",
      event,
      selection,
      status: "Pending",
      created_at: new Date().toISOString(),
    }
    await supabase.from("bets").insert([newBet])
    setIsSaving(false)
    router.push("/bets")
  }

  // Handler for Multi Bet
  const handleSaveMultiBet = async () => {
    setIsSaving(true)
    const newBet = {
      id: `BET-${Date.now()}`,
      type: "multi",
      legs: multiLegs,
      status: "Pending",
      created_at: new Date().toISOString(),
    }
    await supabase.from("bets").insert([newBet])
    setIsSaving(false)
    router.push("/bets")
  }

  // Handler for System Bet
  const handleSaveSystemBet = async () => {
    setIsSaving(true)
    const newBet = {
      id: `BET-${Date.now()}`,
      type: "system",
      systemType,
      status: "Pending",
      created_at: new Date().toISOString(),
    }
    await supabase.from("bets").insert([newBet])
    setIsSaving(false)
    router.push("/bets")
  }

  // Handler for Arbitrage Bet
  const handleSaveArbBet = async () => {
    setIsSaving(true)
    const newBet = {
      id: `BET-${Date.now()}`,
      type: "arbitrage",
      event: arbEvent,
      status: "Pending",
      created_at: new Date().toISOString(),
    }
    await supabase.from("bets").insert([newBet])
    setIsSaving(false)
    router.push("/bets")
  }

  // Handler for Dutching Bet
  const handleSaveDutchBet = async () => {
    setIsSaving(true)
    const newBet = {
      id: `BET-${Date.now()}`,
      type: "dutching",
      event: dutchEvent,
      status: "Pending",
      created_at: new Date().toISOString(),
    }
    await supabase.from("bets").insert([newBet])
    setIsSaving(false)
    router.push("/bets")
  }

  // Handler for Back & Lay Bet
  const handleSaveBackLayBet = async () => {
    setIsSaving(true)
    const newBet = {
      id: `BET-${Date.now()}`,
      type: "backlay",
      event: backLayEvent,
      status: "Pending",
      created_at: new Date().toISOString(),
    }
    await supabase.from("bets").insert([newBet])
    setIsSaving(false)
    router.push("/bets")
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center mb-6">
        <Link href="/bets">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Bet</h1>
          <p className="text-muted-foreground">Record a new bet in your tracking system</p>
        </div>
      </div>

      <Tabs defaultValue="single">
        <TabsList className="mb-6 grid w-full grid-cols-6">
          <TabsTrigger value="single">Single Bet</TabsTrigger>
          <TabsTrigger value="multi">Multi/Parlay</TabsTrigger>
          <TabsTrigger value="system">System Bet</TabsTrigger>
          <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
          <TabsTrigger value="dutching">Dutching</TabsTrigger>
          <TabsTrigger value="backlay">Back & Lay</TabsTrigger>
        </TabsList>

        {/* Single Bet */}
        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle>Single Bet Details</CardTitle>
              <CardDescription>Enter the details of your single bet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event">Event</Label>
                  <Input
                    id="event"
                    placeholder="e.g. Lakers vs Warriors"
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selection">Selection</Label>
                  <Input
                    id="selection"
                    placeholder="e.g. Lakers to win"
                    value={selection}
                    onChange={(e) => setSelection(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSingleBet}
                disabled={isSaving || !event || !selection}
              >
                {isSaving ? "Saving..." : "Save Bet"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Multi/Parlay Bet */}
        <TabsContent value="multi">
          <Card>
            <CardHeader>
              <CardTitle>Multi/Parlay Bet</CardTitle>
              <CardDescription>Enter the details of your multi bet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Legs</Label>
                  <Input
                    placeholder="e.g. Leg 1: Lakers to win; Leg 2: Warriors to cover"
                    value={multiLegs}
                    onChange={(e) => setMultiLegs(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveMultiBet}
                disabled={isSaving || !multiLegs}
              >
                {isSaving ? "Saving..." : "Save Multi Bet"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* System Bet */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Bet</CardTitle>
              <CardDescription>Enter the details of your system bet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system-type">System Type</Label>
                  <Select
                    value={systemType}
                    onValueChange={setSystemType}
                  >
                    <SelectTrigger id="system-type">
                      <SelectValue placeholder="Select system type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trixie">Trixie (4 bets from 3 selections)</SelectItem>
                      <SelectItem value="patent">Patent (7 bets from 3 selections)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSystemBet}
                disabled={isSaving || !systemType}
              >
                {isSaving ? "Saving..." : "Save System Bet"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Arbitrage Bet */}
        <TabsContent value="arbitrage">
          <Card>
            <CardHeader>
              <CardTitle>Arbitrage Bet</CardTitle>
              <CardDescription>Enter the details of your arbitrage bet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="arb-event">Event</Label>
                  <Input
                    id="arb-event"
                    placeholder="e.g. Lakers vs Warriors"
                    value={arbEvent}
                    onChange={(e) => setArbEvent(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveArbBet}
                disabled={isSaving || !arbEvent}
              >
                {isSaving ? "Saving..." : "Save Arbitrage Bet"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Dutching Bet */}
        <TabsContent value="dutching">
          <Card>
            <CardHeader>
              <CardTitle>Dutching Bet</CardTitle>
              <CardDescription>Enter the details of your dutching bet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dutch-event">Event</Label>
                  <Input
                    id="dutch-event"
                    placeholder="e.g. Melbourne Cup"
                    value={dutchEvent}
                    onChange={(e) => setDutchEvent(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveDutchBet}
                disabled={isSaving || !dutchEvent}
              >
                {isSaving ? "Saving..." : "Save Dutching Bet"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Back & Lay Bet */}
        <TabsContent value="backlay">
          <Card>
            <CardHeader>
              <CardTitle>Back & Lay Bet</CardTitle>
              <CardDescription>Enter the details of your back & lay bet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="back-event">Event</Label>
                  <Input
                    id="back-event"
                    placeholder="e.g. Man Utd vs Liverpool"
                    value={backLayEvent}
                    onChange={(e) => setBackLayEvent(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveBackLayBet}
                disabled={isSaving || !backLayEvent}
              >
                {isSaving ? "Saving..." : "Save Back & Lay Bet"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
