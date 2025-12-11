'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { User, Settings, LogOut, User as UserIcon, Ticket, Users } from 'lucide-react'

interface UserMenuProps {
  email: string
}

export default function UserMenu({ email }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [firstName, setFirstName] = useState<string>('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const fetchUserName = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.user_metadata?.first_name) {
      setFirstName(user.user_metadata.first_name)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch user first name from auth metadata
  useEffect(() => {
    fetchUserName()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'USER_UPDATED') {
          await fetchUserName() // Refresh user name
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleProfileClick = () => {
    setIsOpen(false)
    router.push('/profile')
  }

  const handleSettingsClick = () => {
    setIsOpen(false)
    router.push('/profile/settings')
  }

  const handleReservationsClick = () => {
    setIsOpen(false)
    router.push('/reservations')
  }

  const handleHostingClick = () => {
    setIsOpen(false)
    router.push('/hosted-events')
  }

  const handleLogout = async () => {
    setIsOpen(false)
    await supabase.auth.signOut()
    router.push('/login')
  }

  const displayName = firstName || email.split('@')[0]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
          <UserIcon size={16} className="text-white" />
        </div>
        <span className="text-white hidden md:inline">
          {displayName}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleProfileClick}
              className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <User size={16} className="mr-3 text-cyan-400" />
              Profile
            </button>
            
            <button
              onClick={handleSettingsClick}
              className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <Settings size={16} className="mr-3 text-cyan-400" />
              Settings
            </button>

            <div className="border-t border-gray-800 my-1"></div>
            
            <button
              onClick={handleReservationsClick}
              className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <Ticket size={16} className="mr-3 text-cyan-400" />
              Reservations
            </button>
            
            <button
              onClick={handleHostingClick}
              className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <Users size={16} className="mr-3 text-cyan-400" />
              Hosting
            </button>

            <div className="border-t border-gray-800 my-1"></div>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-gray-800 transition-colors"
            >
              <LogOut size={16} className="mr-3" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
