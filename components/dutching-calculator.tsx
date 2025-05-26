"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

export function DutchingCalculator() {
  const [date, setDate] = useState(new Date())
  const [calculationMode, setCalculationMode] = useState("equal-profit")
  const [totalStake, setTotalStake] = useState(100)
  const [commission, setCommission] = useState(5)
  const [selections, setSelections] = useState([
    { id: 1, name: "", odds: "", probability: "", stake: "", profit: "" },
    { id: 2, name: "", odds: "", probability: "", stake: "", profit: "" },
  ])
  const [totalProbability, setTotalProbability] = useState(0)
  const [expectedProfit, setExpectedProfit] = useState(0)
  const [returnRate, setReturnRate] = useState(0)
  const [bookmakers, setBookmakers] = useState([
    { id: 1, name: "Bet365" },
    { id: 2, name: "Ladbrokes" },
  ])

  // Calculate probabilities, stakes, and profits when odds change
  useEffect(() => {
    calculateAll()
  }, [selections, totalStake, calculationMode, commission])

  const calculateAll = () => {
    // Calculate implied probabilities
    const updatedSelections = selections.map((selection) => {
      const odds = Number.parseFloat(selection.odds) || 0
      const probability = odds > 0 ? (1 / odds) * 100 : 0
      return {
        ...selection,
        probability: probability.toFixed(2),
      }
    })

    // Calculate total probability
    const totalProb = updatedSelections.reduce((sum, selection) => {
      return sum + Number.parseFloat(selection.probability || 0)
    }, 0)
    setTotalProbability(totalProb)

    // Calculate stakes and profits based on mode
    if (calculationMode === "equal-profit") {
      calculateEqualProfit(updatedSelections, totalProb)
    } else {
      calculateProportionalStakes(updatedSelections, totalProb)
    }
  }

  const calculateEqualProfit = (updatedSelections, totalProb) => {
    if (totalProb === 0) {
      setSelections(updatedSelections)
      setExpectedProfit(0)
      setReturnRate(0)
      return
    }

    // Calculate profit margin
    const margin = 1 - totalProb / 100
    if (margin <= 0) {
      // No profit possible
      const evenStake = totalStake / updatedSelections.length
      const updatedWithStakes = updatedSelections.map((selection) => {
        return {
          ...selection,
          stake: evenStake.toFixed(2),
          profit: "0.00",
        }
      })
      setSelections(updatedWithStakes)
      setExpectedProfit(0)
      setReturnRate(0)
      return
    }

    // Calculate equal profit for all outcomes
    const commissionRate = commission / 100
    const profit = totalStake * margin
    const adjustedProfit = profit * (1 - commissionRate)

    const updatedWithStakes = updatedSelections.map((selection) => {
      const odds = Number.parseFloat(selection.odds) || 0
      const probability = Number.parseFloat(selection.probability) || 0
      if (probability === 0) return { ...selection, stake: "0.00", profit: "0.00" }

      // Calculate stake needed to achieve equal profit
      const stake = (adjustedProfit / (odds - 1)).toFixed(2)
      return {
        ...selection,
        stake,
        profit: adjustedProfit.toFixed(2),
      }
    })

    // Recalculate total stake based on individual stakes
    const calculatedTotalStake = updatedWithStakes.reduce((sum, selection) => {
      return sum + Number.parseFloat(selection.stake || 0)
    }, 0)

    // Adjust stakes proportionally to match desired total stake
    const adjustmentFactor = totalStake / calculatedTotalStake
    const finalSelections = updatedWithStakes.map((selection) => {
      const adjustedStake = (Number.parseFloat(selection.stake) * adjustmentFactor).toFixed(2)
      return {
        ...selection,
        stake: adjustedStake,
      }
    })

    setSelections(finalSelections)
    setExpectedProfit(adjustedProfit.toFixed(2))
    setReturnRate(((adjustedProfit / totalStake) * 100).toFixed(2))
  }

  const calculateProportionalStakes = (updatedSelections, totalProb) => {
    if (totalProb === 0) {
      setSelections(updatedSelections)
      setExpectedProfit(0)
      setReturnRate(0)
      return
    }

    // Calculate stakes proportional to probabilities
    const updatedWithStakes = updatedSelections.map((selection) => {
      const probability = Number.parseFloat(selection.probability) || 0
      const proportionalStake = (probability / totalProb) * totalStake
      const odds = Number.parseFloat(selection.odds) || 0
      const profit = proportionalStake * (odds - 1)

      return {
        ...selection,
        stake: proportionalStake.toFixed(2),
        profit: profit.toFixed(2),
      }
    })

    // Calculate expected profit (average of all outcomes)
    const totalProfit = updatedWithStakes.reduce((sum, selection) => {
      return sum + Number.parseFloat(selection.profit || 0)
    }, 0)
    const avgProfit = totalProfit / updatedWithStakes.length
    const commissionRate = commission / 100
    const adjustedProfit = avgProfit * (1 - commissionRate)

    setSelections(updatedWithStakes)
    setExpectedProfit(adjustedProfit.toFixed(2))
    setReturnRate(((adjustedProfit / totalStake) * 100).toFixed(2))
  }

  const addSelection = () => {
    const newId = Math.max(...selections.map((s) => s.id), 0) + 1
    setSelections([...selections, { id: newId, name: "", odds: "", probability: "", stake: "", profit: "" }])

    // Add a default bookmaker if needed
    if (bookmakers.length < selections.length + 1) {
      const newBookmakerId = Math.max(...bookmakers.map((b) => b.id), 0) + 1
      setBookmakers([...bookmakers, { id: newBookmakerId, name: "Bookmaker " + newBookmakerId }])
    }
  }

  const removeSelection = (id) => {
    if (selections.length <= 2) return // Keep at least 2 selections
    setSelections(selections.filter((selection) => selection.id !== id))
  }

  const updateSelection = (id, field, value) => {
    setSelections(
      selections.map((selection) => {
        if (selection.id === id) {
          return { ...selection, [field]: value }
        }
        return selection
      }),
    )
  }

  const updateBookmaker = (id, name) => {
    setBookmakers(
      bookmakers.map((bookmaker) => {
        if (bookmaker.id === id) {
          return { ...bookmaker, name }
        }
        return bookmaker
      }),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dutching Calculator</CardTitle>
        <CardDescription>Calculate optimal stakes for dutching across multiple selections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="bet-details">Bet Details</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dutch-event">Event</Label>
                  <Input id="dutch-event" placeholder="e.g. Melbourne Cup, NBA Finals" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dutch-date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Calculator Mode</Label>
                  <Select value={calculationMode} onValueChange={setCalculationMode}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal-profit">Equal Profit</SelectItem>
                      <SelectItem value="proportional">Proportional Stakes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  {calculationMode === "equal-profit"
                    ? "Same return regardless of outcome"
                    : "Stakes based on probability"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total-stake">Total Stake ($)</Label>
                  <Input
                    id="total-stake"
                    type="number"
                    step="0.01"
                    value={totalStake}
                    onChange={(e) => setTotalStake(Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission">Commission (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    step="0.1"
                    value={commission}
                    onChange={(e) => setCommission(Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Team A/Selection 1 Column */}
                <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--primary))" }}>
                  <CardHeader className="bg-primary/10 pb-2">
                    <CardTitle className="text-center text-lg">Selection 1</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {selections.slice(0, 1).map((selection, index) => (
                      <div key={selection.id} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Selection Name</Label>
                          <Input
                            placeholder="e.g. Team A to win"
                            value={selection.name}
                            onChange={(e) => updateSelection(selection.id, "name", e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Bookmaker</Label>
                            <Select
                              value={bookmakers[index]?.name}
                              onValueChange={(value) => updateBookmaker(bookmakers[index].id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Bookmaker" />
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
                          <div className="space-y-2">
                            <Label>Odds</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="e.g. 2.50"
                              value={selection.odds}
                              onChange={(e) => updateSelection(selection.id, "odds", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Stake ($)</Label>
                            <div className="h-10 px-3 rounded-md border bg-muted/50 text-sm flex items-center">
                              {selection.stake}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Return ($)</Label>
                            <div className="h-10 px-3 rounded-md border bg-muted/50 text-sm flex items-center">
                              {selection.odds && selection.stake
                                ? (Number(selection.odds) * Number(selection.stake)).toFixed(2)
                                : "0.00"}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Best Available Odds</Label>
                            <div className="flex items-center">
                              <Checkbox id="auto-populate-1" />
                              <Label htmlFor="auto-populate-1" className="ml-2 text-sm">
                                Auto-populate
                              </Label>
                            </div>
                          </div>
                          <Input placeholder="Enter best odds" />
                        </div>

                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Position if Wins:</span>
                            <span className="text-sm font-medium">${selection.profit}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm font-medium">Implied Probability:</span>
                            <span className="text-sm font-medium">{selection.probability}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Team B/Selection 2 Column */}
                <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--destructive))" }}>
                  <CardHeader className="bg-destructive/10 pb-2">
                    <CardTitle className="text-center text-lg">Selection 2</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {selections.slice(1, 2).map((selection, index) => (
                      <div key={selection.id} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Selection Name</Label>
                          <Input
                            placeholder="e.g. Team B to win"
                            value={selection.name}
                            onChange={(e) => updateSelection(selection.id, "name", e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Bookmaker</Label>
                            <Select
                              value={bookmakers[index + 1]?.name}
                              onValueChange={(value) => updateBookmaker(bookmakers[index + 1].id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Bookmaker" />
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
                          <div className="space-y-2">
                            <Label>Odds</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="e.g. 2.50"
                              value={selection.odds}
                              onChange={(e) => updateSelection(selection.id, "odds", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Stake ($)</Label>
                            <div className="h-10 px-3 rounded-md border bg-muted/50 text-sm flex items-center">
                              {selection.stake}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Return ($)</Label>
                            <div className="h-10 px-3 rounded-md border bg-muted/50 text-sm flex items-center">
                              {selection.odds && selection.stake
                                ? (Number(selection.odds) * Number(selection.stake)).toFixed(2)
                                : "0.00"}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Best Available Odds</Label>
                            <div className="flex items-center">
                              <Checkbox id="auto-populate-2" />
                              <Label htmlFor="auto-populate-2" className="ml-2 text-sm">
                                Auto-populate
                              </Label>
                            </div>
                          </div>
                          <Input placeholder="Enter best odds" />
                        </div>

                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Position if Wins:</span>
                            <span className="text-sm font-medium">${selection.profit}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm font-medium">Implied Probability:</span>
                            <span className="text-sm font-medium">{selection.probability}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Additional selections */}
              {selections.length > 2 && (
                <div className="space-y-4 mt-4">
                  <h3 className="font-medium">Additional Selections</h3>
                  {selections.slice(2).map((selection, index) => (
                    <Card key={selection.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Selection {index + 3}</CardTitle>
                          <Button variant="ghost" size="icon" onClick={() => removeSelection(selection.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Selection Name</Label>
                            <Input
                              placeholder="e.g. Draw"
                              value={selection.name}
                              onChange={(e) => updateSelection(selection.id, "name", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Bookmaker</Label>
                            <Select
                              value={bookmakers[index + 2]?.name}
                              onValueChange={(value) => updateBookmaker(bookmakers[index + 2].id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Bookmaker" />
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
                          <div className="space-y-2">
                            <Label>Odds</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="e.g. 2.50"
                              value={selection.odds}
                              onChange={(e) => updateSelection(selection.id, "odds", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label>Stake ($)</Label>
                            <div className="h-10 px-3 rounded-md border bg-muted/50 text-sm flex items-center">
                              {selection.stake}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Return ($)</Label>
                            <div className="h-10 px-3 rounded-md border bg-muted/50 text-sm flex items-center">
                              {selection.odds && selection.stake
                                ? (Number(selection.odds) * Number(selection.stake)).toFixed(2)
                                : "0.00"}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Implied Probability</Label>
                            <div className="h-10 px-3 rounded-md border bg-muted/50 text-sm flex items-center">
                              {selection.probability}%
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={addSelection}>
                  <Plus className="h-4 w-4 mr-1" /> Add Selection
                </Button>
              </div>

              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle>Dutching Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Total Probability:</p>
                      <p className="text-lg font-bold">{totalProbability.toFixed(2)}%</p>
                      <p className="text-xs text-muted-foreground">
                        {totalProbability > 100 ? "Over 100% - No profit possible" : "Under 100% - Profit possible"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Expected Profit:</p>
                      <p className="text-lg font-bold text-green-600">${expectedProfit}</p>
                      <p className="text-xs text-muted-foreground">
                        {calculationMode === "equal-profit"
                          ? "Same profit regardless of outcome"
                          : "Average profit across outcomes"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Return Rate:</p>
                      <p className="text-lg font-bold text-green-600">{returnRate}%</p>
                      <p className="text-xs text-muted-foreground">Profit as percentage of total stake</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30 border-t-4 border-primary">
                <CardContent className="pt-4">
                  <p className="text-center mb-2">In order to equalise your position you should bet:</p>
                  <p className="text-center text-lg font-bold">
                    {selections[0].stake && selections[0].name
                      ? `$${selections[0].stake} on ${selections[0].name}`
                      : "$0.00 on Selection 1"}
                    {selections[1] && selections[1].stake && selections[1].name
                      ? ` and $${selections[1].stake} on ${selections[1].name}`
                      : " and $0.00 on Selection 2"}
                    {selections.length > 2 ? ` and ${selections.length - 2} more selections` : ""}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bet-details" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dutch-sport">Sport</Label>
                  <Select>
                    <SelectTrigger id="dutch-sport">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="soccer">Soccer</SelectItem>
                      <SelectItem value="tennis">Tennis</SelectItem>
                      <SelectItem value="baseball">Baseball</SelectItem>
                      <SelectItem value="mma">MMA</SelectItem>
                      <SelectItem value="boxing">Boxing</SelectItem>
                      <SelectItem value="golf">Golf</SelectItem>
                      <SelectItem value="rugby">Rugby</SelectItem>
                      <SelectItem value="cricket">Cricket</SelectItem>
                      <SelectItem value="horse-racing">Horse Racing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dutch-tipper">Tipper/Source</Label>
                  <Select>
                    <SelectTrigger id="dutch-tipper">
                      <SelectValue placeholder="Select tipper" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Self</SelectItem>
                      <SelectItem value="sportstips">SportsTips Pro</SelectItem>
                      <SelectItem value="tennis">Tennis Insider</SelectItem>
                      <SelectItem value="mlb">MLB Expert</SelectItem>
                      <SelectItem value="ufc">UFC Predictions</SelectItem>
                      <SelectItem value="premier">Premier League Tips</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dutch-notes">Notes</Label>
                  <Input id="dutch-notes" placeholder="Any additional notes about this dutching bet" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="dutch-promo" />
                  <Label htmlFor="dutch-promo">Promotional Bet</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save Dutching Bet</Button>
      </CardFooter>
    </Card>
  )
}
