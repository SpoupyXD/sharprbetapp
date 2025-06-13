"use client"

import { v4 as uuidv4 } from "uuid"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

// Define the props interface
interface RegisterFormProps {
  selectedPlan?: string
}

// Export as the default component
export default function RegisterForm({ selectedPlan = "free" }: RegisterFormProps) {
  const router = useRouter()

  // Local form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    state: "",
    plan: selectedPlan,
  })

  // Error / success messages
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSuccess] = useState(false)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccess(false)

    // 1) Password match validation
    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    // 2) Check username uniqueness in 'users' table
    const { data: usernameCheck } = await supabase
      .from("users")
      .select("id")
      .eq("username", form.username)
      .limit(1)

    if (usernameCheck && usernameCheck.length > 0) {
      setErrorMessage("Username already taken.")
      return
    }

    // 3) Check email uniqueness in 'users' table
    const { data: emailCheck } = await supabase
      .from("users")
      .select("id")
      .eq("email", form.email)
      .limit(1)

    if (emailCheck && emailCheck.length > 0) {
      setErrorMessage("Email already registered.")
      return
    }

    // 4) Insert a new row into 'users' table
    const tempId = uuidv4() // generate a unique ID
    const { error: insertError } = await supabase.from("users").insert({
      id: tempId,
      email: form.email,
      username: form.username,
      first_name: form.firstName,
      last_name: form.lastName,
      country: form.country,
      state: form.state,
      plan: form.plan,
    })

    if (insertError) {
      setErrorMessage("Could not save profile. Try again.")
      return
    }

    // 5) Trigger Supabase Auth sign-up (sends confirmation email)
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/post-confirm`,
      },
    })

    if (authError) {
      setErrorMessage("Signup failed: " + authError.message)
      return
    }

    // If everything succeeded, show success message and navigate
    setSuccess(true)
    router.push("/registration-success")
    // Pass the user’s email along so we can resend the link if needed
router.push(`/registration-success?email=${encodeURIComponent(form.email)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background rounded-xl p-8 lg:p-10 space-y-6 border border-gray-700"
    >
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-white text-center">
        Create your SharpR account
      </h2>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
          className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          required
          className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Username & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="Email"
          value={form.email}
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Password & Confirm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          placeholder="Password"
          value={form.password}
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="Confirm Password"
          value={form.confirmPassword}
          type="password"
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
          className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Country, State & Plan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <select
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          required
          className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select Country
          </option>
          <option value="Australia">Australia</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
        </select>
        <input
          placeholder="State/Province"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          required
          className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={form.plan}
          onChange={(e) => setForm({ ...form, plan: e.target.value })}
          className="w-full bg-background border border-gray-600 rounded-md p-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        >
          <option value="free">Free – $0</option>
          <option value="pro">Pro – $9.99/mo</option>
        </select>
      </div>

      {/* Error / Success Messages */}
      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}
      {success && (
        <p className="text-green-500 text-center">Check your email to confirm.</p>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full py-4 text-lg">
        Sign Up
      </Button>
    </form>
  )
}
