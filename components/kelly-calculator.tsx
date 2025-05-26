"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calculator } from "lucide-react"

export function KellyCalculator() {
  const [odds, setOdds] = useState<number>(2.0)
  const [probability, setProbability] = useState<number>(50)
  const [bankroll, setBankroll] = useState<number>(1000)
  const [kellyFraction, setKellyFraction] = useState<number>(100) // percentage of full Kelly to use
  const [kellyStake, setKellyStake] = useState<number>(0)
  const [kellyPercentage, setKellyPercentage] = useState<number>(0)

  // Calculate Kelly stake
  useEffect(() => {
    // Convert probability from percentage to decimal
    const probDecimal = probability / 100

    // Kelly formula: f* = (bp - q) / b
    // where b = odds - 1, p = probability of winning, q = probability of losing (1-p)
    const b = odds - 1
    const p = probDecimal
    const q = 1 - p

    // Calculate full Kelly percentage
    let kellyPercent = (b * p - q) / b

    // Apply Kelly fraction
    kellyPercent = kellyPercent * (kellyFraction / 100)

    // Ensure we don't get negative values
    kellyPercent = Math.max(0, kellyPercent)

    // Calculate stake amount
    const stake = bankroll * kellyPercent

    setKellyPercentage(kellyPercent * 100)
    setKellyStake(stake)
  }, [odds, probability, bankroll, kellyFraction])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Kelly Criterion Calculator
        </CardTitle>
        <CardDescription>Calculate optimal stake size based on odds and estimated probability</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="odds">Decimal Odds</Label>
              <Input
                id="odds"
                type="number"
                min="1.01"
                step="0.01"
                value={odds}
                onChange={(e) => setOdds(Number.parseFloat(e.target.value) || 1.01)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="probability">Estimated Win Probability ({probability}%)</Label>
              <Slider
                id="probability"
                min={1}
                max={99}
                step={1}
                value={[probability]}
                onValueChange={(value) => setProbability(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankroll">Bankroll</Label>
              <Input
                id="bankroll"
                type="number"
                min="1"
                value={bankroll}
                onChange={(e) => setBankroll(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kelly-fraction">Kelly Fraction ({kellyFraction}%)</Label>
              <Slider
                id="kelly-fraction"
                min={1}
                max={100}
                step={1}
                value={[kellyFraction]}
                onValueChange={(value) => setKellyFraction(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Many bettors use a fraction of the Kelly criterion (e.g., half Kelly) to reduce variance
              </p>
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
            <div className="rounded-lg border p-4 flex-1">
              <h3 className="text-lg font-medium mb-4">Results</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Kelly Percentage:</p>
                  <p className="text-2xl font-bold">{kellyPercentage.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground">Percentage of bankroll to wager</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Recommended Stake:</p>
                  <p className="text-2xl font-bold">${kellyStake.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Based on your current bankroll</p>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    {kellyPercentage <= 0
                      ? "This bet has negative expected value. Avoid this bet."
                      : kellyPercentage > 25
                        ? "Caution: High Kelly percentage. Consider reducing your stake."
                        : "This stake balances potential growth with risk management."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
