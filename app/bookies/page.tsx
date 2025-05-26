import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { BookmakerAccountsTable } from "@/components/bookmaker-accounts-table"

export default function BookiesPage() {
  return (
    <div className="pt-2 p-6 md:px-10 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">Manage your bookmakers, exchanges, and bank accounts</p>
        </div>
        <Link href="/bookies/add">
          <Button className="rounded-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Accounts</CardTitle>
          <CardDescription>
            Track balances and manage accounts across all your bookmakers, exchanges, and banks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookmakerAccountsTable />
        </CardContent>
      </Card>
    </div>
  )
}
