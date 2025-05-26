"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export function BankrollManager() {
  const [totalBankroll, setTotalBankroll] = useState<number>(5000)
  const [unitSize, setUnitSize] = useState<number>(100)
  const [unitSizeType, setUnitSizeType] = useState<string>("fixed")
  const [unitSizePercent, setUnitSizePercent] = useState<number>(2)
  const [enableStakingPlan, setEnableStakingPlan] = useState<boolean>(false)
  const [stakingPlan, setStakingPlan] = useState<string>("flat")

  // Calculate actual unit size based on settings
  const calculatedUnitSize = unitSizeType === "fixed" ? unitSize : totalBankroll * (unitSizePercent / 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Bankroll Management
        </CardTitle>
        <CardDescription>Configure your bankroll and staking strategy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="total-bankroll">Total Bankroll</Label>
            <div className="flex items-center gap-2">
              <Input
                id="total-bankroll"
                type="number"
                min="0"
                value={totalBankroll}
                onChange={(e) => setTotalBankroll(Number.parseFloat(e.target.value) || 0)}
              />
              <Button
                variant="outline"
                className="whitespace-nowrap"
                onClick={() => {
                  const newValue = window.prompt("Enter new bankroll amount:", totalBankroll.toString())
                  if (newValue && !isNaN(Number.parseFloat(newValue))) {
                    setTotalBankroll(Number.parseFloat(newValue))
                  }
                }}
              >
                Update
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Unit Size Settings</h3>

            <div className="space-y-2">
              <Label htmlFor="unit-size-type">Unit Size Type</Label>
              <Select value={unitSizeType} onValueChange={setUnitSizeType}>
                <SelectTrigger id="unit-size-type">
                  <SelectValue placeholder="Select unit size type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="percentage">Percentage of Bankroll</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {unitSizeType === "fixed" ? (
              <div className="space-y-2">
                <Label htmlFor="unit-size">Unit Size (Fixed Amount)</Label>
                <Input
                  id="unit-size"
                  type="number"
                  min="1"
                  value={unitSize}
                  onChange={(e) => setUnitSize(Number.parseFloat(e.target.value) || 1)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="unit-size-percent">Unit Size (% of Bankroll)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="unit-size-percent"
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={unitSizePercent}
                    onChange={(e) => setUnitSizePercent(Number.parseFloat(e.target.value) || 0.1)}
                  />
                  <span className="text-lg">%</span>
                </div>
              </div>
            )}

            <div className="p-4 border rounded-md bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Unit Size:</span>
                <span className="text-xl font-bold">${calculatedUnitSize.toFixed(2)}</span>
              </div>
              {unitSizeType === "percentage" && (
                <p className="text-sm text-muted-foreground mt-1">
                  {unitSizePercent}% of your ${totalBankroll.toFixed(2)} bankroll
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-staking-plan">Advanced Staking Plan</Label>
                <p className="text-sm text-muted-foreground">Enable progressive staking strategies</p>
              </div>
              <Switch id="enable-staking-plan" checked={enableStakingPlan} onCheckedChange={setEnableStakingPlan} />
            </div>

            {enableStakingPlan && (
              <div className="space-y-2">
                <Label htmlFor="staking-plan">Staking Plan</Label>
                <Select value={stakingPlan} onValueChange={setStakingPlan}>
                  <SelectTrigger id="staking-plan">
                    <SelectValue placeholder="Select staking plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat Staking (Same unit size)</SelectItem>
                    <SelectItem value="percentage">Percentage Staking</SelectItem>
                    <SelectItem value="kelly">Kelly Criterion</SelectItem>
                    <SelectItem value="martingale">Martingale (Double after loss)</SelectItem>
                    <SelectItem value="fibonacci">Fibonacci Sequence</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  {stakingPlan === "flat" && "Bet the same amount on each wager regardless of previous results."}
                  {stakingPlan === "percentage" && "Bet a fixed percentage of your current bankroll on each wager."}
                  {stakingPlan === "kelly" && "Use the Kelly Criterion to determine optimal stake size."}
                  {stakingPlan === "martingale" && "Double your stake after each loss to recover previous losses."}
                  {stakingPlan === "fibonacci" && "Increase stakes according to the Fibonacci sequence after losses."}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save Bankroll Settings</Button>
      </CardFooter>
    </Card>
  )
}
