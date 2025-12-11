'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import { getUserUpcomingHostedEvents, getUserPastHostedEvents, checkInReservation } from '../lib/supabaseQueries';
import { Calendar, MapPin, Users, Hash, CheckCircle, XCircle, User, Copy } from 'lucide-react';

interface ReservationDetail {
  id: number;
  profile_id: string;
  confirmation_code: string;
  is_checked_in: boolean;
  checked_in_at: string | null;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface HostedEvent {
  id: number;
  title: string;
  time: string;
  location: string;
  capacity: number;
  status: string;
  reservations: ReservationDetail[];
}

export default function HostedEventsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [upcomingEvents, setUpcomingEvents] = useState<HostedEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<HostedEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<HostedEvent | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setUserId(user.id);
    fetchHostedEvents(user.id);
  };

  const fetchHostedEvents = async (userId: string) => {
    try {
      setLoading(true);
      const upcomingPromise = getUserUpcomingHostedEvents(userId);
      const pastPromise = getUserPastHostedEvents(userId);
      
      const [upcomingResult, pastResult] = await Promise.all([upcomingPromise, pastPromise]);
      
      if (upcomingResult.data) {
        const events = upcomingResult.data as HostedEvent[];
        setUpcomingEvents(events);
        if (events.length > 0) setSelectedEvent(events[0]);
      }
      if (pastResult.data) {
        const events = pastResult.data as HostedEvent[];
        setPastEvents(events);
        if (events.length > 0 && !selectedEvent) setSelectedEvent(events[0]);
      }
    } catch (error) {
      console.error('Error fetching hosted events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (reservationId: number) => {
    try {
      await checkInReservation(reservationId);
      fetchHostedEvents(userId);
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Failed to check in. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyConfirmationCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert('Confirmation code copied!');
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  const getEventStats = (event: HostedEvent) => {
    const checkedIn = event.reservations?.filter(r => r.is_checked_in).length || 0;
    const total = event.reservations?.length || 0;
    const notCheckedIn = total - checkedIn;
    return { checkedIn, notCheckedIn, total };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading hosted events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Hosted Events</h1>
          <p className="text-gray-400">Manage your events and check in attendees</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-900/50 rounded-lg p-1 w-fit">
          <button
            onClick={() => {
              setActiveTab('upcoming');
              if (upcomingEvents.length > 0) setSelectedEvent(upcomingEvents[0]);
            }}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === 'upcoming'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              Upcoming Hosting ({upcomingEvents.length})
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('past');
              if (pastEvents.length > 0) setSelectedEvent(pastEvents[0]);
            }}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === 'past'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              Past Hosted ({pastEvents.length})
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Events List */}
          <div className="lg:col-span-2">
            {currentEvents.length === 0 ? (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center">
                <Calendar size={48} className="mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-semibold mb-2">
                  No {activeTab} hosted events
                </h3>
                <p className="text-gray-400 mb-4">
                  {activeTab === 'upcoming'
                    ? "You're not hosting any upcoming events."
                    : "You haven't hosted any events yet."}
                </p>
                <button
                  onClick={() => router.push('/create-event')}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                  Create New Event
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentEvents.map((event) => {
                  const stats = getEventStats(event);
                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`bg-gray-900/50 backdrop-blur-sm border rounded-lg p-4 cursor-pointer transition-all hover:border-cyan-500/50 ${
                        selectedEvent?.id === event.id
                          ? 'border-cyan-500'
                          : 'border-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1 line-clamp-2">{event.title}</h3>
                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar size={12} className="mr-1" />
                            <span>{formatDate(event.time)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="bg-gray-800/30 p-2 rounded">
                          <div className="flex items-center text-green-400">
                            <CheckCircle size={12} className="mr-1" />
                            <span className="text-xs">Checked In</span>
                          </div>
                          <div className="text-lg font-bold">{stats.checkedIn}</div>
                        </div>
                        <div className="bg-gray-800/30 p-2 rounded">
                          <div className="flex items-center text-yellow-400">
                            <XCircle size={12} className="mr-1" />
                            <span className="text-xs">Awaiting</span>
                          </div>
                          <div className="text-lg font-bold">{stats.notCheckedIn}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Event Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedEvent ? (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">{selectedEvent.title}</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-2 text-cyan-400" />
                      {formatDate(selectedEvent.time)}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={12} className="mr-2 text-cyan-400" />
                      <span className="line-clamp-2">{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={12} className="mr-2 text-cyan-400" />
                      <span>{getEventStats(selectedEvent).total} attendees</span>
                    </div>
                  </div>
                </div>

                {/* Attendee List */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {selectedEvent.reservations?.map((reservation) => (
                    <div
                      key={reservation.id}
                      className={`p-3 rounded border ${
                        reservation.is_checked_in
                          ? 'border-green-800/30 bg-green-900/10'
                          : 'border-gray-700 bg-gray-800/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <div className="font-medium">
                            {reservation.profiles.first_name} {reservation.profiles.last_name}
                          </div>
                          <div className="text-xs text-gray-400 truncate">{reservation.profiles.email}</div>
                        </div>
                        {!reservation.is_checked_in && activeTab === 'upcoming' && (
                          <button
                            onClick={() => handleCheckIn(reservation.id)}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-2 py-1 rounded transition ml-2"
                          >
                            Check In
                          </button>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center">
                          <Hash size={10} className="mr-1 text-cyan-400" />
                          <code 
                            className="font-mono bg-black/30 px-2 py-1 rounded cursor-pointer hover:bg-black/50"
                            onClick={() => copyConfirmationCode(reservation.confirmation_code)}
                          >
                            {reservation.confirmation_code}
                          </code>
                        </div>
                        {reservation.is_checked_in ? (
                          <span className="text-green-400 text-xs flex items-center">
                            <CheckCircle size={10} className="mr-1" />
                            Checked In
                          </span>
                        ) : (
                          <span className="text-yellow-400 text-xs">Awaiting</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 text-center">
                <Users size={32} className="mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400 text-sm">Select an event to view attendees</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
