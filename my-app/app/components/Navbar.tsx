'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useSupabaseAuth } from '../lib/SupabaseProvider'

export default function Navbar() {
  const { user, signOut, loading } = useSupabaseAuth()
  const [firstName, setFirstName] = useState<string | null>(null)

  // Fetch profile once user is logged in
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single()

        if (error) console.error('Error fetching profile:', error)
        else setFirstName(data?.first_name || null)
      } else {
        setFirstName(null)
      }
    }

    fetchProfile()
  }, [user])

  return (
    <nav className="flex justify-between bg-[#0BA698] p-10 text-2xl font-bold">
      <div className="left text-[#CFDACC]">
        <Link href="/">Home</Link>
        <Link href="/create-event" className="m-5">Create</Link>
      </div>

      <div className="text-[#CFDACC]">
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            <span className="m-5">
              Welcome{firstName ? `, ${firstName}` : `, ${user.email}`}
            </span>
            <button
              onClick={signOut}
              className="underline hover:text-white"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/signup" className="m-5 hover:text-white">
              Sign up
            </Link>
            <Link href="/login" className="hover:text-white">
              Log in
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

