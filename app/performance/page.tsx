"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, Download } from "lucide-react"
import { PerformanceByBookmaker } from "@/components/performance-by-bookmaker"
import { PerformanceBySport } from "@/components/performance-by-sport"
import { BettingOddsStats } from "@/components/betting-odds-stats"
import { CashingOutAnalysis } from "@/components/cashing-out-analysis"

export default function PerformancePage() {
  const [timeframe, setTimeframe] = useState("all")
  const [sportFilter, setSportFilter] = useState("all")
  const [bookieFilter, setBookieFilter] = useState("all")

  return (
    <div className="pt-2 p-6 md:px-10 md:pb-10">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Performance Analysis</h1>
        <p className="text-muted-foreground">
          Detailed analysis of your betting performance across all bookmakers and sports
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="horse-racing">Horse Racing</SelectItem>
              <SelectItem value="tennis">Tennis</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="cricket">Cricket</SelectItem>
            </SelectContent>
          </Select>

          <Select value={bookieFilter} onValueChange={setBookieFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select bookmaker" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookmakers</SelectItem>
              <SelectItem value="bet365">Bet365</SelectItem>
              <SelectItem value="ladbrokes">Ladbrokes</SelectItem>
              <SelectItem value="william-hill">William Hill</SelectItem>
              <SelectItem value="betfair">Betfair</SelectItem>
              <SelectItem value="unibet">Unibet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Advanced Filters
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$40,037.52</div>
            <p className="text-xs text-muted-foreground">Across all bookmakers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$9,615.10</div>
            <p className="text-xs text-muted-foreground">Across all bookmakers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$9,415.10</div>
            <p className="text-xs text-muted-foreground">10.16% return on investment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Credit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$11,128.15</div>
            <p className="text-xs text-muted-foreground">Across all bookmakers</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="w-full mb-6">
        <TabsList className="mb-6 grid w-full grid-cols-5">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="by-bookmaker">By Bookmaker</TabsTrigger>
          <TabsTrigger value="by-sport">By Sport</TabsTrigger>
          <TabsTrigger value="odds-analysis">Odds Analysis</TabsTrigger>
          <TabsTrigger value="cashout">Cashout Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Overview of your betting performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Account Summary</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Total Deposits</TableCell>
                        <TableCell className="text-right">$40,037.52</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Pending Withdrawals</TableCell>
                        <TableCell className="text-right">$0.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total Withdrawals</TableCell>
                        <TableCell className="text-right">$9,615.10</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Pending Bets</TableCell>
                        <TableCell className="text-right">$0.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Free Bets Remaining</TableCell>
                        <TableCell className="text-right">$419.33</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Available Credit/Funds</TableCell>
                        <TableCell className="text-right">$11,128.15</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Performance High/Low Points</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead className="text-right">Currency</TableHead>
                        <TableHead className="text-right">Units</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Current Profit/Loss</TableCell>
                        <TableCell className="text-right text-green-600">$9,415.10</TableCell>
                        <TableCell className="text-right text-green-600">941.51</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Highest Profit Level</TableCell>
                        <TableCell className="text-right text-green-600">$9,858.80</TableCell>
                        <TableCell className="text-right text-green-600">985.88</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Lowest Profit Level</TableCell>
                        <TableCell className="text-right text-red-600">-$147.40</TableCell>
                        <TableCell className="text-right text-red-600">-14.74</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Decline Since Peak</TableCell>
                        <TableCell className="text-right text-red-600">-$180.70</TableCell>
                        <TableCell className="text-right text-red-600">-18.07</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Rise Since Trough</TableCell>
                        <TableCell className="text-right text-green-600">$9,562.50</TableCell>
                        <TableCell className="text-right text-green-600">956.26</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-6">
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
                      <TableCell className="font-medium">Total</TableCell>
                      <TableCell className="text-right">1,205</TableCell>
                      <TableCell className="text-right">100.0%</TableCell>
                      <TableCell className="text-right">-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Profit/Loss</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Wagers</TableHead>
                      <TableHead className="text-right">Net Profit</TableHead>
                      <TableHead className="text-right">Return</TableHead>
                      <TableHead className="text-right">Including Bonus Credit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Currency</TableCell>
                      <TableCell className="text-right">$92,686.15</TableCell>
                      <TableCell className="text-right text-green-600">$9,415.10</TableCell>
                      <TableCell className="text-right">10.16%</TableCell>
                      <TableCell className="text-right text-green-600">$9,415.10</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Units</TableCell>
                      <TableCell className="text-right">9,268.62</TableCell>
                      <TableCell className="text-right">941.51</TableCell>
                      <TableCell className="text-right">10.16%</TableCell>
                      <TableCell className="text-right">941.51</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-bookmaker">
          <PerformanceByBookmaker />
        </TabsContent>

        <TabsContent value="by-sport">
          <PerformanceBySport />
        </TabsContent>

        <TabsContent value="odds-analysis">
          <BettingOddsStats />
        </TabsContent>

        <TabsContent value="cashout">
          <CashingOutAnalysis />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>
    </div>
  )
}
