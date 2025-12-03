// components/UserReservedEvents.tsx
// provides a listing of all events reserved by a user

import * as Type from "../lib/types";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Calendar, MapPin, Clock } from "lucide-react";

// props for the reserved list
interface ReservedEventsProp {
    profile: Type.Profile | null;
}

// UserReservedEvents component
const UserReservedEvents: React.FC<ReservedEventsProp> = ({ profile }) => {
    const [events, setEvents] = useState<Type.Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [doQuery, setDoQuery] = useState(true);
    const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

    // useeffect to initialize the API call
    useEffect(() => {
        // async function that makes the call
        async function fetchData() {
            // dont make call if profile is null or we dont have to
            if (profile === null || doQuery === false) return;

            setLoading(true);
            setDoQuery(false);

            // find all reservations with the user and attach the event to it
            let query = supabase
                .from('reservations')
                .select('*, events(*)')
                .eq('profile_id', profile.id);

            // fetch the data
            const {data, error} = await query;

            console.log(data);

            if (error) {
                console.error(error);
            } else {
                // turn data into the list of events and set it
                const list: Type.Event[] = data.map(r => r.events)
                setEvents(list);
            }

            setLoading(false);
        }

        fetchData()
    }, [doQuery])

    const now = new Date();
    const past = events.filter((e: Type.Event) => new Date(e.time) < now);
    const upcoming = events.filter((e: Type.Event) => new Date(e.time) >= now);
    
    const displayEvents = activeTab === "upcoming" ? upcoming : past;

    const EventCard = ({ event }: { event: Type.Event }) => {
        const eventDate = new Date(event.time);
        const formattedDate = eventDate.toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });

        return (
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-gray-700 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-600 flex-shrink-0">
                        <div className="text-cyan-300 font-bold text-lg">{event.title ? event.title.charAt(0).toUpperCase() : "E"}</div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white break-words">{event.title || "Untitled Event"}</h3>
                        
                        <div className="mt-3 flex flex-col gap-2 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                                <Calendar className="text-cyan-400 flex-shrink-0" size={16} />
                                <span>{formattedDate}</span>
                            </div>
                            
                            {event.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-cyan-400 flex-shrink-0" size={16} />
                                    <span className="break-words">{event.location}</span>
                                </div>
                            )}
                            
                            {event.organizer && (
                                <div className="flex items-center gap-2">
                                    <Clock className="text-cyan-400 flex-shrink-0" size={16} />
                                    <span>Hosted by {event.organizer}</span>
                                </div>
                            )}
                        </div>

                        {event.tags && event.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {(event.tags as string[]).map((tag) => (
                                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-cyan-400/10 border border-cyan-600 text-cyan-100">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // return the final component
    return (
        <div className="w-full">
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`pb-3 px-6 font-medium transition-all border-2 rounded-t-lg ${
                        activeTab === "upcoming"
                            ? "text-cyan-400 border-cyan-400 bg-cyan-400/10"
                            : "text-gray-400 border-gray-700 hover:text-gray-300 hover:border-gray-600 hover:bg-gray-900/20"
                    }`}
                >
                    Upcoming ({upcoming.length})
                </button>
                <button
                    onClick={() => setActiveTab("past")}
                    className={`pb-3 px-6 font-medium transition-all border-2 rounded-t-lg ${
                        activeTab === "past"
                            ? "text-cyan-400 border-cyan-400 bg-cyan-400/10"
                            : "text-gray-400 border-gray-700 hover:text-gray-300 hover:border-gray-600 hover:bg-gray-900/20"
                    }`}
                >
                    Past ({past.length})
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
                </div>
            ) : displayEvents.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-400">
                        {activeTab === "upcoming" ? "No upcoming events" : "No past events"}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default UserReservedEvents;