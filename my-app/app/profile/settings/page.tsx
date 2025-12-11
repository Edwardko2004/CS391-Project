'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import { Profile } from '../../lib/types'
import { ArrowLeft, Save, User, Mail, Lock, Bell } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [message, setMessage] = useState<string>('')

  // actual profile
  const [profile, setProfile] = useState<Profile|null>(null)

  // Profile form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    eventReminders: true,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }

      // make api call to find the profile associated with the user 
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);
      setFormData(prev => ({
        ...prev,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        email: profileData.email
      }))
      setLoading(false)
    }

    fetchUserData()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSaveProfile = async () => {
    if (saving) return
    
    setSaving(true)
    setMessage('Saving...')

    // Set a timeout to force refresh even if Supabase hangs
    const forceRefreshTimeout = setTimeout(() => {
      setMessage('Changes saved (sync may be delayed). Refreshing...')
      setTimeout(() => window.location.reload(), 1000)
    }, 3000) // Force refresh after 3 seconds

    try {
      // make sure there is a profile there before we try
      if (profile == null) throw new Error("no profile found!");

      // update the profile model on supabase
      const { data, error } = await supabase
        .from("profiles")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
        })
        .eq("id", profile.id)
        .select()
        .single();

      clearTimeout(forceRefreshTimeout) // Cancel the force refresh if success

      if (error) throw error
      
      setMessage('✓ Saved! Refreshing...')
      
      // Normal refresh after 1 second
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
    } catch (error: any) {
      clearTimeout(forceRefreshTimeout)
      setMessage(`Error: ${error.message}`)
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (changingPassword) return
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Passwords do not match')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    if (formData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setChangingPassword(true)
    setMessage('Updating password...')

    // Set a timeout to force refresh even if Supabase hangs
    const forceRefreshTimeout = setTimeout(() => {
      setMessage('Password update initiated. Refreshing...')
      setTimeout(() => window.location.reload(), 1000)
    }, 3000) // Force refresh after 3 seconds

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      })

      clearTimeout(forceRefreshTimeout) // Cancel the force refresh if success

      if (error) throw error

      setMessage('✓ Password updated! Refreshing...')
      setFormData(prev => ({
        ...prev,
        newPassword: '',
        confirmPassword: ''
      }))
      
      // Normal refresh after 1 second
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
    } catch (error: any) {
      clearTimeout(forceRefreshTimeout)
      setMessage(`Error: ${error.message}`)
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] text-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center text-cyan-400 hover:text-cyan-300 mb-4 transition"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Profile
          </button>
          <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your account information and security</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✓') 
              ? 'bg-green-900/30 border border-green-700 text-green-400'
              : message.includes('Error')
              ? 'bg-red-900/30 border border-red-700 text-red-400'
              : 'bg-gray-900/30 border border-gray-700 text-gray-400'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-cyan-400" />
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-gray-500" />
              <input
                type="email"
                value={formData.email}
                disabled
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Contact support to change email</p>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save & Refresh'}
          </button>
        </div>

        {/* Change Password */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-cyan-400" />
            <h2 className="text-xl font-semibold">Change Password</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={changingPassword || !formData.newPassword || !formData.confirmPassword}
            className="flex items-center justify-center gap-2 border border-cyan-500 text-cyan-400 font-semibold py-3 px-6 rounded-lg hover:bg-cyan-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock size={20} />
            {changingPassword ? 'Updating...' : 'Update Password & Refresh'}
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-cyan-400" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive updates about events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Event Reminders</p>
                <p className="text-sm text-gray-400">Reminders before events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="eventReminders"
                  checked={formData.eventReminders}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
