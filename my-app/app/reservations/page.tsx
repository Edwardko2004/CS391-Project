'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import { getUserUpcomingReservations, getUserPastReservations } from '../lib/supabaseQueries';
import { Calendar, MapPin, User, Hash, CheckCircle, Clock, CheckCheck, Copy } from 'lucide-react';

interface ReservationWithEvent {
  id: number;
  event_id: number;
  profile_id: string;
  created_at: string;
  confirmation_code: string;
  is_checked_in: boolean;
  checked_in_at: string | null;
  events: {
    title: string;
    time: string;
    location: string;
    organizer: string;
    status: string;
  };
}

export default function ReservationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [upcomingReservations, setUpcomingReservations] = useState<ReservationWithEvent[]>([]);
  const [pastReservations, setPastReservations] = useState<ReservationWithEvent[]>([]);

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
    fetchReservations(user.id);
  };

  const fetchReservations = async (userId: string) => {
    try {
      setLoading(true);
      const upcomingPromise = getUserUpcomingReservations(userId);
      const pastPromise = getUserPastReservations(userId);
      
      const [upcomingResult, pastResult] = await Promise.all([upcomingPromise, pastPromise]);
      
      if (upcomingResult.data) setUpcomingReservations(upcomingResult.data as ReservationWithEvent[]);
      if (pastResult.data) setPastReservations(pastResult.data as ReservationWithEvent[]);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyConfirmationCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert('Confirmation code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
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

  const currentReservations = activeTab === 'upcoming' ? upcomingReservations : pastReservations;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Reservations</h1>
          <p className="text-gray-400">View your event reservations and confirmation codes</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-900/50 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === 'upcoming'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock size={16} />
              Upcoming ({upcomingReservations.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === 'past'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCheck size={16} />
              Past ({pastReservations.length})
            </div>
          </button>
        </div>

        {/* Reservations List */}
        {currentReservations.length === 0 ? (
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center">
            <Calendar size={48} className="mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-semibold mb-2">No {activeTab} reservations</h3>
            <p className="text-gray-400 mb-4">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming reservations."
                : "You haven't attended any events yet."}
            </p>
            <button
              onClick={() => router.push('/events')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold mb-1 line-clamp-2">{reservation.events.title}</h3>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <User size={12} className="mr-1" />
                      <span className="truncate">By {reservation.events.organizer}</span>
                    </div>
                  </div>
                  {reservation.is_checked_in && (
                    <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircle size={10} className="mr-1" />
                      Checked In
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className="mr-2 text-cyan-400 flex-shrink-0" />
                    <span>{formatDate(reservation.events.time)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin size={14} className="mr-2 text-cyan-400 flex-shrink-0" />
                    <span className="text-gray-300 line-clamp-2">{reservation.events.location}</span>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="flex items-center">
                      <Hash size={14} className="mr-2 text-cyan-400 flex-shrink-0" />
                      <span className="text-sm text-gray-400">Confirmation:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-800 px-3 py-1 rounded text-cyan-300 font-mono text-sm">
                        {reservation.confirmation_code}
                      </code>
                      <button
                        onClick={() => copyConfirmationCode(reservation.confirmation_code)}
                        className="text-gray-400 hover:text-cyan-400 transition text-sm"
                        title="Copy code"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
