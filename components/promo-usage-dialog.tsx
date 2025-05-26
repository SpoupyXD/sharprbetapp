"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { loadPromoUsage } from "@/lib/storage"

export function PromoUsageDialog({ open, onOpenChange }) {
  const [promoUsage, setPromoUsage] = useState({})
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [availableDates, setAvailableDates] = useState([])

  // Load promo usage data from localStorage
  useEffect(() => {
    if (open) {
      const storedPromoUsage = loadPromoUsage()
      setPromoUsage(storedPromoUsage)

      // Get available dates
      const dates = Object.keys(storedPromoUsage).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      setAvailableDates(dates)

      // Set selected date to most recent date if available
      if (dates.length > 0) {
        setSelectedDate(dates[0])
      }
    }
  }, [open])

  // Get bookies for the selected date
  const bookiesForDate = selectedDate && promoUsage[selectedDate] ? Object.keys(promoUsage[selectedDate]) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Promotional Offer Usage</DialogTitle>
          <DialogDescription>Track your promotional offer usage across bookmakers</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={selectedDate} onValueChange={setSelectedDate}>
          <TabsList className="mb-4">
            {availableDates.map((date) => (
              <TabsTrigger key={date} value={date}>
                {format(new Date(date), "dd MMM yyyy")}
              </TabsTrigger>
            ))}
          </TabsList>

          {availableDates.map((date) => (
            <TabsContent key={date} value={date}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookiesForDate.length > 0 ? (
                    bookiesForDate.map((bookie) => (
                      <Card key={bookie}>
                        <CardHeader className="pb-2">
                          <CardTitle>{bookie}</CardTitle>
                          <CardDescription>
                            {promoUsage[selectedDate][bookie].length} promotional offers used
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Stake</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {promoUsage[selectedDate][bookie].map((promo, index) => (
                                <TableRow key={index}>
                                  <TableCell>{promo.time}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-purple-500/10 text-purple-600">
                                      {promo.type === "bonusForPlacing"
                                        ? "Placing"
                                        : promo.type === "bonusFor2nd"
                                          ? "2nd"
                                          : "Extra"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>${promo.stake}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8">
                      <p className="text-muted-foreground">No promotional offers used on this date</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
