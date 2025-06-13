// /app/payment/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function PaymentPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    async function loadUser() {
      // 1) Check if the user is logged in
      const {
        data: { user: supaUser },
        error: fetchError,
      } = await supabase.auth.getUser()

      if (fetchError || !supaUser) {
        // Not authenticated → send to login
        router.replace("/login")
        return
      }

      setUser(supaUser)
    }

    loadUser()
  }, [router])

  const handlePayment = async () => {
    setProcessing(true)
    setError("")

    try {
      // 2) Update their plan to "pro" (it should already be "pro" if they selected it earlier, but we double-check)
      const { error: updateErr } = await supabase
        .from("users")
        .update({ plan: "pro" })
        .eq("id", user.id)

      if (updateErr) throw updateErr

      // 3) Redirect to dashboard once the plan is confirmed
      router.replace("/dashboard")
    } catch (err: any) {
      console.error(err)
      setError("Payment failed. Please try again.")
      setProcessing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-lg p-8 space-y-6 text-center">
        <h2 className="text-2xl font-bold text-white">Confirm Your Pro Plan</h2>
        <p className="text-gray-300">
          You selected <strong>Pro – $9.99/month</strong>. Complete payment below to unlock Pro features.
        </p>

        {error && <p className="text-red-500">{error}</p>}

        <Button
          onClick={handlePayment}
          disabled={processing}
          className="w-full py-4 text-lg"
        >
          {processing ? "Processing…" : "Complete Payment"}
        </Button>

        <p className="text-gray-400 text-sm">
          Prefer to skip for now?{" "}
          <a href="/dashboard" className="underline text-blue-500 hover:text-blue-400">
            Go to Dashboard
          </a>
        </p>
      </div>
    </div>
  )
}
