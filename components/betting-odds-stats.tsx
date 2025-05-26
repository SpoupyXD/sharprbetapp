"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function BettingOddsStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Betting Odds Statistics</CardTitle>
        <CardDescription>Analysis of your performance based on betting odds ranges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Betting Odds - Back Bet Statistics</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Odds Range</TableHead>
                  <TableHead className="text-right">All Bets</TableHead>
                  <TableHead className="text-right">Win Rate</TableHead>
                  <TableHead className="text-right">Loss Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Average Odds (dec)</TableCell>
                  <TableCell className="text-right">3.81</TableCell>
                  <TableCell className="text-right">2.58</TableCell>
                  <TableCell className="text-right">4.71</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Average Bet Size</TableCell>
                  <TableCell className="text-right">$96.14</TableCell>
                  <TableCell className="text-right">$69.03</TableCell>
                  <TableCell className="text-right">$74.02</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">1.01 - 1.50</TableCell>
                  <TableCell className="text-right">87</TableCell>
                  <TableCell className="text-right">92.0%</TableCell>
                  <TableCell className="text-right">8.0%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">1.51 - 2.00</TableCell>
                  <TableCell className="text-right">156</TableCell>
                  <TableCell className="text-right">78.2%</TableCell>
                  <TableCell className="text-right">21.8%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">2.01 - 3.00</TableCell>
                  <TableCell className="text-right">243</TableCell>
                  <TableCell className="text-right">52.7%</TableCell>
                  <TableCell className="text-right">47.3%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">3.01 - 5.00</TableCell>
                  <TableCell className="text-right">312</TableCell>
                  <TableCell className="text-right">38.5%</TableCell>
                  <TableCell className="text-right">61.5%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">5.01 - 10.00</TableCell>
                  <TableCell className="text-right">187</TableCell>
                  <TableCell className="text-right">24.1%</TableCell>
                  <TableCell className="text-right">75.9%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">10.01+</TableCell>
                  <TableCell className="text-right">220</TableCell>
                  <TableCell className="text-right">12.3%</TableCell>
                  <TableCell className="text-right">87.7%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Pre-Game vs. In-Play</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Total Bets</TableHead>
                  <TableHead className="text-right">Net Profit</TableHead>
                  <TableHead className="text-right">Unit Profit</TableHead>
                  <TableHead className="text-right">Return</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">In-Play Betting</TableCell>
                  <TableCell className="text-right">$</TableCell>
                  <TableCell className="text-right">$</TableCell>
                  <TableCell className="text-right">0.00</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pre-game Betting</TableCell>
                  <TableCell className="text-right">$92,686.15</TableCell>
                  <TableCell className="text-right text-green-600">$9,415.10</TableCell>
                  <TableCell className="text-right">941.51</TableCell>
                  <TableCell className="text-right">10.16%</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h3 className="text-lg font-medium mb-4 mt-6">Back vs Lay</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Total Bets</TableHead>
                  <TableHead className="text-right">Net Profit</TableHead>
                  <TableHead className="text-right">Unit Profit</TableHead>
                  <TableHead className="text-right">Return</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Back Bets</TableCell>
                  <TableCell className="text-right">$79,075.15</TableCell>
                  <TableCell className="text-right text-green-600">$9,392.13</TableCell>
                  <TableCell className="text-right">939.21</TableCell>
                  <TableCell className="text-right">11.88%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Lay Bets</TableCell>
                  <TableCell className="text-right">$13,611.00</TableCell>
                  <TableCell className="text-right text-green-600">$22.97</TableCell>
                  <TableCell className="text-right">2.30</TableCell>
                  <TableCell className="text-right">0.17%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Pending Bets</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Pending Bets</TableCell>
                <TableCell className="text-right">1</TableCell>
                <TableCell className="text-right">$20.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Potential Winnings</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">$160.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Potential Profit</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">$140.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
