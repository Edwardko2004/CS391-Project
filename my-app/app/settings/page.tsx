// app/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [firstName, setFirstName] = useState('')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [eventReminders, setEventReminders] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
    }

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user.id)
        .single()
      
      setFirstName(data?.first_name || '')
    }
    fetchUser()

    // Listen for theme changes
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
      if (newTheme) {
        setTheme(newTheme)
      }
    }
    
    window.addEventListener('themechange', handleThemeChange)
    return () => window.removeEventListener('themechange', handleThemeChange)
  }, [router])

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme)
    const html = document.documentElement
    if (newTheme === 'light') {
      html.classList.remove('dark')
    } else {
      html.classList.add('dark')
    }
    localStorage.setItem('theme', newTheme)
    window.dispatchEvent(new Event('themechange'))
  }

  const handleSaveProfile = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return <div className="p-8">Loading...</div>

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#141510] text-[#ededed]' 
        : 'bg-white text-[#171717]'
    }`}>
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => router.back()}
          className={`mb-6 hover:opacity-80 transition ${
            theme === 'dark' ? 'text-[#ededed]' : 'text-[#171717]'
          }`}
        >
          ← Back
        </button>

        <div className={`rounded-lg p-6 ${
          theme === 'dark' 
            ? 'bg-[#2d3748] border border-gray-800' 
            : 'bg-white shadow-lg border border-gray-200'
        }`}>
          <h1 className={`text-2xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-[#171717]'
          }`}>
            Settings
          </h1>
          
          <div className="space-y-8">
            {/* Theme Settings */}
            <div className="space-y-4">
              <h2 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-[#171717]'
              }`}>
                Appearance
              </h2>
              
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-[#171717]'
                    }`}>
                      Theme
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Choose your preferred theme
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        theme === 'dark'
                          ? 'bg-gray-900 border-[#08957d] text-white'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Dark
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        theme === 'light'
                          ? 'bg-white border-[#CC0000] text-[#CC0000] shadow'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Light (BU)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Rest of settings page... */}
            <div className="space-y-4">
              <h2 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-[#171717]'
              }`}>
                Profile Information
              </h2>
              
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className={`w-full rounded-lg px-4 py-2 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border border-gray-600 text-white opacity-50 cursor-not-allowed'
                          : 'bg-gray-200 border border-gray-300 text-[#171717] opacity-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      className={`w-full rounded-lg px-4 py-2 focus:outline-none ${
                        theme === 'dark'
                          ? 'bg-gray-700 border border-gray-600 text-white focus:border-[#08957d]'
                          : 'bg-white border border-gray-300 text-[#171717] focus:border-[#CC0000]'
                      }`}
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      theme === 'dark'
                        ? 'bg-[#08957d] text-white hover:bg-[#0aa78d]'
                        : 'bg-[#CC0000] text-white hover:bg-[#B30000]'
                    } disabled:opacity-50`}
                  >
                    {saving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-[#171717]'
              }`}>
                Account Information
              </h2>
              
              <div className={`p-4 rounded-lg space-y-3 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    Account Created
                  </span>
                  <span className={theme === 'dark' ? 'text-white' : 'text-[#171717]'}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to log out?')) {
                    await supabase.auth.signOut()
                    router.push('/login')
                  }
                }}
                className={`px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-red-900/30 border-red-700 text-red-400 hover:bg-red-900/50'
                    : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                }`}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
