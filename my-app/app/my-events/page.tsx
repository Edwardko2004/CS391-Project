// app/my-events/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function MyEventsPage() {
  const [user, setUser] = useState<any>(null)
  const [hostedEvents, setHostedEvents] = useState<any[]>([])
  const [attendingEvents, setAttendingEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'hosted' | 'attending'>('hosted')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Fetch events hosted by user
      const { data: hostedData } = await supabase
        .from('events')
        .select('*')
        .eq('created_by', user.id)
        .order('event_date', { ascending: false })

      setHostedEvents(hostedData || [])

      // Fetch events user is attending
      const { data: allEvents } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false })

      const attending = allEvents?.filter(event => 
        event.attendees && event.attendees.includes(user.id)
      ) || []

      setAttendingEvents(attending)
      setLoading(false)
    }
    fetchData()
  }, [router])

  const getEventStatus = (eventDate: string) => {
    const date = new Date(eventDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (date < today) return 'past'
    if (date.toDateString() === today.toDateString()) return 'today'
    return 'upcoming'
  }

  if (!user) return <div>Loading...</div>

  const eventsToShow = activeTab === 'hosted' ? hostedEvents : attendingEvents

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="text-white mb-6 hover:text-cyan-400"
        >
          ← Back
        </button>

        <div className="bg-white/5 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">My Events</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-800 mb-6">
            <button
              onClick={() => setActiveTab('hosted')}
              className={`px-4 py-2 font-medium ${activeTab === 'hosted' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
              Hosted ({hostedEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('attending')}
              className={`px-4 py-2 font-medium ${activeTab === 'attending' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
              Attending ({attendingEvents.length})
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading events...</p>
            </div>
          ) : eventsToShow.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {activeTab === 'hosted' 
                  ? "You haven't hosted any events yet." 
                  : "You're not attending any events yet."}
              </p>
              <button
                onClick={() => router.push('/events')}
                className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
              >
                {activeTab === 'hosted' ? 'Host an Event' : 'Browse Events'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventsToShow.map((event) => {
                const status = getEventStatus(event.event_date)
                const statusColors = {
                  past: 'bg-gray-800 text-gray-400',
                  today: 'bg-orange-900/30 text-orange-400 border border-orange-800',
                  upcoming: 'bg-green-900/30 text-green-400 border border-green-800'
                }

                return (
                  <div 
                    key={event.id}
                    onClick={() => router.push(`/events/${event.id}`)}
                    className="bg-white/5 border border-gray-800 rounded-lg p-4 hover:bg-white/10 cursor-pointer transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{event.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${statusColors[status]}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="text-white">
                          {new Date(event.event_date).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="text-white">{event.location || 'Not specified'}</p>
                      </div>
                    </div>

                    {activeTab === 'hosted' && (
                      <div className="mt-3 pt-3 border-t border-gray-800">
                        <p className="text-xs text-gray-500">
                          {event.attendees?.length || 0} people attending
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
