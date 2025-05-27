"use client"


import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { error } = await supabase.auth.signInWithPassword({ email, password });

if (error) {
  if (error.message.includes("Email not confirmed")) {
    setError("Please confirm your email address before logging in.");
  } else {
    setError("Invalid email or password");
  }
  return;
}
 else {
      router.push("/dashboard") // ⬅️ This is where users go after logging in
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-card p-6 rounded-lg border shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">Log in to SharpR</h1>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="relative">
  <Label htmlFor="password">Password</Label>
  <Input
    id="password"
    type={showPassword ? "text" : "password"}
    placeholder="********"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    className="pr-16"
  />
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute top-[36px] right-3 text-sm text-muted-foreground"
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>


        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button type="submit" className="w-full">
          Log In
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Don’t have an account? <a href="/register" className="underline text-primary">Sign up</a>
        </p>
      </form>
    </div>
  )
}
