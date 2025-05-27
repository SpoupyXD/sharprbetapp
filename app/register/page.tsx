"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { RegisterForm } from "@/components/register-form"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const initialPlan = searchParams.get("plan") || "free"
  const [selectedPlan, setSelectedPlan] = useState(initialPlan)
  const [showPlanSelector, setShowPlanSelector] = useState(false)

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-6 py-12">
      <div className="w-full max-w-2xl border rounded-lg shadow-xl p-10 bg-card space-y-10">
        {/* Logo + Header */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <Logo />
          <h1 className="text-3xl font-bold">Create Your SharpR Account</h1>
          <p className="text-muted-foreground max-w-md">
            Start by entering your account info below.
          </p>
        </div>

        {/* Account Info Form */}
        <RegisterForm selectedPlan={selectedPlan} />

        {/* Choose Plan CTA */}
        {!showPlanSelector && (
          <div className="text-center">
            <Button onClick={() => setShowPlanSelector(true)} size="lg">
              Choose Plan
            </Button>
          </div>
        )}

        {/* Plan Selector + Payment Section */}
        {showPlanSelector && (
          <div className="space-y-6">
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

            {selectedPlan !== "free" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Info</label>
                <input type="text" placeholder="Card number" className="w-full border rounded p-2" />
                <input type="text" placeholder="MM / YY" className="w-full border rounded p-2" />
                <input type="text" placeholder="CVC" className="w-full border rounded p-2" />
              </div>
            )}

            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <a href="/" className="text-primary underline hover:text-primary/80">
                Log in
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
