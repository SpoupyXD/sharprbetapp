"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const planFromQuery = searchParams.get("plan") || "free"
  const [selectedPlan, setSelectedPlan] = useState(planFromQuery)

  useEffect(() => {
    setSelectedPlan(planFromQuery)
  }, [planFromQuery])

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-6 py-12">
      <div className="w-full max-w-lg border rounded-lg shadow-xl p-8 bg-card space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Confirm Your Plan</h1>
          <p className="text-muted-foreground">
            You're almost done! Review your selected plan and complete payment if needed.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="plan" className="text-sm font-medium">
            Choose your plan:
          </label>
          <select
            id="plan"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="free">Free – $0</option>
            <option value="pro">Pro – $9.99/month</option>
          </select>
        </div>

        {selectedPlan === "pro" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Info</label>
            <input type="text" placeholder="Card number" className="w-full border rounded p-2" />
            <input type="text" placeholder="MM / YY" className="w-full border rounded p-2" />
            <input type="text" placeholder="CVC" className="w-full border rounded p-2" />
          </div>
        )}

        <Button className="w-full mt-4">
          {selectedPlan === "free" ? "Start Using SharpR" : "Complete Payment & Start"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Want to change details? <a href="/register" className="underline text-primary">Go back</a>
        </p>
      </div>
    </div>
  )
}
