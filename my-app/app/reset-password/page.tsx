'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    setLoading(false)
    if (error) alert(error.message)
    else alert('Password reset email sent! Please check your inbox.')
  }

  return (
    <form
      onSubmit={handleReset}
      className="flex flex-col gap-3 max-w-md mx-auto mt-20"
    >
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Reset Email'}
      </button>
    </form>
  )
}
