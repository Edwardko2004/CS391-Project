'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 1️⃣ Create auth account
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName }, // store in user metadata
      },
    })
    if (signupError) {
      alert(signupError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    alert('Account created! Please check your email to verify your account.')
  }

  return (
    <form
      onSubmit={handleSignup}
      className="flex flex-col gap-3 max-w-md mx-auto mt-20 mb-20"
    >
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>

      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  )
}
