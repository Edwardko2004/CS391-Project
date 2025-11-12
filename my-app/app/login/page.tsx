// app/login/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)
    if (error) alert(error.message)
    else router.push('/')
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-3 max-w-md mx-auto mt-20 mb-20">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>

    
      <Link href="/reset-password" className="text-blue-400 underline text-center mt-2 hover:text-blue-600">
        Forgot Password?
      </Link>
    </form>
  )
}
