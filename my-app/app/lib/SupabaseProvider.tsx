'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const SupabaseContext = createContext<any>(null)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch current session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    // Listen for login/logout
    const { data: subscription } = supabase.auth.onAuthStateChange((an_event: any, session: any) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <SupabaseContext.Provider value={{ user, setUser, signOut, loading }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseContext)
  if (!context) throw new Error('useSupabaseAuth must be used inside SupabaseProvider')
  return context
}
