// /app/register/page.tsx
"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import RegisterForm from "@/components/register-form"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const initialPlan = searchParams.get("plan") || "free"
  const [selectedPlan, setSelectedPlan] = useState(initialPlan)
  const [showPlanSelector, setShowPlanSelector] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-3xl bg-card rounded-2xl shadow-lg p-10 lg:p-16 space-y-10">
        {/* Logo + Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <Logo className="h-12 w-12" />
          <h1 className="text-4xl font-extrabold text-white">Create Your SharpR Account</h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Fill in your details below, then choose a plan. We’ll only send a confirmation email once everything is valid.
          </p>
        </div>

        {/* Account Info Form */}
        <RegisterForm selectedPlan={selectedPlan} />

        {/* Choose Plan CTA */}
        {!showPlanSelector && (
          <div className="flex justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowPlanSelector(true)}
              className="px-8 py-4 text-lg"
            >
              Choose Plan
            </Button>
          </div>
        )}

        {/* Plan Selector + Optional Payment */}
        {showPlanSelector && (
          <div className="bg-background rounded-xl p-8 lg:p-10 space-y-8 border border-gray-700">
            <div className="space-y-3">
              <label htmlFor="plan" className="block text-sm font-medium text-gray-300">
                Select Your Plan
              </label>
              <select
                id="plan"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 text-base focus:ring-2 focus:ring-blue-500"
              >
                <option value="free">Free – $0</option>
                <option value="pro">Pro – $9.99/month</option>
              </select>
            </div>

            {selectedPlan !== "free" && (
              <div className="space-y-6">
                <label className="block text-sm font-medium text-gray-300">
                  Payment Information
                </label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Name on Card"
                    className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <a href="/" className="text-blue-500 underline hover:text-blue-400">
                Log in
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
