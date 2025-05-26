"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Lock, Save } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AddBookiePage() {
  const [accountType, setAccountType] = useState("bookie")
  const [isPremium, setIsPremium] = useState(false)

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center mb-6">
        <Link href="/bookies">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Account</h1>
          <p className="text-muted-foreground">Add a new bookmaker, exchange, or bank account</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Enter the details of your new account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Account Name</Label>
                <Input id="name" placeholder="e.g. Bet365, Betfair, Chase Bank" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Account Type</Label>
                <Select defaultValue="bookie" onValueChange={setAccountType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bookie">Bookmaker</SelectItem>
                    <SelectItem value="exchange">Exchange</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input id="website" placeholder="e.g. https://www.bet365.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">Current Balance ($)</Label>
                <Input id="balance" type="number" step="0.01" placeholder="e.g. 1000.00" />
              </div>

              {accountType !== "bank" && (
                <div className="space-y-2">
                  <Label htmlFor="promos">Available Promotions</Label>
                  <Input id="promos" type="number" placeholder="e.g. 2" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="owner">Account Owner</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Premium
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80 text-sm">
                          Account ownership is a premium feature. Upgrade to assign accounts to different users.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select disabled={!isPremium}>
                  <SelectTrigger id="owner">
                    <SelectValue placeholder="Select account owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="victor">Victor</SelectItem>
                    <SelectItem value="naomi">Naomi</SelectItem>
                    <SelectItem value="add">+ Add New Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="linkGroup">Link with Other Accounts</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Premium
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80 text-sm">
                          Account linking is a premium feature. Upgrade to link related accounts together.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select disabled={!isPremium}>
                  <SelectTrigger id="linkGroup">
                    <SelectValue placeholder="Select accounts to link with" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main-accounts">Main Accounts (Victor)</SelectItem>
                    <SelectItem value="naomi-accounts">Naomi's Accounts</SelectItem>
                    <SelectItem value="none">No Linking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Account Color</Label>
                <div className="flex items-center gap-2">
                  <Input id="color" type="color" defaultValue="#0088FE" className="w-12 h-10 p-1" />
                  <span className="text-sm text-muted-foreground">#0088FE</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Any additional notes about this account" className="min-h-[100px]" />
              </div>
            </div>
          </div>

          {!isPremium && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4" />
                <h3 className="font-medium">Premium Features</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Upgrade to premium to unlock account ownership and linking features. These features allow you to:
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Assign accounts to different users (e.g., Victor, Naomi)</li>
                <li>Link related accounts together for better organization</li>
                <li>Track performance by user across multiple accounts</li>
                <li>Generate user-specific reports and insights</li>
              </ul>
              <Button variant="outline" className="mt-4">
                Upgrade to Premium
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
