// /app/registration-success/page.tsx
"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email") || ""

  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const resendConfirmation = async () => {
    if (!email) {
      setMessage("Couldn’t find your email. Please register again.")
      return
    }

    setLoading(true)
    setMessage(null)

    // Attempt a dummy sign-in so Supabase knows the user exists but is unconfirmed
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: "dummy-password", // this will fail with “not confirmed”
    })

    if (signInError) {
      // Now request a new signup–type magic link to resend the confirmation email
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/magiclink?type=signup`,
        {
          method: "POST",
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      )

      if (response.ok) {
        setMessage("Sent you another confirmation link—check your inbox!")
      } else {
        setMessage("Couldn’t send another email. Please try registering again.")
      }
    } else {
      // If signInWithPassword succeeded, they are already confirmed
      setMessage("Your account is already confirmed—please log in.")
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-lg p-8 space-y-6 text-center">
        <h1 className="text-3xl font-bold text-white">You're Almost There! 📧</h1>
        <p className="text-gray-300">
          We’ve sent a confirmation email to <strong>{email}</strong>.
          Please click the link in your inbox (or spam folder) to confirm your account.
        </p>

        <Button
          onClick={resendConfirmation}
          disabled={loading}
          className="w-full py-3 text-lg"
        >
          {loading ? "Resending…" : "Resend Confirmation Email"}
        </Button>

        {message && (
          <p className="mt-4 text-sm text-gray-200">{message}</p>
        )}
      </div>
    </div>
  )
}
