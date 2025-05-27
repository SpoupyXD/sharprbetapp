"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
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
    over18: false,
    agreed: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // You'd add your real registration logic here!
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // You can add real validation here before redirecting
  
    alert("Registration submitted!");
  
    // Redirect to /payment
    if (onSuccess) {
      onSuccess(); // This should do: window.location.href = "/payment" (from your RegisterPage)
    } else {
      window.location.href = "/payment";
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-background/90 rounded-xl shadow-lg p-8 space-y-6 border"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Create your SharpR account</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="modern-input p-3 rounded border w-full"
          placeholder="First Name *"
          required
          value={form.firstName}
          onChange={e => setForm({ ...form, firstName: e.target.value })}
        />
        <input
          className="modern-input p-3 rounded border w-full"
          placeholder="Last Name *"
          required
          value={form.lastName}
          onChange={e => setForm({ ...form, lastName: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="modern-input p-3 rounded border w-full"
          required
          value={form.country}
          onChange={e => setForm({ ...form, country: e.target.value })}
        >
          <option value="">Select Country *</option>
          <option value="Australia">Australia</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          {/* Add more countries */}
        </select>
        <input
          className="modern-input p-3 rounded border w-full"
          placeholder="State/Province *"
          required
          value={form.state}
          onChange={e => setForm({ ...form, state: e.target.value })}
        />
      </div>
      <input
        className="modern-input p-3 rounded border w-full"
        placeholder="Username *"
        required
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
      />
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
        <button
          type="button"
          className="absolute right-2 top-3 text-xs"
          onClick={() => setShowPassword(v => !v)}
        >
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
        <button
          type="button"
          className="absolute right-2 top-3 text-xs"
          onClick={() => setShowConfirm(v => !v)}
        >
          {showConfirm ? "Hide" : "Show"}
        </button>
      </div>
      <input
        className="modern-input p-3 rounded border w-full"
        placeholder="Have a code? (optional)"
        value={form.code}
        onChange={e => setForm({ ...form, code: e.target.value })}
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.over18}
          onChange={e => setForm({ ...form, over18: e.target.checked })}
          required
        />
        <label className="text-sm">
          I am over 18 years old *
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={e => setForm({ ...form, agreed: e.target.checked })}
          required
        />
        <label className="text-sm">
          I agree to the <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a> *
        </label>
      </div>
      <Button className="w-full mt-4" type="submit">
        Sign Up
      </Button>
      
    </form>
  )
}

