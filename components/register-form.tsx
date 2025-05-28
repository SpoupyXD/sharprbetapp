"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("")
    setSuccess(false)

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    // Attempt to sign up with Supabase Auth
    const { error: authError } = await supabase.auth.signUp({
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

    setSuccess(true)
    // Show user to check their email for confirmation
    // You might want to redirect them after a timeout or after confirmation
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-background/90 rounded-xl shadow-lg p-8 space-y-6 border"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Create your SharpR account</h2>
      <input
        className="modern-input p-3 rounded border w-full"
        placeholder="Email *"
        type="email"
        required
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <div className="relative">
        <input
          className="modern-input p-3 rounded border w-full pr-10"
          placeholder="Password *"
          type={showPassword ? "text" : "password"}
          required
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button type="button" className="absolute right-2 top-3 text-xs" onClick={() => setShowPassword(v => !v)}>
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <div className="relative">
        <input
          className="modern-input p-3 rounded border w-full pr-10"
          placeholder="Confirm Password *"
          type={showConfirm ? "text" : "password"}
          required
          value={form.confirmPassword}
          onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
        />
        <button type="button" className="absolute right-2 top-3 text-xs" onClick={() => setShowConfirm(v => !v)}>
          {showConfirm ? "Hide" : "Show"}
        </button>
      </div>
      {errorMessage && (
        <div className="text-red-600 text-center font-semibold">{errorMessage}</div>
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
