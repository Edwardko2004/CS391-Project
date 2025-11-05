'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) alert(error.message)
    else {
      alert('Password updated successfully!')
      router.push('/login')
    }
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="flex flex-col gap-3 max-w-md mx-auto mt-20"
    >
      <h1 className="text-2xl font-bold mb-4">Set New Password</h1>
      <input
        type="password"
        placeholder="New password"
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
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  )
}
