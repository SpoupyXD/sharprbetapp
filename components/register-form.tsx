"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export function RegisterForm({
  onSuccess,
  selectedPlan = "free",
}: {
  onSuccess?: () => void
  selectedPlan?: string
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "",
    state: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
    plan: selectedPlan,
    over18: false,
    agreed: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccess(false)

    // 0. Quick client-side validation
    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    // 1. Check if email is already used in users table
    const { data: emailExists, error: emailCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("email", form.email)

    if (emailCheckError) {
      setErrorMessage("Could not check email. Please try again.")
      return
    }
    if (emailExists && emailExists.length > 0) {
      setErrorMessage("Email is already in use.")
      return
    }

    // 2. Check if username is already used in users table
    const { data: usernameExists, error: usernameCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("username", form.username)

    if (usernameCheckError) {
      setErrorMessage("Could not check username. Please try again.")
      return
    }
    if (usernameExists && usernameExists.length > 0) {
      setErrorMessage("Username is already taken.")
      return
    }

    // 3. Try to sign in with email/password to check for confirmed or unconfirmed accounts
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password || "dummy-password",
    })

    if (signInError) {
      // If error indicates "not confirmed", show specific message
      if (
        signInError.message &&
        (
          signInError.message.toLowerCase().includes("email not confirmed") ||
          signInError.message.toLowerCase().includes("confirm")
        )
      ) {
        setErrorMessage("That email is registered but not yet confirmed. Please check your email (and spam folder) for the confirmation link.")
        return
      }
      // If error is something else (e.g., "Invalid login credentials"), it's OK, continue to signup
    } else {
      // If sign in succeeds, the account exists and is confirmed
      setErrorMessage("This email is already registered. Please log in instead.")
      return
    }

    // 4. Register user with Supabase Auth (will resend confirmation email for unconfirmed users)
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (authError) {
      if (authError.message && authError.message.toLowerCase().includes("user already registered")) {
        setErrorMessage("That email is already in use.")
      } else {
        setErrorMessage("Failed to create account: " + authError.message)
      }
      return
    }

    // 5. Insert extra user info into Supabase 'users' table
    const { error: dbError } = await supabase.from("users").insert({
      email: form.email,
      first_name: form.firstName,
      last_name: form.lastName,
      username: form.username,
      country: form.country,
      state: form.state,
      plan: form.plan,
      referral_code: form.code || null,
    })

    if (dbError) {
      // Check for unique constraint violation (Postgres/Supabase format)
      if (
        dbError.message &&
        dbError.message.includes('duplicate key value violates unique constraint "users_username_key"')
      ) {
        setErrorMessage("That username is already taken. Please choose a different one.")
      } else if (
        dbError.message &&
        dbError.message.includes('duplicate key value violates unique constraint "users_email_key"')
      ) {
        setErrorMessage("That email address is already in use. Please use another email.")
      } else {
        setErrorMessage("An error occurred while saving your info. Please try again.")
      }
      return
    }

    // ✅ All done — redirect or show success
    setSuccess(true)
    if (onSuccess) onSuccess()
    else window.location.href = "/payment?plan=" + form.plan
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-background/90 rounded-xl shadow-lg p-8 space-y-6 border"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Create your SharpR account</h2>

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
      <input className="modern-input p-3 rounded border w-full" placeholder="Email *" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

      <div className="relative">
        <input className="modern-input p-3 rounded border w-full pr-10" placeholder="Password *" type={showPassword ? "text" : "password"} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="button" className="absolute right-2 top-3 text-xs" onClick={() => setShowPassword(v => !v)}>{showPassword ? "Hide" : "Show"}</button>
      </div>

      <div className="relative">
        <input className="modern-input p-3 rounded border w-full pr-10" placeholder="Confirm Password *" type={showConfirm ? "text" : "password"} required value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
        <button type="button" className="absolute right-2 top-3 text-xs" onClick={() => setShowConfirm(v => !v)}>{showConfirm ? "Hide" : "Show"}</button>
      </div>

      <input className="modern-input p-3 rounded border w-full" placeholder="Have a code? (optional)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.over18} onChange={e => setForm({ ...form, over18: e.target.checked })} required />
        <label className="text-sm">I am over 18 years old *</label>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.agreed} onChange={e => setForm({ ...form, agreed: e.target.checked })} required />
        <label className="text-sm">
          I agree to the <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a> *
        </label>
      </div>

      {errorMessage && (
        <div className="text-red-600 text-center font-semibold">
          {errorMessage}
        </div>
      )}
      {success && (
        <div className="text-green-600 text-center font-semibold">
          Registration successful! Please check your email to confirm your account.
        </div>
      )}

      <Button className="w-full mt-4" type="submit">Sign Up</Button>
    </form>
  )
}
