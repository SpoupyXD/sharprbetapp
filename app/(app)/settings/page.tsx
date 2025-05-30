"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/components/theme-provider"

export default function SettingsPage() {
  // State for general settings
  // Replace this line:
  // const [theme, setTheme] = useState("system")

  // With this:
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)

  // State for bet columns visibility
  const [betColumns, setBetColumns] = useState({
    date: true,
    event: true,
    selection: true,
    odds: true,
    stake: true,
    status: true,
    profit: true,
    bookie: true,
    sport: true,
    strategy: true,
    tipper: true,
  })

  // State for horse racing columns visibility
  const [horseRacingColumns, setHorseRacingColumns] = useState({
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
    strategy: true,
    tipper: true,
    jockey: true,
    trainer: true,
    distance: true,
    surface: true,
    conditions: false,
  })

  // Toggle function for bet columns
  const toggleBetColumn = (column) => {
    setBetColumns({
      ...betColumns,
      [column]: !betColumns[column],
    })
  }

  // Toggle function for horse racing columns
  const toggleHorseRacingColumn = (column) => {
    setHorseRacingColumns({
      ...horseRacingColumns,
      [column]: !horseRacingColumns[column],
    })
  }

  return (
    <div className="pt-2 p-6 md:px-10 md:pb-10">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences and display settings</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="bets">Bets</TabsTrigger>
          <TabsTrigger value="horse-racing">Horse Racing</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general application preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  {/* Update the theme selection logic to use the useTheme hook: */}
                  <Select
                    value={theme}
                    onValueChange={(value) => {
                      setTheme(value as "light" | "dark" | "system")
                    }}
                  >
                    <SelectTrigger id="theme" className="w-full">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Choose between light, dark, or system theme</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about your bets</p>
                  </div>
                  <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive email alerts about important updates</p>
                  </div>
                  <Switch id="email-alerts" checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="bets">
          <Card>
            <CardHeader>
              <CardTitle>Bet Display Settings</CardTitle>
              <CardDescription>Customize how your bets are displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Visible Columns</h3>
                <p className="text-sm text-muted-foreground">Select which columns to display in your bets list</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(betColumns).map(([column, isVisible]) => (
                    <div key={column} className="flex items-center justify-between">
                      <Label htmlFor={`col-${column}`} className="flex-1">
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                      </Label>
                      <Switch
                        id={`col-${column}`}
                        checked={isVisible}
                        onCheckedChange={() => toggleBetColumn(column)}
                        aria-label={`Toggle ${column} column visibility`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Other Display Settings</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-profit-percent">Show Profit as Percentage</Label>
                    <p className="text-sm text-muted-foreground">Display profit as a percentage of stake</p>
                  </div>
                  <Switch id="show-profit-percent" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="highlight-winners">Highlight Winners</Label>
                    <p className="text-sm text-muted-foreground">Apply special highlighting to winning bets</p>
                  </div>
                  <Switch id="highlight-winners" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="horse-racing">
          <Card>
            <CardHeader>
              <CardTitle>Horse Racing Display Settings</CardTitle>
              <CardDescription>Customize how your horse racing bets are displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Visible Columns</h3>
                <p className="text-sm text-muted-foreground">
                  Select which columns to display in your horse racing bets list
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(horseRacingColumns).map(([column, isVisible]) => (
                    <div key={column} className="flex items-center justify-between">
                      <Label htmlFor={`hr-col-${column}`} className="flex-1">
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                      </Label>
                      <Switch
                        id={`hr-col-${column}`}
                        checked={isVisible}
                        onCheckedChange={() => toggleHorseRacingColumn(column)}
                        aria-label={`Toggle ${column} column visibility`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Other Horse Racing Settings</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-track-stats">Show Track Statistics</Label>
                    <p className="text-sm text-muted-foreground">Display track statistics when viewing races</p>
                  </div>
                  <Switch id="show-track-stats" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-calculate-returns">Auto-Calculate Returns</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically calculate returns based on odds and stake
                    </p>
                  </div>
                  <Switch id="auto-calculate-returns" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="email"
                      type="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="your.email@example.com"
                      defaultValue="user@example.com"
                    />
                    <Button variant="outline">Verify</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="password"
                      type="password"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value="••••••••••••"
                      disabled
                    />
                    <Button variant="outline">Change</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="two-factor" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
