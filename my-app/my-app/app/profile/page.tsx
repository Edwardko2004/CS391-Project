'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { User, Mail, Calendar, Edit, Save, X, Hash, Copy, Ticket, Users, LogOut, Plus, ArrowRight } from 'lucide-react'
import { getUserUpcomingReservations, getUserPastReservations, getUserUpcomingHostedEvents, getUserPastHostedEvents } from '../lib/supabaseQueries'

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
  const [stats, setStats] = useState({
    upcomingReservations: 0,
    pastReservations: 0,
    upcomingHosted: 0,
    pastHosted: 0
  })

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
    
    // Fetch stats
    await fetchUserStats(user.id)
    
    setLoading(false)
  }

  const fetchUserStats = async (userId: string) => {
    try {
      const [upcomingRes, pastRes, upcomingHosted, pastHosted] = await Promise.all([
        getUserUpcomingReservations(userId),
        getUserPastReservations(userId),
        getUserUpcomingHostedEvents(userId),
        getUserPastHostedEvents(userId)
      ]);

      setStats({
        upcomingReservations: upcomingRes.data?.length || 0,
        pastReservations: pastRes.data?.length || 0,
        upcomingHosted: upcomingHosted.data?.length || 0,
        pastHosted: pastHosted.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleEditProfile = () => {
    router.push('/profile/settings')
  }

  const handleSaveBio = async () => {
    if (bioLoading) return
    
    setBioLoading(true)
    setMessage('Saving bio...')
    setMessageType('success')

    const forceRefreshTimeout = setTimeout(() => {
      setMessage('Bio saved (sync may be delayed). Refreshing...')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }, 3000)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No user found')
      
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          bio: bioText
        }
      })

      clearTimeout(forceRefreshTimeout)

      if (error) throw error
      
      setMessage('✓ Bio saved! Refreshing...')
      
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
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

  const formatUserId = (id: string) => {
    if (id.length <= 12) return id
    return `${id.substring(0, 8)}...${id.substring(id.length - 4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] text-white p-6">
      <div className="max-w-6xl mx-auto">
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
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account information and activities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reservations Card */}
              <div 
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors cursor-pointer group"
                onClick={() => router.push('/reservations')}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-900/30 rounded-lg group-hover:bg-cyan-900/50 transition">
                      <Ticket size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Reservations</h3>
                      <p className="text-sm text-gray-400">View and manage bookings</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-500 group-hover:text-cyan-400 transition" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-800/30 p-2 rounded text-center">
                    <div className="text-lg font-bold text-cyan-400">{stats.upcomingReservations}</div>
                    <div className="text-xs text-gray-400">Upcoming</div>
                  </div>
                  <div className="bg-gray-800/30 p-2 rounded text-center">
                    <div className="text-lg font-bold text-cyan-400">{stats.pastReservations}</div>
                    <div className="text-xs text-gray-400">Past</div>
                  </div>
                </div>
              </div>

              {/* Hosted Events Card */}
              <div 
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-colors cursor-pointer group"
                onClick={() => router.push('/hosted-events')}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-900/30 rounded-lg group-hover:bg-purple-900/50 transition">
                      <Users size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Hosting</h3>
                      <p className="text-sm text-gray-400">Manage your events</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-500 group-hover:text-purple-400 transition" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-800/30 p-2 rounded text-center">
                    <div className="text-lg font-bold text-purple-400">{stats.upcomingHosted}</div>
                    <div className="text-xs text-gray-400">Upcoming</div>
                  </div>
                  <div className="bg-gray-800/30 p-2 rounded text-center">
                    <div className="text-lg font-bold text-purple-400">{stats.pastHosted}</div>
                    <div className="text-xs text-gray-400">Past</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                {/* Profile Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                    <User size={32} />
                  </div>
                  <button
                    onClick={handleEditProfile}
                    className="absolute -bottom-1 -right-1 bg-cyan-600 hover:bg-cyan-700 p-2 rounded-full transition-colors"
                    title="Edit profile"
                  >
                    <Edit size={12} />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">{displayName}</h2>
                  <p className="text-gray-400 flex items-center gap-2 text-sm">
                    <Mail size={14} />
                    <span className="truncate">{userEmail}</span>
                  </p>
                  <p className="text-gray-400 flex items-center gap-2 text-sm mt-1">
                    <Calendar size={14} />
                    Joined {new Date(createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="border-t border-gray-800 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">About Me</h3>
                  {!editingBio ? (
                    <button
                      onClick={() => setEditingBio(true)}
                      className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition"
                    >
                      <Edit size={12} />
                      {bioText ? 'Edit Bio' : 'Add Bio'}
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveBio}
                        disabled={bioLoading}
                        className="flex items-center gap-1 text-sm bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded transition disabled:opacity-50"
                      >
                        <Save size={12} />
                        {bioLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
                      >
                        <X size={12} />
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
                      className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 resize-none text-sm"
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
                      <p className="text-gray-300 whitespace-pre-line text-sm">{bioText}</p>
                    ) : (
                      <div className="text-center py-6 border-2 border-dashed border-gray-700 rounded-lg">
                        <p className="text-gray-500 mb-2 text-sm">No bio added yet</p>
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

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/create-event')}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Create Event
                </button>
                <button
                  onClick={() => router.push('/events')}
                  className="w-full border border-cyan-500 text-cyan-400 font-medium py-2.5 rounded-lg hover:bg-cyan-500/10 transition flex items-center justify-center gap-2"
                >
                  <Calendar size={16} />
                  Browse Events
                </button>
                <button
                  onClick={() => router.push('/profile/settings')}
                  className="w-full border border-gray-600 text-white py-2.5 rounded-lg hover:bg-white/5 transition flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Settings
                </button>
              </div>
            </div>

            {/* Account Status Card - WITH User ID */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Hash size={12} />
                    User ID
                  </span>
                  <div className="flex items-center gap-1">
                    <span 
                      className="text-xs font-mono bg-gray-800 px-2 py-1 rounded text-cyan-300 cursor-help truncate max-w-[100px]"
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
                      <Copy size={10} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Email Verified</span>
                  <span className="text-green-400">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Member Since</span>
                  <span className="text-white text-sm">
                    {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Profile Complete</span>
                  <span className={firstName ? "text-green-400" : "text-yellow-400"}>
                    {firstName ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Bio Added</span>
                  <span className={bioText ? "text-green-400" : "text-yellow-400"}>
                    {bioText ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="w-full border border-red-700 text-red-400 font-medium py-2.5 rounded-lg hover:bg-red-900/20 transition flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
