"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isValid } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Helper
function safeFormatDate(dateValue, dateFormat = "PPP") {
  if (!dateValue) return ""
  try {
    if (isValid(dateValue)) return format(dateValue, dateFormat)
    const d = new Date(dateValue)
    return isValid(d) ? format(d, dateFormat) : ""
  } catch {
    return ""
  }
}

export function AddBetDialog({ open, onOpenChange, onAddBet, editMode = false, initialBet = null }) {
  const { toast } = useToast()
  const [betType, setBetType] = useState("single")
  const [date, setDate] = useState(new Date())

  const [singleBet, setSingleBet] = useState({
    event: "",
    selection: "",
    odds: "",
    stake: "",
    bookie: "",
    sport: "",
    strategy: "",
    tipper: "",
    notes: "",
    targetProfit: "",
  })
  const [multiBet, setMultiBet] = useState({
    stake: "",
    bookie: "",
    strategy: "",
    promoDesc: "",
    maxStake: "",
    event: "",
    multiType: "normal", // <-- add this line if not present!
  });
  
  const [legs, setLegs] = useState([
    { id: 1, event: "", selection: "", odds: "", stake: "" },
    { id: 2, event: "", selection: "", odds: "", stake: "" },
    { id: 3, event: "", selection: "", odds: "", stake: "" },
  ])
  // … inside AddBetDialog, after defining “legs” state:

  const addLeg = () => {
    const newId = legs.length > 0 ? Math.max(...legs.map((l) => l.id)) + 1 : 1;
    setLegs([
      ...legs,
      { id: newId, event: "", selection: "", odds: "", stake: "" },
    ]);
  };

  const removeLeg = (legId: number) => {
    if (legs.length > 1) {
      setLegs(legs.filter((l) => l.id !== legId));
    }
  };


  const [manualCombinedOdds, setManualCombinedOdds] = useState("")
  const [systemBet, setSystemBet] = useState({
    systemType: "",
    unitStake: "",
    bookie: "",
  })
  const [selections, setSelections] = useState([
    { id: 1, event: "", selection: "", odds: "", stake: "" },
    { id: 2, event: "", selection: "", odds: "", stake: "" },
    { id: 3, event: "", selection: "", odds: "", stake: "" },
    { id: 4, event: "", selection: "", odds: "", stake: "" },
  ])
  const [backLayBet, setBackLayBet] = useState({
    event: "",
    selection: "",
    backBookie: "",
    backOdds: "",
    backStake: "",
    layExchange: "",
    layOdds: "",
    layStake: "",
    commission: "5",
    liability: "",
    sport: "",
    notes: "",
    tipper: "",
  })

  // Utility functions to update state
  const updateSingleBet = useCallback((field, value) => setSingleBet(prev => ({ ...prev, [field]: value })), [])
  const updateMultiBet = useCallback((field, value) => setMultiBet(prev => ({ ...prev, [field]: value })), [])
  const updateSystemBet = (field, value) => setSystemBet(prev => ({ ...prev, [field]: value }))
  const updateBackLayBet = useCallback((field, value) => setBackLayBet(prev => ({ ...prev, [field]: value })), [])

  // Combined Odds for Multi
  const calculateCombinedOdds = () => {
    return legs
      .filter((leg) => leg.odds)
      .reduce((total, leg) => total * Number.parseFloat(leg.odds || 1), 1)
      .toFixed(2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Bet" : "Add New Bet"}</DialogTitle>
          <DialogDescription>
            {editMode ? "Update the details of your bet" : "Record a new bet in your tracking system"}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={betType} onValueChange={setBetType} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-6">
            <TabsTrigger value="single">Single Bet</TabsTrigger>
            <TabsTrigger value="multi">Multi/Parlay</TabsTrigger>
            <TabsTrigger value="system">System Bet</TabsTrigger>
            <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
            <TabsTrigger value="dutching">Dutching</TabsTrigger>
            <TabsTrigger value="backlay">Back & Lay</TabsTrigger>
          </TabsList>

          {/* ----------- SINGLE BET -------------- */}
          <TabsContent value="single">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="single-event">Event</Label>
                  <Input
                    id="single-event"
                    placeholder="e.g. Lakers vs Warriors"
                    value={singleBet.event}
                    onChange={(e) => updateSingleBet("event", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="single-sport">Sport</Label>
                  <Select value={singleBet.sport} onValueChange={(value) => updateSingleBet("sport", value)}>
                    <SelectTrigger id="single-sport">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Tennis">Tennis</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                      <SelectItem value="MMA">MMA</SelectItem>
                      <SelectItem value="Boxing">Boxing</SelectItem>
                      <SelectItem value="Golf">Golf</SelectItem>
                      <SelectItem value="Rugby">Rugby</SelectItem>
                      <SelectItem value="Cricket">Cricket</SelectItem>
                      <SelectItem value="Horse Racing">Horse Racing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="single-selection">Selection</Label>
                <Input
                  id="single-selection"
                  placeholder="e.g. Lakers to win"
                  value={singleBet.selection}
                  onChange={(e) => updateSingleBet("selection", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="single-odds">Odds</Label>
                  <Input
                    id="single-odds"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 2.10"
                    value={singleBet.odds}
                    onChange={(e) => updateSingleBet("odds", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="single-stake">Stake ($)</Label>
                  <Input
                    id="single-stake"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 100.00"
                    value={singleBet.stake}
                    onChange={(e) => updateSingleBet("stake", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="single-bookie">Bookmaker</Label>
                  <Select value={singleBet.bookie} onValueChange={(value) => updateSingleBet("bookie", value)}>
                    <SelectTrigger id="single-bookie">
                      <SelectValue placeholder="Select bookmaker" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bet365">Bet365</SelectItem>
                      <SelectItem value="Ladbrokes">Ladbrokes</SelectItem>
                      <SelectItem value="William Hill">William Hill</SelectItem>
                      <SelectItem value="Betfair">Betfair</SelectItem>
                      <SelectItem value="Unibet">Unibet</SelectItem>
                      <SelectItem value="Sportsbet">Sportsbet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="single-strategy">Betting Strategy</Label>
                <Select value={singleBet.strategy} onValueChange={(value) => updateSingleBet("strategy", value)}>
                  <SelectTrigger id="single-strategy">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Value Betting">Value Betting</SelectItem>
                    <SelectItem value="Backing Favorites">Backing Favorites</SelectItem>
                    <SelectItem value="Handicap Betting">Handicap Betting</SelectItem>
                    <SelectItem value="Over/Under">Over/Under</SelectItem>
                    <SelectItem value="BTTS">Both Teams to Score</SelectItem>
                    <SelectItem value="Prop Betting">Prop Betting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="single-tipper">Tipper/Source</Label>
                <Select value={singleBet.tipper} onValueChange={(value) => updateSingleBet("tipper", value)}>
                  <SelectTrigger id="single-tipper">
                    <SelectValue placeholder="Select tipper" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Self">Self</SelectItem>
                    <SelectItem value="SportsTips Pro">SportsTips Pro</SelectItem>
                    <SelectItem value="Tennis Insider">Tennis Insider</SelectItem>
                    <SelectItem value="MLB Expert">MLB Expert</SelectItem>
                    <SelectItem value="UFC Predictions">UFC Predictions</SelectItem>
                    <SelectItem value="Premier League Tips">Premier League Tips</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="single-date">Date Placed</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {safeFormatDate(date, "PPP") || "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="single-notes">Notes</Label>
                <Input
                  id="single-notes"
                  placeholder="Any additional notes about this bet"
                  value={singleBet.notes}
                  onChange={(e) => updateSingleBet("notes", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* MULTI/PARLAY */}
          <TabsContent value="multi">
  <div className="space-y-6">
    {/* Toggle for Multi type */}
    <div className="flex items-center justify-center space-x-2 p-1 border rounded-lg bg-muted/20">
      <button
        type="button"
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          multiBet.multiType === "normal" || !multiBet.multiType
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        onClick={() => updateMultiBet("multiType", "normal")}
      >
        Normal Multi
      </button>
      <button
        type="button"
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          multiBet.multiType === "samegame"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        onClick={() => updateMultiBet("multiType", "samegame")}
      >
        Same Game Multi
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="multi-stake">Total Stake ($)</Label>
        <Input
          id="multi-stake"
          type="number"
          step="0.01"
          placeholder="e.g. 50.00"
          value={multiBet.stake}
          onChange={(e) => updateMultiBet("stake", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="multi-bookie">Bookmaker</Label>
        <Select value={multiBet.bookie} onValueChange={(value) => updateMultiBet("bookie", value)}>
          <SelectTrigger id="multi-bookie">
            <SelectValue placeholder="Select bookmaker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bet365">Bet365</SelectItem>
            <SelectItem value="Ladbrokes">Ladbrokes</SelectItem>
            <SelectItem value="William Hill">William Hill</SelectItem>
            <SelectItem value="Betfair">Betfair</SelectItem>
            <SelectItem value="Unibet">Unibet</SelectItem>
            <SelectItem value="Sportsbet">Sportsbet</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{multiBet.multiType === "samegame" ? "Selections" : "Legs"}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setLegs([...legs, { id: legs.length + 1, event: "", selection: "", odds: "", stake: "" }])
          }
        >
          Add {multiBet.multiType === "samegame" ? "Selection" : "Leg"}
        </Button>
      </div>
      <div className="space-y-4">
        {legs.map((leg, index) => (
          <div key={leg.id} className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {multiBet.multiType === "samegame"
                  ? `Selection ${index + 1}`
                  : `Leg ${index + 1}`}
              </h4>
              {legs.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setLegs(legs.filter((l) => l.id !== leg.id))}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Event input (show only for Normal Multi) */}
              {(!multiBet.multiType || multiBet.multiType === "normal") && (
                <div className="space-y-2">
                  <Label htmlFor={`leg-${leg.id}-event`}>Event</Label>
                  <Input
                    id={`leg-${leg.id}-event`}
                    placeholder="e.g. Lakers vs Warriors"
                    value={leg.event}
                    onChange={(e) => {
                      const val = e.target.value
                      setLegs((legs) =>
                        legs.map((l) => (l.id === leg.id ? { ...l, event: val } : l))
                      )
                    }}
                  />
                </div>
              )}
              {/* Selection input */}
              <div className={`space-y-2 ${multiBet.multiType === "samegame" ? "md:col-span-2" : ""}`}>
                <Label htmlFor={`leg-${leg.id}-selection`}>Selection</Label>
                <Input
                  id={`leg-${leg.id}-selection`}
                  placeholder="e.g. Lakers to win"
                  value={leg.selection}
                  onChange={(e) => {
                    const val = e.target.value
                    setLegs((legs) =>
                      legs.map((l) => (l.id === leg.id ? { ...l, selection: val } : l))
                    )
                  }}
                />
              </div>
              {/* Odds input */}
              <div className="space-y-2">
                <Label htmlFor={`leg-${leg.id}-odds`}>Odds</Label>
                <Input
                  id={`leg-${leg.id}-odds`}
                  type="number"
                  step="0.01"
                  placeholder="e.g. 2.10"
                  value={leg.odds}
                  onChange={(e) => {
                    const val = e.target.value
                    setLegs((legs) =>
                      legs.map((l) => (l.id === leg.id ? { ...l, odds: val } : l))
                    )
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="combined-odds">Combined Odds</Label>
      <Input
        id="combined-odds"
        type="number"
        step="0.01"
        placeholder="Calculated odds"
        value={manualCombinedOdds || calculateCombinedOdds()}
        onChange={(e) => setManualCombinedOdds(e.target.value)}
      />
    </div>
    <div className="space-y-2">
      {/* For Same Game Multi, allow "Event" input above the legs */}
      {multiBet.multiType === "samegame" && (
        <div className="space-y-2 mb-4">
          <Label htmlFor="multi-event">Event</Label>
          <Input
            id="multi-event"
            placeholder="e.g. Lakers vs Warriors"
            value={multiBet.event || ""}
            onChange={(e) => updateMultiBet("event", e.target.value)}
          />
        </div>
      )}
      <Label htmlFor="multi-date">Date Placed</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {safeFormatDate(date, "PPP") || "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  </div>
</TabsContent>

          {/* SYSTEM BET */}
          <TabsContent value="system">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>System Type</Label>
                  <Input value={systemBet.systemType} onChange={e => updateSystemBet("systemType", e.target.value)} />
                </div>
                <div>
                  <Label>Unit Stake</Label>
                  <Input type="number" value={systemBet.unitStake} onChange={e => updateSystemBet("unitStake", e.target.value)} />
                </div>
                <div>
                  <Label>Bookie</Label>
                  <Input value={systemBet.bookie} onChange={e => updateSystemBet("bookie", e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Selections</Label>
                {selections.map((sel, i) => (
                  <div key={sel.id} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Event"
                      value={sel.event}
                      onChange={e => {
                        const val = e.target.value
                        setSelections(selections => selections.map((s, idx) => idx === i ? { ...s, event: val } : s))
                      }}
                    />
                    <Input
                      placeholder="Selection"
                      value={sel.selection}
                      onChange={e => {
                        const val = e.target.value
                        setSelections(selections => selections.map((s, idx) => idx === i ? { ...s, selection: val } : s))
                      }}
                    />
                    <Input
                      placeholder="Odds"
                      type="number"
                      value={sel.odds}
                      onChange={e => {
                        const val = e.target.value
                        setSelections(selections => selections.map((s, idx) => idx === i ? { ...s, odds: val } : s))
                      }}
                    />
                    <Button type="button" size="sm" onClick={() => setSelections(selections.filter((_, idx) => idx !== i))}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" size="sm" onClick={() => setSelections([...selections, { id: selections.length + 1, event: "", selection: "", odds: "", stake: "" }])}>
                  Add Selection
                </Button>
              </div>
              <div>
                <Label>Date Placed</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {safeFormatDate(date, "PPP") || "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </TabsContent>

  {/* ARBITRAGE */}
<TabsContent value="arbitrage">
  <div className="space-y-6">
    {/* Event Header */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="arb-event">Event</Label>
        <Input
          id="arb-event"
          placeholder="e.g. Man Utd vs Liverpool"
          value={singleBet.event}
          onChange={(e) => updateSingleBet("event", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="arb-sport">Sport</Label>
        <Select
          value={singleBet.sport}
          onValueChange={(value) => updateSingleBet("sport", value)}
        >
          <SelectTrigger id="arb-sport">
            <SelectValue placeholder="Select sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Basketball">Basketball</SelectItem>
            <SelectItem value="Soccer">Soccer</SelectItem>
            <SelectItem value="Tennis">Tennis</SelectItem>
            <SelectItem value="Baseball">Baseball</SelectItem>
            <SelectItem value="MMA">MMA</SelectItem>
            <SelectItem value="Boxing">Boxing</SelectItem>
            <SelectItem value="Golf">Golf</SelectItem>
            <SelectItem value="Rugby">Rugby</SelectItem>
            <SelectItem value="Cricket">Cricket</SelectItem>
            <SelectItem value="Horse Racing">Horse Racing</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* Arbitrage Bets List */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Arbitrage Bets</Label>
        <Button type="button" variant="outline" size="sm" onClick={addLeg}>
          Add Bet
        </Button>
      </div>

      <div className="space-y-4">
        {legs.map((leg, index) => (
          <div key={leg.id} className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Bet {index + 1}</h4>
              {legs.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLeg(leg.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`arb-${leg.id}-selection`}>Selection</Label>
                <Input
                  id={`arb-${leg.id}-selection`}
                  placeholder="e.g. Man Utd to win"
                  value={leg.selection}
                  onChange={(e) => updateLeg(leg.id, "selection", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`arb-${leg.id}-bookie`}>Bookmaker</Label>
                <Input
                  id={`arb-${leg.id}-bookie`}
                  placeholder="e.g. Bet365"
                  value={leg.event}
                  onChange={(e) => updateLeg(leg.id, "event", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`arb-${leg.id}-odds`}>Odds</Label>
                <Input
                  id={`arb-${leg.id}-odds`}
                  type="number"
                  step="0.01"
                  placeholder="e.g. 2.10"
                  value={leg.odds}
                  onChange={(e) => updateLeg(leg.id, "odds", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`arb-${leg.id}-stake`}>Stake ($)</Label>
                <Input
                  id={`arb-${leg.id}-stake`}
                  type="number"
                  step="0.01"
                  placeholder="e.g. 100.00"
                  value={leg.stake || ""}
                  onChange={(e) => updateLeg(leg.id, "stake", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Date Placed */}
    <div className="space-y-2">
      <Label htmlFor="arb-date">Date Placed</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {safeFormatDate(date, "PPP") || "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>
    </div>

    {/* Summary Panel */}
    <div className="border rounded-md p-4 bg-muted/30">
      <h3 className="font-medium">Arbitrage Summary</h3>
      <div className="mt-2 space-y-2">
        <div className="flex justify-between">
          <span>Total Stake:</span>
          <span className="font-medium">
            ${legs.reduce((total, leg) => total + Number(leg.stake || 0), 0).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Implied Probability:</span>
          <span className="font-medium">
            {legs.some((leg) => !leg.odds)
              ? "N/A"
              : (legs.reduce((total, leg) => total + 1 / Number(leg.odds || 1), 0) * 100).toFixed(2) + "%"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Arbitrage Opportunity:</span>
          <span
            className={`font-medium ${
              legs.some((leg) => !leg.odds)
                ? ""
                : legs.reduce((total, leg) => total + 1 / Number(leg.odds || 1), 0) < 1
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {legs.some((leg) => !leg.odds)
              ? "N/A"
              : legs.reduce((total, leg) => total + 1 / Number(leg.odds || 1), 0) < 1
              ? "Yes"
              : "No"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Expected Profit:</span>
          <span className="font-medium text-green-600">
            {legs.some((leg) => !leg.odds || !leg.stake)
              ? "0.00"
              : (
                  legs.reduce((total, leg) => total + Number(leg.stake || 0), 0) *
                  (1 -
                    legs.reduce((total, leg) => total + 1 / Number(leg.odds || 1), 0))
                ).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  </div>
</TabsContent>


{/* DUTCHING */}
<TabsContent value="dutching">
  <div className="space-y-6">
    {/* Header: Event & Total Stake */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="dutch-event">Event</Label>
        <Input
          id="dutch-event"
          placeholder="e.g. Grand National"
          value={singleBet.event}
          onChange={(e) => updateSingleBet("event", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dutch-total-stake">Total Stake ($)</Label>
        <Input
          id="dutch-total-stake"
          type="number"
          step="0.01"
          placeholder="e.g. 100.00"
          value={singleBet.stake}
          onChange={(e) => updateSingleBet("stake", e.target.value)}
        />
      </div>
    </div>

    {/* Selections List */}
    <div className="space-y-2">
      <Label>Selections</Label>
      <div className="space-y-4">
        {selections.map((selection, index) => (
          <div
            key={index}
            className="border rounded-md p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Selection {index + 1}</h4>
              {selections.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSelections(selections.filter((s, i) => i !== index))
                  }
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`dutch-${selection.id}-selection`}>Selection</Label>
                <Input
                  id={`dutch-${selection.id}-selection`}
                  placeholder="e.g. Horse Name"
                  value={selection.selection}
                  onChange={(e) => {
                    const val = e.target.value
                    setSelections((prev) =>
                      prev.map((s, i) =>
                        i === index ? { ...s, selection: val } : s
                      )
                    )
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`dutch-${selection.id}-odds`}>Odds</Label>
                <Input
                  id={`dutch-${selection.id}-odds`}
                  type="number"
                  step="0.01"
                  placeholder="e.g. 5.00"
                  value={selection.odds}
                  onChange={(e) => {
                    const val = e.target.value
                    setSelections((prev) =>
                      prev.map((s, i) =>
                        i === index ? { ...s, odds: val } : s
                      )
                    )
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`dutch-${selection.id}-stake`}>Calculated Stake ($)</Label>
                <Input
                  id={`dutch-${selection.id}-stake`}
                  type="number"
                  step="0.01"
                  placeholder="Calculated"
                  value={selection.stake || ""}
                  onChange={(e) => {
                    const val = e.target.value
                    setSelections((prev) =>
                      prev.map((s, i) =>
                        i === index ? { ...s, stake: val } : s
                      )
                    )
                  }}
                  disabled
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          setSelections((prev) => [
            ...prev,
            { id: prev.length + 1, selection: "", odds: "", stake: "" },
          ])
        }
      >
        Add Selection
      </Button>
    </div>

    {/* Target Profit & Date Placed */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="dutch-target-profit">Target Profit ($)</Label>
        <Input
          id="dutch-target-profit"
          type="number"
          step="0.01"
          placeholder="e.g. 50.00"
          value={singleBet.targetProfit || ""}
          onChange={(e) => updateSingleBet("targetProfit", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dutch-date">Date Placed</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full justify-start text-left font-normal" variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {safeFormatDate(date, "PPP") || "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
    </div>

    {/* Summary Panel */}
    <div className="border rounded-md p-4 bg-muted/30">
      <h3 className="font-medium">Dutching Summary</h3>
      <div className="mt-2 space-y-2">
        <div className="flex justify-between">
          <span>Total Stake:</span>
          <span className="font-medium">${singleBet.stake || "0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span>Implied Probability:</span>
          <span className="font-medium">
            {selections.some((sel) => !sel.odds)
              ? "N/A"
              : (
                  selections.reduce(
                    (total, sel) => total + 1 / Number(sel.odds || 1),
                    0
                  ) * 100
                ).toFixed(2) + "%"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Expected Return:</span>
          <span className="font-medium">
            {selections.some((sel) => !sel.odds) || !singleBet.stake
              ? "N/A"
              : "$" +
                (
                  Number(singleBet.stake) /
                  selections.reduce(
                    (total, sel) => total + 1 / Number(sel.odds || 1),
                    0
                  )
                ).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Expected Profit:</span>
          <span className="font-medium text-green-600">
            {selections.some((sel) => !sel.odds) || !singleBet.stake
              ? "$0.00"
              : "$" +
                (
                  Number(singleBet.stake) /
                    selections.reduce(
                      (total, sel) => total + 1 / Number(sel.odds || 1),
                      0
                    ) -
                  Number(singleBet.stake)
                ).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  </div>
</TabsContent>


          {/* BACK & LAY */}
          <TabsContent value="backlay">
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Back Bet Column */}
      <div className="border rounded-md p-4 space-y-4 bg-white dark:bg-zinc-900">
        <h3 className="font-semibold text-lg mb-2 border-b pb-2">Back Bet</h3>
        <div className="space-y-2">
          <Label htmlFor="backlay-event">Event</Label>
          <Input
            id="backlay-event"
            placeholder="e.g. Man Utd vs Liverpool"
            value={backLayBet.event}
            onChange={(e) => updateBackLayBet("event", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="backlay-selection">Selection</Label>
          <Input
            id="backlay-selection"
            placeholder="e.g. Man Utd to win"
            value={backLayBet.selection}
            onChange={(e) => updateBackLayBet("selection", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="back-bookie">Bookmaker</Label>
          <Select onValueChange={(value) => updateBackLayBet("backBookie", value)}>
            <SelectTrigger id="back-bookie">
              <SelectValue placeholder="Select bookmaker" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bet365">Bet365</SelectItem>
              <SelectItem value="Ladbrokes">Ladbrokes</SelectItem>
              <SelectItem value="William Hill">William Hill</SelectItem>
              <SelectItem value="Sportsbet">Sportsbet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {backLayBet.backBookie && availableBonusBets[backLayBet.backBookie] && (
          <div className="mt-2 p-2 border rounded-md bg-purple-50 dark:bg-purple-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">
                  ${availableBonusBets[backLayBet.backBookie].amount} Bonus Bet Available
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-xs border-purple-500 text-purple-600 hover:bg-purple-100"
                onClick={() => handleUseBonusBet(backLayBet.backBookie)}
              >
                Use Bonus Bet
              </Button>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="back-stake">Back Stake ($)</Label>
          <Input
            id="back-stake"
            type="number"
            step="0.01"
            placeholder="e.g. 100.00"
            value={backLayBet.backStake}
            onChange={(e) => updateBackLayBet("backStake", e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
        </div>
        <div className="space-y-2">
          <Label htmlFor="back-odds">Back Odds</Label>
          <Input
            id="back-odds"
            type="number"
            step="0.01"
            placeholder="e.g. 2.10"
            value={backLayBet.backOdds}
            onChange={(e) => updateBackLayBet("backOdds", e.target.value)}
          />
        </div>
      </div>

      {/* Lay Bet Column */}
      <div className="border rounded-md p-4 space-y-4 bg-white dark:bg-zinc-900">
        <h3 className="font-semibold text-lg mb-2 border-b pb-2">Lay Bet</h3>
        <div className="space-y-2">
          <Label htmlFor="lay-exchange">Exchange</Label>
          <Select onValueChange={(value) => updateBackLayBet("layExchange", value)}>
            <SelectTrigger id="lay-exchange">
              <SelectValue placeholder="Select exchange" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Betfair">Betfair</SelectItem>
              <SelectItem value="Smarkets">Smarkets</SelectItem>
              <SelectItem value="Matchbook">Matchbook</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lay-stake">Lay Stake ($)</Label>
          <Input
            id="lay-stake"
            type="number"
            step="0.01"
            placeholder="e.g. 95.45"
            value={backLayBet.layStake}
            onChange={(e) => updateBackLayBet("layStake", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lay-odds">Lay Odds</Label>
          <Input
            id="lay-odds"
            type="number"
            step="0.01"
            placeholder="e.g. 2.20"
            value={backLayBet.layOdds}
            onChange={(e) => updateBackLayBet("layOdds", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="commission">Commission (%)</Label>
          <Input
            id="commission"
            type="number"
            step="0.1"
            placeholder="e.g. 5.0"
            value={backLayBet.commission}
            onChange={(e) => updateBackLayBet("commission", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="liability">Liability ($)</Label>
          <Input
            id="liability"
            type="number"
            step="0.01"
            placeholder="Calculated"
            value={backLayBet.liability}
            disabled
          />
          <p className="text-xs text-muted-foreground">
            You will need {backLayBet.liability ? `$${backLayBet.liability}` : "liability"} on{" "}
            {backLayBet.layExchange || "selected exchange"}
          </p>
        </div>
      </div>
    </div>

    {/* Outcome/Profit Analysis */}
    <div className="border rounded-md p-4 mt-4 bg-muted/30">
    </div>

    {/* Notes, tipper, and date */}
    <div className="mt-6 space-y-2">
      <Label htmlFor="bl-date">Date Placed</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {safeFormatDate(date, "PPP") || "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>
      <Label htmlFor="bl-tipper">Tipper/Source</Label>
      <Select onValueChange={(value) => updateBackLayBet("tipper", value)}>
        <SelectTrigger id="bl-tipper">
          <SelectValue placeholder="Select tipper" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Self">Self</SelectItem>
          <SelectItem value="SportsTips Pro">SportsTips Pro</SelectItem>
          <SelectItem value="Tennis Insider">Tennis Insider</SelectItem>
          <SelectItem value="MLB Expert">MLB Expert</SelectItem>
          <SelectItem value="UFC Predictions">UFC Predictions</SelectItem>
          <SelectItem value="Premier League Tips">Premier League Tips</SelectItem>
          <SelectItem value="Dutching">Dutching</SelectItem>
          <SelectItem value="Arbitrage">Arbitrage</SelectItem>
          <SelectItem value="Bonus Bet">Bonus Bet</SelectItem>
        </SelectContent>
      </Select>
      <Label htmlFor="bl-notes">Notes</Label>
      <Input
        id="bl-notes"
        placeholder="Any additional notes about this back & lay bet"
        value={backLayBet.notes}
        onChange={(e) => updateBackLayBet("notes", e.target.value)}
      />
    </div>
  </div>
</TabsContent>

        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => { toast({ title: "Saved!", description: "Bet saved (dummy logic)." }); onOpenChange(false); }}>
            {editMode ? "Update Bet" : "Save Bet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
