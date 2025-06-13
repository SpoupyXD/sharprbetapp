// /app/post-confirm/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function PostConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    async function handlePostConfirm() {
      // 1) Ensure the user is authenticated after clicking the email link
      const {
        data: { user },
        error: fetchUserError,
      } = await supabase.auth.getUser()

      if (fetchUserError || !user) {
        // If something went wrong, redirect to login
        router.replace("/login")
        return
      }

      // 2) Fetch the user's plan from the "users" table
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("plan")
        .eq("id", user.id)
        .single()

      if (profileError || !profileData) {
        // If we can’t find their profile, send them to login
        router.replace("/login")
        return
      }

      // 3) Redirect based on their plan
      if (profileData.plan === "pro") {
        router.replace("/payment")
      } else {
        router.replace("/dashboard")
      }
    }

    handlePostConfirm()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Confirming your account… 🔄</h2>
        <p className="text-gray-300">Please wait while we log you in.</p>
      </div>
    </div>
  )
}
