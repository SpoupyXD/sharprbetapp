"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function CompleteProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "",
    state: "",
    username: "",
    plan: "free",
    code: "",
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get current user from Supabase Auth
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!data?.user) {
        router.replace("/login")
        return
      }
      setUser(data.user)
    }
    getUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccess(false)
    setLoading(true)

    // Check that username is unique
    const { data: usernameExists, error: usernameCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("username", form.username)

    if (usernameCheckError) {
      setErrorMessage("Could not check username. Please try again.")
      setLoading(false)
      return
    }
    if (usernameExists && usernameExists.length > 0) {
      setErrorMessage("Username is already taken. Please choose another.")
      setLoading(false)
      return
    }

    // Insert user profile into Supabase
    const { error: dbError } = await supabase.from("users").insert({
      email: user?.email,
      user_id: user?.id, // Save the Supabase Auth user ID for easy lookup
      first_name: form.firstName,
      last_name: form.lastName,
      username: form.username,
      country: form.country,
      state: form.state,
      plan: form.plan,
      referral_code: form.code || null,
    })

    if (dbError) {
      if (
        dbError.message &&
        dbError.message.includes('duplicate key value violates unique constraint "users_username_key"')
      ) {
        setErrorMessage("That username is already taken. Please choose a different one.")
      } else {
        setErrorMessage("An error occurred while saving your info. Please try again.")
      }
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    // Redirect to dashboard or your desired page after success
    setTimeout(() => {
      router.replace("/dashboard")
    }, 1200)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-background/90 rounded-xl shadow-lg p-8 space-y-6 border mt-8"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Complete Your Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="modern-input p-3 rounded border w-full" placeholder="First Name *" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        <input className="modern-input p-3 rounded border w-full" placeholder="Last Name *" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select className="modern-input p-3 rounded border w-full" required value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
          <option value="">Select Country *</option>
          <option value="Australia">Australia</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
        </select>
        <input className="modern-input p-3 rounded border w-full" placeholder="State/Province *" required value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
      </div>
      <input className="modern-input p-3 rounded border w-full" placeholder="Username *" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
      <input className="modern-input p-3 rounded border w-full" placeholder="Have a code? (optional)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
      <div className="flex items-center gap-2">
        <select className="modern-input p-3 rounded border" value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
        <label className="text-sm">Select plan *</label>
      </div>
      {errorMessage && (
        <div className="text-red-600 text-center font-semibold">
          {errorMessage}
        </div>
      )}
      {success && (
        <div className="text-green-600 text-center font-semibold">
          Profile created successfully! Redirecting...
        </div>
      )}
      <Button className="w-full mt-4" type="submit" disabled={loading}>{loading ? "Saving..." : "Save Profile"}</Button>
    </form>
  )
}
