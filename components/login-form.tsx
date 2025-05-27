"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "./auth-provider"
import { TrendingUp } from "lucide-react"

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)

if (!success) {
  setError("Invalid email or password. Please try again.")
  return
}

if (onSuccess) onSuccess()


if (onSuccess) onSuccess()
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 p-6">
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold brand-gradient">SharpR</span>
        </div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button variant="link" className="h-auto p-0 text-sm">
              Forgot password?
            </Button>
          </div>
          <div className="relative">
  <Input
    id="password"
    required
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
    className="pr-16"
  />
  <button
    type="button"
    className="absolute right-3 top-[10px] text-xs text-muted-foreground"
    onClick={() => setShowPassword((prev) => !prev)}
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>

        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Button variant="link" className="h-auto p-0">
          Sign up
        </Button>
      </div>
    </div>
  )
}
