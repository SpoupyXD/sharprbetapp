"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Trash, Plus, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

// First, import the new components at the top of the file
import { KellyCalculator } from "@/components/kelly-calculator"
import { BankrollManager } from "@/components/bankroll-manager"

export default function SetupPage() {
  // State for bet types
  const [betTypes, setBetTypes] = useState([
    { id: 1, name: "Single", description: "Standard single selection bet" },
    { id: 2, name: "Multi/Parlay", description: "Multiple selections combined" },
    { id: 3, name: "System", description: "Complex combination bets" },
    { id: 4, name: "Promo", description: "Promotional offers from bookmakers" },
    { id: 5, name: "Positive EV", description: "Positive expected value bets" },
    { id: 6, name: "Horse Racing", description: "Horse racing specific bets" },
  ])
  const [newBetType, setNewBetType] = useState({ name: "", description: "" })

  // State for tippers
  const [tippers, setTippers] = useState([
    { id: 1, name: "Self", description: "Your own selections", active: true },
    { id: 2, name: "SportsTips Pro", description: "Professional sports tipster", active: true },
    { id: 3, name: "Tennis Insider", description: "Tennis specialist", active: true },
    { id: 4, name: "MLB Expert", description: "Baseball expert", active: true },
    { id: 5, name: "Dutching", description: "Betting on multiple outcomes to guarantee profit", active: true },
    { id: 6, name: "Arbitrage", description: "Exploiting odds differences between bookmakers", active: true },
    { id: 7, name: "Bonus Bet", description: "Free bets or promotions from bookmakers", active: true },
  ])
  const [newTipper, setNewTipper] = useState({ name: "", description: "" })

  // State for odds format
  const [oddsFormat, setOddsFormat] = useState("decimal")

  // State for other preferences
  const [defaultCurrency, setDefaultCurrency] = useState("USD")
  const [showProfitInPercent, setShowProfitInPercent] = useState(false)
  const [autoCalculateReturns, setAutoCalculateReturns] = useState(true)

  // Add new bet type
  const addBetType = () => {
    if (newBetType.name.trim() === "") return
    setBetTypes([
      ...betTypes,
      {
        id: betTypes.length + 1,
        name: newBetType.name,
        description: newBetType.description,
      },
    ])
    setNewBetType({ name: "", description: "" })
  }

  // Remove bet type
  const removeBetType = (id) => {
    setBetTypes(betTypes.filter((type) => type.id !== id))
  }

  // Add new tipper
  const addTipper = () => {
    if (newTipper.name.trim() === "") return
    setTippers([
      ...tippers,
      {
        id: tippers.length + 1,
        name: newTipper.name,
        description: newTipper.description,
        active: true,
      },
    ])
    setNewTipper({ name: "", description: "" })
  }

  // Remove tipper
  const removeTipper = (id) => {
    setTippers(tippers.filter((tipper) => tipper.id !== id))
  }

  // Toggle tipper active status
  const toggleTipperActive = (id) => {
    setTippers(tippers.map((tipper) => (tipper.id === id ? { ...tipper, active: !tipper.active } : tipper)))
  }

  return (
    <div className="pt-2 p-6 md:px-10 md:pb-10">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Setup</h1>
        <p className="text-muted-foreground">Configure your bet types, tippers, and preferences</p>
      </div>

      <Tabs defaultValue="bet-types" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="bet-types">Bet Types</TabsTrigger>
          <TabsTrigger value="tippers">Tippers</TabsTrigger>
          <TabsTrigger value="bankroll">Bankroll</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="bet-types">
          <Card>
            <CardHeader>
              <CardTitle>Bet Types</CardTitle>
              <CardDescription>Configure the types of bets you want to track</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {betTypes.map((type) => (
                  <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeBetType(type.id)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add New Bet Type</h3>
                <div className="space-y-2">
                  <Label htmlFor="bet-type-name">Bet Type Name</Label>
                  <Input
                    id="bet-type-name"
                    value={newBetType.name}
                    onChange={(e) => setNewBetType({ ...newBetType, name: e.target.value })}
                    placeholder="Enter bet type name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bet-type-description">Description</Label>
                  <Input
                    id="bet-type-description"
                    value={newBetType.description}
                    onChange={(e) => setNewBetType({ ...newBetType, description: e.target.value })}
                    placeholder="Brief description of this bet type"
                  />
                </div>
                <Button onClick={addBetType} className="w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Bet Type
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tippers">
          <Card>
            <CardHeader>
              <CardTitle>Tippers</CardTitle>
              <CardDescription>Manage the sources of your betting tips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {tippers.map((tipper) => (
                  <div key={tipper.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {tipper.name}
                        {!tipper.active && <Badge variant="outline">Inactive</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">{tipper.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={tipper.active}
                        onCheckedChange={() => toggleTipperActive(tipper.id)}
                        aria-label="Toggle active status"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeTipper(tipper.id)}>
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add New Tipper</h3>
                <div className="space-y-2">
                  <Label htmlFor="tipper-name">Tipper Name</Label>
                  <Input
                    id="tipper-name"
                    value={newTipper.name}
                    onChange={(e) => setNewTipper({ ...newTipper, name: e.target.value })}
                    placeholder="Enter tipper name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipper-description">Description</Label>
                  <Input
                    id="tipper-description"
                    value={newTipper.description}
                    onChange={(e) => setNewTipper({ ...newTipper, description: e.target.value })}
                    placeholder="Brief description of this tipper"
                  />
                </div>
                <Button onClick={addTipper} className="w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tipper
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bankroll">
          <div className="space-y-6">
            <BankrollManager />
            <KellyCalculator />
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Configure your display and calculation preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Odds Format</h3>
                <RadioGroup
                  value={oddsFormat}
                  onValueChange={setOddsFormat}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="decimal" id="decimal" />
                    <Label htmlFor="decimal">Decimal (1.91)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="american" id="american" />
                    <Label htmlFor="american">American (-110)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fractional" id="fractional" />
                    <Label htmlFor="fractional">Fractional (10/11)</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Currency</h3>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Display Options</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="profit-percent">Show Profit in Percentage</Label>
                    <p className="text-sm text-muted-foreground">Display profit as percentage of stake</p>
                  </div>
                  <Switch id="profit-percent" checked={showProfitInPercent} onCheckedChange={setShowProfitInPercent} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-calculate">Auto-Calculate Returns</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically calculate returns based on odds and stake
                    </p>
                  </div>
                  <Switch
                    id="auto-calculate"
                    checked={autoCalculateReturns}
                    onCheckedChange={setAutoCalculateReturns}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
