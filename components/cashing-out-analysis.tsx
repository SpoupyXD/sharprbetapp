"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function CashingOutAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cashing Out Analysis</CardTitle>
        <CardDescription>Analysis of your cash out decisions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Cashing Out Analysis</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Tally</TableHead>
                  <TableHead className="text-right">Currency</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Cashed Out Winning Bets</TableCell>
                  <TableCell className="text-right">3</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right">0.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Cashed Out Losing Bets</TableCell>
                  <TableCell className="text-right">5</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right">0.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Cashed Out Other Results</TableCell>
                  <TableCell className="text-right">0</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right">0.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Cashed Out Results</TableCell>
                  <TableCell className="text-right">8</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right">0.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>Positive numbers indicate you were better off by cashing out.</p>
              <p>Negative numbers indicate you would have been better off if you had not cashed out.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Outcome Frequencies</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Result</TableHead>
                  <TableHead className="text-right"># Bets</TableHead>
                  <TableHead className="text-right">% Total</TableHead>
                  <TableHead className="text-right">Win %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Won</TableCell>
                  <TableCell className="text-right">513</TableCell>
                  <TableCell className="text-right">42.6%</TableCell>
                  <TableCell className="text-right">43.2%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Lost</TableCell>
                  <TableCell className="text-right">674</TableCell>
                  <TableCell className="text-right">55.9%</TableCell>
                  <TableCell className="text-right">56.8%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Half Won/Half Lost</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right">0.0%</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Refunded</TableCell>
                  <TableCell className="text-right">18</TableCell>
                  <TableCell className="text-right">1.5%</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Push</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right">0.0%</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total</TableCell>
                  <TableCell className="text-right">1,205</TableCell>
                  <TableCell className="text-right">100.0%</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
