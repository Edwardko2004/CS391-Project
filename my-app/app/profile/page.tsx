'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'
import { User, Mail, Calendar, Edit, Save, X, Hash, Copy } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [editingBio, setEditingBio] = useState(false)
  const [bioText, setBioText] = useState('')
  const [bioLoading, setBioLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const fetchUserData = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      router.push('/login')
      return
    }

    setUserEmail(user.email || '')
    setFirstName(user.user_metadata?.first_name || '')
    setLastName(user.user_metadata?.last_name || '')
    setCreatedAt(user.created_at || new Date().toISOString())
    setUserId(user.id || '')
    setBioText(user.user_metadata?.bio || '')
    
    setLoading(false)
  }

  useEffect(() => {
    fetchUserData()
  }, [router])

  const handleEditProfile = () => {
    router.push('/profile/settings')
  }

  const handleSaveBio = async () => {
    if (bioLoading) return
    
    setBioLoading(true)
    setMessage('Saving bio...')
    setMessageType('success')

    // Set a timeout to force refresh even if Supabase hangs
    const forceRefreshTimeout = setTimeout(() => {
      setMessage('Bio saved (sync may be delayed). Refreshing...')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }, 3000) // Force refresh after 3 seconds

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No user found')
      
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          bio: bioText
        }
      })

      clearTimeout(forceRefreshTimeout) // Cancel the force refresh if success

      if (error) throw error
      
      setMessage('✓ Bio saved! Refreshing...')
      
      // Normal refresh after 1 second
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
    } catch (error: any) {
      clearTimeout(forceRefreshTimeout)
      setMessageType('error')
      setMessage('Error saving bio')
      setBioLoading(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleCancelEdit = () => {
    const resetBio = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setBioText(user?.user_metadata?.bio || '')
      setEditingBio(false)
    }
    resetBio()
  }

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText(userId)
      setMessageType('success')
      setMessage('✓ User ID copied!')
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      setMessageType('error')
      setMessage('Failed to copy User ID')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  const displayName = firstName && lastName 
    ? `${firstName} ${lastName}`
    : firstName 
      ? firstName
      : userEmail.split('@')[0]

  // Format user ID for display
  const formatUserId = (id: string) => {
    if (id.length <= 12) return id
    return `${id.substring(0, 8)}...${id.substring(id.length - 4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-900/30 border border-green-700 text-green-400'
              : 'bg-red-900/30 border border-red-700 text-red-400'
          }`}>
            {message}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                {/* Profile Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                    <User size={48} />
                  </div>
                  <button
                    onClick={handleEditProfile}
                    className="absolute bottom-0 right-0 bg-cyan-600 hover:bg-cyan-700 p-2 rounded-full transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                </div>

                {/* Profile Info */}
                <div>
                  <h2 className="text-2xl font-bold mb-1">{displayName}</h2>
                  <p className="text-gray-400 flex items-center gap-2">
                    <Mail size={16} />
                    {userEmail}
                  </p>
                  <p className="text-gray-400 flex items-center gap-2 mt-2">
                    <Calendar size={16} />
                    Joined {new Date(createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 flex items-center gap-2 mt-2 text-sm">
                    <Hash size={14} />
                    <span title={userId} className="font-mono">
                      ID: {formatUserId(userId)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-cyan-400">0</p>
                  <p className="text-sm text-gray-400">Events Created</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-cyan-400">0</p>
                  <p className="text-sm text-gray-400">Reservations</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-cyan-400">0</p>
                  <p className="text-sm text-gray-400">Attending</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-cyan-400">0</p>
                  <p className="text-sm text-gray-400">Hosted</p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="border-t border-gray-800 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">About Me</h3>
                  {!editingBio ? (
                    <button
                      onClick={() => setEditingBio(true)}
                      className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition"
                    >
                      <Edit size={14} />
                      {bioText ? 'Edit Bio' : 'Add Bio'}
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveBio}
                        disabled={bioLoading}
                        className="flex items-center gap-1 text-sm bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded transition disabled:opacity-50"
                      >
                        <Save size={14} />
                        {bioLoading ? 'Saving...' : 'Save & Refresh'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
                      >
                        <X size={14} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {editingBio ? (
                  <div className="space-y-3">
                    <textarea
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 resize-none"
                      placeholder="Tell others about yourself..."
                      maxLength={500}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Max 500 characters</span>
                      <span>{bioText.length}/500</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    {bioText ? (
                      <p className="text-gray-300 whitespace-pre-line">{bioText}</p>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
                        <p className="text-gray-500 mb-2">No bio added yet</p>
                        <button
                          onClick={() => setEditingBio(true)}
                          className="text-cyan-400 hover:text-cyan-300 text-sm"
                        >
                          Add a bio
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/create-event')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold py-3 rounded-lg hover:opacity-90 transition"
                >
                  Create New Event
                </button>
                <button
                  onClick={() => router.push('/events')}
                  className="w-full border border-cyan-500 text-cyan-400 font-semibold py-3 rounded-lg hover:bg-cyan-500/10 transition"
                >
                  Browse Events
                </button>
                <button
                  onClick={handleEditProfile}
                  className="w-full border border-gray-600 text-white py-3 rounded-lg hover:bg-white/5 transition"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Hash size={14} />
                    User ID
                  </span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs font-mono bg-gray-800 px-2 py-1 rounded text-cyan-300 cursor-help"
                      title={`Click to copy: ${userId}`}
                      onClick={copyUserId}
                    >
                      {formatUserId(userId)}
                    </span>
                    <button
                      onClick={copyUserId}
                      className="text-gray-400 hover:text-cyan-400 transition"
                      title="Copy full ID"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Email Verified</span>
                  <span className="text-green-400 font-semibold">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white">
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Profile Complete</span>
                  <span className={firstName ? "text-green-400" : "text-yellow-400"}>
                    {firstName ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Bio Added</span>
                  <span className={bioText ? "text-green-400" : "text-yellow-400"}>
                    {bioText ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
